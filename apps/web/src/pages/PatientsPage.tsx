import { useState } from 'react';
import Layout from '../components/Layout';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/usePatients';
import type { Patient, CreatePatientDto } from '@molave/types';

export default function PatientsPage() {
  const { data: patients, isLoading } = usePatients();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);

  return (
    <Layout>
      <div style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Patients</h2>
          <button onClick={() => { setEditing(null); setShowForm(true); }} style={btnStyle('#0ea5e9')}>
            + New Patient
          </button>
        </div>

        {(showForm || editing) && (
          <PatientForm
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
                  {['Name', 'Email', 'Phone', 'Appointments', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients?.map((p) => (
                  <PatientRow key={p.id} patient={p} onEdit={() => { setEditing(p); setShowForm(true); }} />
                ))}
              </tbody>
            </table>
            {patients?.length === 0 && (
              <p style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No patients yet. Add one above.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function PatientRow({ patient, onEdit }: { patient: Patient; onEdit: () => void }) {
  const del = useDeletePatient();
  return (
    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
      <td style={{ padding: '12px 16px', fontWeight: 500 }}>{patient.name}</td>
      <td style={{ padding: '12px 16px', color: '#64748b' }}>{patient.email}</td>
      <td style={{ padding: '12px 16px', color: '#64748b' }}>{patient.phone ?? '—'}</td>
      <td style={{ padding: '12px 16px', color: '#64748b' }}>{(patient as any)._count?.appointments ?? 0}</td>
      <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
        <button onClick={onEdit} style={btnStyle('#6366f1', true)}>Edit</button>
        <button
          onClick={() => { if (confirm('Delete patient?')) del.mutate(patient.id); }}
          style={btnStyle('#ef4444', true)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function PatientForm({ initial, onClose }: { initial: Patient | null; onClose: () => void }) {
  const create = useCreatePatient();
  const update = useUpdatePatient(initial?.id ?? '');
  const [form, setForm] = useState<CreatePatientDto>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (initial) {
      await update.mutateAsync(form);
    } else {
      await create.mutateAsync(form);
    }
    onClose();
  }

  const isPending = create.isPending || update.isPending;
  const error = create.error || update.error;

  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{initial ? 'Edit Patient' : 'New Patient'}</h3>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input type="date" onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : undefined }))} style={inputStyle} />
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
