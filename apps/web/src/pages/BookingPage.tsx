import { useState, useEffect } from 'react';
import type { AvailabilitySlot, PublicBookingResponse } from '@molave/types';
import {
  useBranches,
  usePublicServices,
  useDentists,
  useAvailability,
  usePatientLookup,
  useBookAppointment,
} from '../hooks/usePublicBooking';

// ─── Calendar helpers ────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatSlotTime(isoTime: string) {
  // isoTime = "2026-03-15T09:00:00"
  const timePart = isoTime.split('T')[1].slice(0, 5); // "09:00"
  const [h, m] = timePart.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatReadableDate(dateStr: string) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  return date.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── Booking state ───────────────────────────────────────────────────────────

interface BookingDraft {
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  durationMins: number;
  dentistId: string | null;
  dentistName: string;
  selectedDate: string;
  selectedSlot: string; // ISO datetime string (no Z)
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  isFirstVisit: boolean;
}

const EMPTY_DRAFT: BookingDraft = {
  branchId: '', branchName: '', serviceId: '', serviceName: '', durationMins: 30,
  dentistId: null, dentistName: 'No Preference',
  selectedDate: '', selectedSlot: '',
  patientName: '', patientPhone: '', patientEmail: '', isFirstVisit: true,
};

// ─── Top-level BookingPage ───────────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [result, setResult] = useState<PublicBookingResponse | null>(null);

  const STEPS = ['Clinic', 'Service', 'Dentist', 'Date & Time', 'Your Info'];

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '32px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>Book an Appointment</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
            Schedule your dental visit in a few simple steps.
          </p>
        </div>

        {/* Progress bar (hidden on confirmation) */}
        {step <= 5 && (
          <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderRadius: 8, overflow: 'hidden' }}>
            {STEPS.map((label, i) => {
              const stepNum = i + 1;
              const active = step === stepNum;
              const done = step > stepNum;
              return (
                <div
                  key={label}
                  style={{
                    flex: 1, padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: done || active ? 600 : 400,
                    background: done ? '#0ea5e9' : active ? '#0284c7' : '#e2e8f0',
                    color: done || active ? '#fff' : '#64748b',
                    transition: 'background 0.2s',
                  }}
                >
                  {done ? '✓ ' : ''}{label}
                </div>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '28px 24px' }}>
          {step === 1 && (
            <Step1Branch
              draft={draft}
              onSelect={(branchId, branchName) => {
                setDraft({ ...EMPTY_DRAFT, branchId, branchName });
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <Step2Service
              draft={draft}
              onBack={() => setStep(1)}
              onSelect={(serviceId, serviceName, durationMins) => {
                setDraft((d) => ({ ...d, serviceId, serviceName, durationMins }));
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            <Step3Dentist
              draft={draft}
              onBack={() => setStep(2)}
              onSelect={(dentistId, dentistName) => {
                setDraft((d) => ({ ...d, dentistId, dentistName, selectedDate: '', selectedSlot: '' }));
                setStep(4);
              }}
            />
          )}
          {step === 4 && (
            <Step4DateTime
              draft={draft}
              onBack={() => setStep(3)}
              onSelect={(selectedDate, selectedSlot) => {
                setDraft((d) => ({ ...d, selectedDate, selectedSlot }));
                setStep(5);
              }}
            />
          )}
          {step === 5 && (
            <Step5PatientInfo
              draft={draft}
              onBack={() => setStep(4)}
              onSubmit={(patientName, patientPhone, patientEmail, isFirstVisit) => {
                setDraft((d) => ({ ...d, patientName, patientPhone, patientEmail, isFirstVisit }));
              }}
              onSuccess={(res) => {
                setResult(res);
                setStep(6);
              }}
            />
          )}
          {step === 6 && result && (
            <Step6Confirmation
              draft={draft}
              result={result}
              onBookAnother={() => {
                setDraft(EMPTY_DRAFT);
                setResult(null);
                setStep(1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Branch ──────────────────────────────────────────────────────────

function Step1Branch({
  draft,
  onSelect,
}: {
  draft: BookingDraft;
  onSelect: (id: string, name: string) => void;
}) {
  const { data: branches, isLoading } = useBranches();

  return (
    <>
      <StepTitle step={1} title="Choose a Clinic" />
      {isLoading && <Loading />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {branches?.map((b) => (
          <SelectionCard
            key={b.id}
            selected={draft.branchId === b.id}
            onClick={() => onSelect(b.id, b.name)}
          >
            <div style={{ fontWeight: 600, fontSize: 15 }}>{b.name}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{b.address}</div>
            {b.phone && <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{b.phone}</div>}
          </SelectionCard>
        ))}
      </div>
    </>
  );
}

// ─── Step 2: Service ─────────────────────────────────────────────────────────

function Step2Service({
  draft,
  onBack,
  onSelect,
}: {
  draft: BookingDraft;
  onBack: () => void;
  onSelect: (id: string, name: string, durationMins: number) => void;
}) {
  const { data: services, isLoading } = usePublicServices();

  return (
    <>
      <StepTitle step={2} title="Select a Service" />
      {isLoading && <Loading />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {services?.map((s) => (
          <SelectionCard
            key={s.id}
            selected={draft.serviceId === s.id}
            onClick={() => onSelect(s.id, s.name, s.durationMins)}
          >
            <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
            {s.description && <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{s.description}</div>}
            <div style={{ color: '#0ea5e9', fontSize: 12, marginTop: 4 }}>{s.durationMins} minutes</div>
          </SelectionCard>
        ))}
      </div>
      <BackButton onClick={onBack} />
    </>
  );
}

// ─── Step 3: Dentist ─────────────────────────────────────────────────────────

function Step3Dentist({
  draft,
  onBack,
  onSelect,
}: {
  draft: BookingDraft;
  onBack: () => void;
  onSelect: (dentistId: string | null, dentistName: string) => void;
}) {
  const { data: dentists, isLoading } = useDentists(draft.branchId);

  return (
    <>
      <StepTitle step={3} title="Choose a Dentist" />
      {isLoading && <Loading />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {/* No preference option */}
        <SelectionCard
          selected={draft.dentistId === null}
          onClick={() => onSelect(null, 'No Preference')}
        >
          <div style={{ fontWeight: 600, fontSize: 15 }}>No Preference</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
            We'll assign the first available dentist.
          </div>
        </SelectionCard>

        {dentists?.map((d) => (
          <SelectionCard
            key={d.id}
            selected={draft.dentistId === d.id}
            onClick={() => onSelect(d.id, d.name)}
          >
            <div style={{ fontWeight: 600, fontSize: 15 }}>{d.name}</div>
          </SelectionCard>
        ))}
      </div>
      <BackButton onClick={onBack} />
    </>
  );
}

// ─── Step 4: Date & Time ─────────────────────────────────────────────────────

function Step4DateTime({
  draft,
  onBack,
  onSelect,
}: {
  draft: BookingDraft;
  onBack: () => void;
  onSelect: (date: string, slot: string) => void;
}) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(draft.selectedDate);
  const [selectedSlot, setSelectedSlot] = useState(draft.selectedSlot);

  const { data: avail, isFetching: loadingSlots } = useAvailability(
    draft.branchId,
    draft.dentistId,
    selectedDate,
    draft.durationMins,
  );

  const days = getDaysInMonth(calYear, calMonth);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  function handleDayClick(day: number) {
    const dateStr = toDateStr(calYear, calMonth, day);
    if (dateStr < todayStr) return; // past
    const dow = new Date(calYear, calMonth, day).getDay();
    if (dow === 0 || dow === 6) return; // weekend
    setSelectedDate(dateStr);
    setSelectedSlot('');
  }

  const canProceed = selectedDate && selectedSlot;

  return (
    <>
      <StepTitle step={4} title="Pick a Date & Time" />
      <div style={{ marginTop: 16 }}>

        {/* Calendar */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button onClick={prevMonth} style={navBtnStyle}>‹</button>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{MONTH_NAMES[calMonth]} {calYear}</span>
            <button onClick={nextMonth} style={navBtnStyle}>›</button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAY_LABELS.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', fontWeight: 600, padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {days.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const dateStr = toDateStr(calYear, calMonth, day);
              const isPast = dateStr < todayStr;
              const dow = new Date(calYear, calMonth, day).getDay();
              const isWeekend = dow === 0 || dow === 6;
              const disabled = isPast || isWeekend;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={disabled}
                  style={{
                    padding: '8px 0', borderRadius: 6, border: 'none', cursor: disabled ? 'default' : 'pointer', fontSize: 13,
                    background: isSelected ? '#0ea5e9' : disabled ? 'transparent' : '#f8fafc',
                    color: isSelected ? '#fff' : disabled ? '#cbd5e1' : '#0f172a',
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
              Available times for <strong>{formatReadableDate(selectedDate)}</strong>
            </p>

            {loadingSlots && <Loading />}

            {avail?.isClosure && (
              <div style={{ padding: '12px 16px', background: '#fef9c3', borderRadius: 8, color: '#92400e', fontSize: 13 }}>
                This date is closed: {avail.closureReason}
              </div>
            )}

            {!loadingSlots && avail && !avail.isClosure && (
              <SlotGrid
                slots={avail.slots}
                selectedSlot={selectedSlot}
                onSelect={(slot) => setSelectedSlot(slot)}
              />
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <BackButton onClick={onBack} />
        <button
          disabled={!canProceed}
          onClick={() => onSelect(selectedDate, selectedSlot)}
          style={primaryBtnStyle(!canProceed)}
        >
          Next: Your Info →
        </button>
      </div>
    </>
  );
}

function SlotGrid({
  slots,
  selectedSlot,
  onSelect,
}: {
  slots: AvailabilitySlot[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
}) {
  const available = slots.filter((s) => s.available);
  if (available.length === 0) {
    return (
      <div style={{ color: '#64748b', fontSize: 13, padding: '12px 0' }}>
        No available time slots for this day.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {slots.map((s) => {
        const isSelected = s.time === selectedSlot;
        return (
          <button
            key={s.time}
            onClick={() => s.available && onSelect(s.time)}
            disabled={!s.available}
            style={{
              padding: '9px 4px', borderRadius: 6, border: `1.5px solid ${isSelected ? '#0ea5e9' : s.available ? '#e2e8f0' : '#f1f5f9'}`,
              cursor: s.available ? 'pointer' : 'default', fontSize: 13,
              background: isSelected ? '#0ea5e9' : s.available ? '#fff' : '#f8fafc',
              color: isSelected ? '#fff' : s.available ? '#0f172a' : '#cbd5e1',
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            {formatSlotTime(s.time)}
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 5: Patient Info ────────────────────────────────────────────────────

function Step5PatientInfo({
  draft,
  onBack,
  onSubmit,
  onSuccess,
}: {
  draft: BookingDraft;
  onBack: () => void;
  onSubmit: (name: string, phone: string, email: string, firstVisit: boolean) => void;
  onSuccess: (res: PublicBookingResponse) => void;
}) {
  const [name, setName] = useState(draft.patientName);
  const [phone, setPhone] = useState(draft.patientPhone);
  const [email, setEmail] = useState(draft.patientEmail);
  const [firstVisit, setFirstVisit] = useState(draft.isFirstVisit);
  const [error, setError] = useState('');

  const { data: existingPatient } = usePatientLookup(phone);
  const bookMutation = useBookAppointment();

  // Pre-fill name/email if returning patient found
  useEffect(() => {
    if (existingPatient && !name) setName(existingPatient.name);
    if (existingPatient?.email && !email) setEmail(existingPatient.email ?? '');
  }, [existingPatient]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    onSubmit(name, phone, email, firstVisit);

    try {
      const res = await bookMutation.mutateAsync({
        branchId: draft.branchId,
        serviceId: draft.serviceId,
        dentistId: draft.dentistId,
        scheduledAt: draft.selectedSlot + '.000Z',
        patientName: name,
        patientPhone: phone,
        patientEmail: email || null,
        isFirstVisit: firstVisit,
      });
      onSuccess(res);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.');
    }
  }

  const loading = bookMutation.isPending;

  return (
    <>
      <StepTitle step={5} title="Your Information" />
      {existingPatient && (
        <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534', marginTop: 12 }}>
          Welcome back, {existingPatient.name}! Your details have been pre-filled.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
        <label style={labelStyle}>
          Full Name *
          <input
            required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria Santos"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Mobile Number *
          <input
            required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 09171234567"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Email Address <span style={{ color: '#94a3b8' }}>(optional)</span>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. maria@email.com"
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
          <input
            type="checkbox" checked={firstVisit} onChange={(e) => setFirstVisit(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          This is my first visit to this clinic
        </label>

        {/* Booking summary */}
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', fontSize: 13, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: '#0f172a' }}>Appointment Summary</div>
          <div><span style={{ color: '#64748b' }}>Clinic:</span> {draft.branchName}</div>
          <div><span style={{ color: '#64748b' }}>Service:</span> {draft.serviceName}</div>
          <div><span style={{ color: '#64748b' }}>Dentist:</span> {draft.dentistName}</div>
          <div><span style={{ color: '#64748b' }}>Date:</span> {formatReadableDate(draft.selectedDate)}</div>
          <div><span style={{ color: '#64748b' }}>Time:</span> {formatSlotTime(draft.selectedSlot)}</div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <BackButton onClick={onBack} />
          <button type="submit" disabled={loading} style={primaryBtnStyle(loading)}>
            {loading ? 'Booking…' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </>
  );
}

// ─── Step 6: Confirmation ────────────────────────────────────────────────────

function Step6Confirmation({
  draft,
  result,
  onBookAnother,
}: {
  draft: BookingDraft;
  result: PublicBookingResponse;
  onBookAnother: () => void;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
        Appointment Confirmed!
      </h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
        We'll send you a reminder closer to your appointment.
      </p>

      {/* Reference number */}
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: '#0369a1', fontWeight: 600, marginBottom: 4 }}>REFERENCE NUMBER</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0284c7', letterSpacing: 1 }}>{result.referenceNumber}</div>
        <div style={{ fontSize: 11, color: '#7dd3fc', marginTop: 4 }}>Keep this for your records</div>
      </div>

      {/* Details */}
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', textAlign: 'left', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
        <Row label="Patient" value={draft.patientName} />
        <Row label="Clinic" value={draft.branchName} />
        <Row label="Service" value={draft.serviceName} />
        <Row label="Dentist" value={draft.dentistName} />
        <Row label="Date" value={formatReadableDate(draft.selectedDate)} />
        <Row label="Time" value={formatSlotTime(draft.selectedSlot)} />
        {draft.patientPhone && <Row label="Contact" value={draft.patientPhone} />}
      </div>

      <button onClick={onBookAnother} style={primaryBtnStyle(false)}>
        Book Another Appointment
      </button>
    </div>
  );
}

// ─── Reusable UI atoms ───────────────────────────────────────────────────────

function StepTitle({ step, title }: { step: number; title: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
        Step {step} of 5
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '4px 0 0' }}>{title}</h2>
    </div>
  );
}

function SelectionCard({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 16px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
        border: `2px solid ${selected ? '#0ea5e9' : '#e2e8f0'}`,
        background: selected ? '#f0f9ff' : '#fff',
      }}
    >
      {children}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: '10px 18px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
    >
      ← Back
    </button>
  );
}

function Loading() {
  return <div style={{ color: '#94a3b8', fontSize: 14, padding: '12px 0' }}>Loading…</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ color: '#64748b', flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, color: '#0f172a', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: 4, padding: '10px 12px',
  borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', fontSize: 13, fontWeight: 500, color: '#374151',
};

const navBtnStyle: React.CSSProperties = {
  width: 32, height: 32, border: 'none', background: '#f1f5f9', borderRadius: 6,
  cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    flex: 1, padding: '11px 0', borderRadius: 6, border: 'none',
    background: disabled ? '#94a3b8' : '#0ea5e9', color: '#fff',
    fontWeight: 600, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
