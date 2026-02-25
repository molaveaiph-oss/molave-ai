-- ─── Supabase Realtime: enable publications ───────────────────────────────────

-- Add appointments and jobs to the realtime publication so the frontend
-- receives live updates via Supabase Realtime channels.

ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
