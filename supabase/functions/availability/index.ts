// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    const url = new URL(req.url);
    const branchId = url.searchParams.get('branchId');
    const dentistId = url.searchParams.get('dentistId');
    const date = url.searchParams.get('date'); // YYYY-MM-DD
    const durationMins = parseInt(url.searchParams.get('durationMins') ?? '30', 10);

    if (!branchId || !date) {
      return new Response(JSON.stringify({ error: 'branchId and date are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getUTCDay(); // 0=Sunday … 6=Saturday

    // Check branch closure
    const { data: closure } = await supabase
      .from('closure_dates')
      .select('id')
      .eq('date', date)
      .or(`branch_id.eq.${branchId},branch_id.is.null`)
      .maybeSingle();

    if (closure) {
      return new Response(JSON.stringify({ slots: [], closureDate: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch dentist schedules for this day
    let scheduleQuery = supabase
      .from('dentist_schedules')
      .select('*, dentist:dentists!inner(*)')
      .eq('day_of_week', dayOfWeek)
      .eq('dentist.branch_id', branchId)
      .eq('dentist.is_active', true);

    if (dentistId) {
      scheduleQuery = scheduleQuery.eq('dentist_id', dentistId);
    }

    const { data: schedules, error: schedErr } = await scheduleQuery;
    if (schedErr) throw schedErr;

    if (!schedules || schedules.length === 0) {
      return new Response(JSON.stringify({ slots: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch existing appointments for this date (to mark busy slots)
    const dayStart = `${date}T00:00:00.000Z`;
    const dayEnd = `${date}T23:59:59.999Z`;

    let apptQuery = supabase
      .from('appointments')
      .select('scheduled_at, dentist_id, service:services(duration_mins)')
      .gte('scheduled_at', dayStart)
      .lte('scheduled_at', dayEnd)
      .in('status', ['PENDING', 'CONFIRMED']);

    if (dentistId) {
      apptQuery = apptQuery.eq('dentist_id', dentistId);
    }

    const { data: existingAppts } = await apptQuery;

    // Build busy intervals per dentist
    const busyIntervals: Record<string, Array<{ start: number; end: number }>> = {};
    for (const a of existingAppts ?? []) {
      const apptStart = new Date(a.scheduled_at);
      const apptEnd = new Date(apptStart.getTime() + (a.service?.duration_mins ?? 30) * 60_000);
      const did = a.dentist_id ?? '__any__';
      busyIntervals[did] ??= [];
      busyIntervals[did].push({ start: apptStart.getTime(), end: apptEnd.getTime() });
    }

    // Generate slots from each dentist's schedule
    const slots: Array<{ time: string; dentistId: string; dentistName: string }> = [];

    for (const schedule of schedules) {
      const dentist = schedule.dentist as { id: string; name: string };
      const slotMin = schedule.slot_minutes as number;
      const stepMin = Math.min(slotMin, durationMins);

      const [startH, startM] = (schedule.start_time as string).split(':').map(Number);
      const [endH, endM] = (schedule.end_time as string).split(':').map(Number);

      const scheduleStart = Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        startH,
        startM,
      );
      const scheduleEnd = Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        endH,
        endM,
      );

      const dentistBusy = [
        ...(busyIntervals[dentist.id] ?? []),
        ...(busyIntervals['__any__'] ?? []),
      ];

      let cursor = scheduleStart;
      while (cursor + durationMins * 60_000 <= scheduleEnd) {
        const slotEnd = cursor + durationMins * 60_000;
        const isBusy = dentistBusy.some(
          (b) => cursor < b.end && slotEnd > b.start,
        );

        if (!isBusy) {
          slots.push({
            time: new Date(cursor).toISOString(),
            dentistId: dentist.id,
            dentistName: dentist.name,
          });
        }

        cursor += stepMin * 60_000;
      }
    }

    // Sort by time
    slots.sort((a, b) => a.time.localeCompare(b.time));

    return new Response(JSON.stringify({ slots }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[availability] Error:', err);
    const message = err instanceof Error ? err.message : (err as any)?.message ?? JSON.stringify(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
