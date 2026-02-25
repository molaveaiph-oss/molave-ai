-- ─── Extensions ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- ─── Updated-at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Profiles (linked to Supabase Auth users) ─────────────────────────────────

CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  role       user_role NOT NULL DEFAULT 'STAFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create a profile when a new auth user signs up
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'STAFF'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- ─── Branches ─────────────────────────────────────────────────────────────────

CREATE TABLE branches (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  address    TEXT NOT NULL,
  phone      TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER branches_updated_at
  BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Services ─────────────────────────────────────────────────────────────────

CREATE TABLE services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  duration_mins INTEGER NOT NULL DEFAULT 30,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Dentists ─────────────────────────────────────────────────────────────────

CREATE TABLE dentists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  branch_id  UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER dentists_updated_at
  BEFORE UPDATE ON dentists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Dentist schedules ────────────────────────────────────────────────────────

CREATE TABLE dentist_schedules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id   UUID NOT NULL REFERENCES dentists(id) ON DELETE CASCADE,
  day_of_week  INTEGER NOT NULL, -- 0=Sunday … 6=Saturday
  start_time   TEXT NOT NULL,    -- "HH:MM"
  end_time     TEXT NOT NULL,    -- "HH:MM"
  slot_minutes INTEGER NOT NULL DEFAULT 30,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (dentist_id, day_of_week)
);

CREATE TRIGGER dentist_schedules_updated_at
  BEFORE UPDATE ON dentist_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Closure dates ────────────────────────────────────────────────────────────

CREATE TABLE closure_dates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date       DATE NOT NULL,
  reason     TEXT NOT NULL,
  branch_id  UUID REFERENCES branches(id) ON DELETE CASCADE, -- NULL = all branches
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER closure_dates_updated_at
  BEFORE UPDATE ON closure_dates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Patients ─────────────────────────────────────────────────────────────────

CREATE TABLE patients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE,
  phone         TEXT,
  date_of_birth DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX patients_phone_idx ON patients(phone);

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Appointments ─────────────────────────────────────────────────────────────

CREATE TABLE appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  branch_id        UUID NOT NULL REFERENCES branches(id),
  service_id       UUID NOT NULL REFERENCES services(id),
  dentist_id       UUID REFERENCES dentists(id),
  title            TEXT,
  notes            TEXT,
  reference_number TEXT NOT NULL UNIQUE,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  status           appointment_status NOT NULL DEFAULT 'PENDING',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Jobs ─────────────────────────────────────────────────────────────────────

CREATE TABLE jobs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  type           TEXT NOT NULL,
  status         job_status NOT NULL DEFAULT 'PENDING',
  payload        JSONB,
  result         JSONB,
  error          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
