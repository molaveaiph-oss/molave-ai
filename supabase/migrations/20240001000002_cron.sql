-- ─── pg_cron: scheduled reminder jobs ────────────────────────────────────────
--
-- Requires the pg_cron extension enabled in the Supabase dashboard under
-- Database → Extensions → pg_cron.
--
-- This job runs every day at 08:00 UTC and creates a reminder job for every
-- CONFIRMED appointment scheduled for the next day.

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'daily-reminder-jobs',   -- job name
  '0 8 * * *',             -- every day at 08:00 UTC
  $$
  INSERT INTO jobs (appointment_id, type, status, payload)
  SELECT
    a.id,
    'SEND_REMINDER',
    'PENDING',
    jsonb_build_object('appointmentId', a.id)
  FROM appointments a
  WHERE
    a.status = 'CONFIRMED'
    AND a.scheduled_at::date = (NOW() + INTERVAL '1 day')::date
    -- Avoid duplicate reminder jobs
    AND NOT EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.appointment_id = a.id
        AND j.type = 'SEND_REMINDER'
        AND j.created_at > NOW() - INTERVAL '24 hours'
    );
  $$
);
