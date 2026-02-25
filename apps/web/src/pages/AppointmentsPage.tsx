import { useState } from 'react';
import Layout from '../components/Layout';
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useSendReminder,
} from '../hooks/useAppointments';
import { usePatients } from '../hooks/usePatients';
import { useBranches, usePublicServices } from '../hooks/usePublicBooking';
import type { Appointment, CreateAppointmentDto } from '@molave/types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#0ea5e9',
  COMPLETED: '#10b981', CANCELLED: '#ef4444',
};

export default function AppointmentsPage() {
  const { data: appointments, isLoading } = useAppointments();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  return (
    <Layout>
      <div style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Appointments</h2>
          <button onClick={() => { setEditing(null); setShowForm(true); }} style={btnStyle('#0ea5e9')}>
            + New Appointment
          </button>
        </div>

        {(showForm || editing) && (
          <AppointmentForm
            initial={editing}
            onClose={() => { setShowForm(false); setEditing(null); }}
          />
        )}

        {isLoading ? (
          <p style={{ color: '#94a3b8' }}>Loading…</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  {['Patient', 'Title', 'Scheduled', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments?.map((a) => (
                  <AppointmentRow key={a.id} appt={a} onEdit={() => { setEditing(a); setShowForm(true); }} />
                ))}
              </tbody>
            </table>
            {appointments?.length === 0 && (
              <p style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No appointments yet.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function AppointmentRow({ appt, onEdit }: { appt: Appointment; onEdit: () => void }) {
  const del = useDeleteAppointment();
  const remind = useSendReminder();
  const updateAppt = useUpdateAppointment(appt.id);

  return (
    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
      <td style={{ padding: '12px 16px', fontWeight: 500 }}>{(appt as any).patient?.name ?? '—'}</td>
      <td style={{ padding: '12px 16px' }}>{appt.title}</td>
      <td style={{ padding: '12px 16px', color: '#64748b' }}>{new Date(appt.scheduledAt).toLocaleString()}</td>
      <td style={{ padding: '12px 16px' }}>
        <select
          value={appt.status}
          onChange={e => updateAppt.mutate({ status: e.target.value as any })}
          style={{ border: 'none', background: STATUS_COLORS[appt.status] + '22', color: STATUS_COLORS[appt.status], fontWeight: 600, fontSize: 12, padding: '4px 8px', borderRadius: 99, cursor: 'pointer', outline: 'none' }}
        >
          {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td style={{ padding: '12px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button onClick={onEdit} style={btnStyle('#6366f1', true)}>Edit</button>
        <button
          onClick={() => remind.mutate(appt.id)}
          disabled={remind.isPending}
          style={btnStyle('#f59e0b', true)}
        >
          {remind.isPending ? '…' : 'Remind'}
        </button>
        <button
          onClick={() => { if (confirm('Delete appointment?')) del.mutate(appt.id); }}
          style={btnStyle('#ef4444', true)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function AppointmentForm({ initial, onClose }: { initial: Appointment | null; onClose: () => void }) {
  const { data: patients } = usePatients();
  const { data: branches } = useBranches();
  const { data: services } = usePublicServices();
  const create = useCreateAppointment();
  const update = useUpdateAppointment(initial?.id ?? '');

  const [form, setForm] = useState<CreateAppointmentDto>({
    patientId: initial?.patientId ?? '',
    branchId: initial?.branchId ?? '',
    serviceId: initial?.serviceId ?? '',
    title: initial?.title ?? '',
    notes: initial?.notes ?? '',
    scheduledAt: initial?.scheduledAt
      ? new Date(initial.scheduledAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() };
    if (initial) {
      await update.mutateAsync(payload);
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  }

  const isPending = create.isPending || update.isPending;
  const error = create.error || update.error;

  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{initial ? 'Edit Appointment' : 'New Appointment'}</h3>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Patient *</label>
          <select required value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} style={inputStyle}>
            <option value="">Select patient…</option>
            {patients?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Branch *</label>
          <select required value={form.branchId} onChange={e => setForm(f => ({ ...f, branchId: e.target.value }))} style={inputStyle}>
            <option value="">Select branch…</option>
            {branches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Service *</label>
          <select required value={form.serviceId} onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))} style={inputStyle}>
            <option value="">Select service…</option>
            {services?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Title</label>
          <input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="e.g. Teeth cleaning" />
        </div>
        <div>
          <label style={labelStyle}>Date & Time *</label>
          <input required type="datetime-local" value={form.scheduledAt as string} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Notes</label>
          <input value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={inputStyle} placeholder="Optional notes" />
        </div>
        {error && <p style={{ gridColumn: '1/-1', color: '#ef4444', fontSize: 13 }}>{(error as any).message}</p>}
        <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={btnStyle('#94a3b8', true)}>Cancel</button>
          <button type="submit" disabled={isPending} style={btnStyle('#0ea5e9')}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

const btnStyle = (color: string, small = false): React.CSSProperties => ({
  padding: small ? '6px 14px' : '9px 18px',
  background: color, color: '#fff', border: 'none', borderRadius: 6,
  cursor: 'pointer', fontSize: small ? 13 : 14, fontWeight: 500,
});
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' };
