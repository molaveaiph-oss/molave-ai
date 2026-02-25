-- ─── Enable RLS on all tables ─────────────────────────────────────────────────

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE dentists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE dentist_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE closure_dates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs              ENABLE ROW LEVEL SECURITY;

-- ─── Helper: check admin role ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ─── Profiles ─────────────────────────────────────────────────────────────────

CREATE POLICY "authenticated users can read profiles"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Trigger inserts profiles via SECURITY DEFINER, no explicit INSERT policy needed for anon/authenticated.

-- ─── Branches ─────────────────────────────────────────────────────────────────

-- Public booking needs anon access to list active branches
CREATE POLICY "anyone can read active branches"
  ON branches FOR SELECT
  USING (is_active = true);

CREATE POLICY "authenticated users can read all branches"
  ON branches FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins can manage branches"
  ON branches FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ─── Services ─────────────────────────────────────────────────────────────────

CREATE POLICY "anyone can read active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "authenticated users can read all services"
  ON services FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins can manage services"
  ON services FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ─── Dentists ─────────────────────────────────────────────────────────────────

CREATE POLICY "anyone can read active dentists"
  ON dentists FOR SELECT
  USING (is_active = true);

CREATE POLICY "authenticated users can read all dentists"
  ON dentists FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins can manage dentists"
  ON dentists FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ─── Dentist schedules ────────────────────────────────────────────────────────

CREATE POLICY "anyone can read dentist schedules"
  ON dentist_schedules FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins can manage dentist schedules"
  ON dentist_schedules FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ─── Closure dates ────────────────────────────────────────────────────────────

CREATE POLICY "anyone can read closure dates"
  ON closure_dates FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins can manage closure dates"
  ON closure_dates FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ─── Patients ─────────────────────────────────────────────────────────────────

CREATE POLICY "authenticated users can read patients"
  ON patients FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert patients"
  ON patients FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update patients"
  ON patients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete patients"
  ON patients FOR DELETE TO authenticated USING (true);

-- Edge Functions use service_role (bypasses RLS) for anon public booking

-- ─── Appointments ─────────────────────────────────────────────────────────────

CREATE POLICY "authenticated users can read appointments"
  ON appointments FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert appointments"
  ON appointments FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update appointments"
  ON appointments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete appointments"
  ON appointments FOR DELETE TO authenticated USING (true);

-- ─── Jobs ─────────────────────────────────────────────────────────────────────

CREATE POLICY "authenticated users can read jobs"
  ON jobs FOR SELECT TO authenticated USING (true);

-- Jobs are inserted/updated by Edge Functions via service_role (bypasses RLS)
