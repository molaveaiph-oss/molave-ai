// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'DN-';
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    const body = await req.json();
    const {
      patientName,
      patientEmail,
      patientPhone,
      branchId,
      serviceId,
      dentistId,
      scheduledAt,
      notes,
    } = body;

    if (!patientName || !patientPhone || !branchId || !serviceId || !scheduledAt) {
      return new Response(
        JSON.stringify({ error: 'patientName, patientPhone, branchId, serviceId, scheduledAt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Upsert patient by phone
    let patient: { id: string } | null = null;

    const { data: existing } = await supabase
      .from('patients')
      .select('id')
      .eq('phone', patientPhone)
      .maybeSingle();

    if (existing) {
      patient = existing;
    } else {
      const { data: created, error: patErr } = await supabase
        .from('patients')
        .insert({ name: patientName, email: patientEmail ?? null, phone: patientPhone })
        .select('id')
        .single();
      if (patErr) throw patErr;
      patient = created;
    }

    // Generate unique reference number
    let referenceNumber = generateRef();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('appointments')
        .select('id')
        .eq('reference_number', referenceNumber)
        .maybeSingle();
      if (!existing) break;
      referenceNumber = generateRef();
      attempts++;
    }

    // Create appointment
    const { data: appt, error: apptErr } = await supabase
      .from('appointments')
      .insert({
        patient_id: patient!.id,
        branch_id: branchId,
        service_id: serviceId,
        dentist_id: dentistId ?? null,
        scheduled_at: scheduledAt,
        notes: notes ?? null,
        reference_number: referenceNumber,
        status: 'PENDING',
      })
      .select()
      .single();

    if (apptErr) throw apptErr;

    // Queue confirmation job
    await supabase.from('jobs').insert({
      appointment_id: appt.id,
      type: 'CONFIRM_APPOINTMENT',
      status: 'PENDING',
      payload: { appointmentId: appt.id },
    });

    return new Response(
      JSON.stringify({ referenceNumber: appt.reference_number, appointmentId: appt.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[public-book] Error:', err);
    const message = err instanceof Error ? err.message : (err as any)?.message ?? JSON.stringify(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
