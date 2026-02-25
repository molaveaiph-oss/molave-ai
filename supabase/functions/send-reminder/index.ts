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
    const { appointmentId } = await req.json();
    if (!appointmentId) {
      return new Response(JSON.stringify({ error: 'appointmentId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a job record
    const { data: job, error: jobErr } = await supabase
      .from('jobs')
      .insert({ appointment_id: appointmentId, type: 'SEND_REMINDER', status: 'PROCESSING' })
      .select()
      .single();

    if (jobErr) throw jobErr;

    // Fetch appointment + patient details
    const { data: appt, error: apptErr } = await supabase
      .from('appointments')
      .select('*, patient:patients(*), branch:branches(*), service:services(*)')
      .eq('id', appointmentId)
      .single();

    if (apptErr || !appt) {
      await supabase.from('jobs').update({ status: 'FAILED', error: 'Appointment not found' }).eq('id', job.id);
      return new Response(JSON.stringify({ error: 'Appointment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Send reminder (extend with Resend/Twilio/etc.) ────────────────────────
    // For now we log and mark completed. Replace this section with a real
    // notification provider (e.g. Resend for email, Twilio for SMS).
    console.log(`[send-reminder] Reminder for appointment ${appt.reference_number}`, {
      patient: appt.patient?.name,
      email: appt.patient?.email,
      phone: appt.patient?.phone,
      scheduledAt: appt.scheduled_at,
      service: appt.service?.name,
      branch: appt.branch?.name,
    });

    // Mark job completed
    await supabase
      .from('jobs')
      .update({
        status: 'COMPLETED',
        result: { sentAt: new Date().toISOString(), channel: 'log' },
      })
      .eq('id', job.id);

    return new Response(JSON.stringify({ success: true, jobId: job.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-reminder] Error:', err);
    const message = err instanceof Error ? err.message : (err as any)?.message ?? JSON.stringify(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
