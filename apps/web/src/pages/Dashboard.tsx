import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { qk } from '../lib/queryClient';
import Layout from '../components/Layout';
import type { Appointment, Job } from '@molave/types';

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 700, color: '#0f172a' }}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const patients = useQuery({
    queryKey: qk.patients.all(),
    queryFn: async () => {
      const { data, error } = await supabase.from('patients').select('id');
      if (error) throw error;
      return data;
    },
  });
  const appointments = useQuery({
    queryKey: qk.appointments.all(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, status, scheduledAt:scheduled_at')
        .order('scheduled_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Appointment[];
    },
  });
  const jobs = useQuery({
    queryKey: qk.jobs.all(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, type, status, error, createdAt:created_at, updatedAt:updated_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as unknown as Job[];
    },
  });

  const pendingAppts = appointments.data?.filter(a => a.status === 'PENDING').length ?? 0;
  const todayAppts = appointments.data?.filter(a => {
    const d = new Date(a.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length ?? 0;
  const recentJobs = jobs.data?.slice(0, 5) ?? [];

  return (
    <Layout>
      <div style={{ padding: '32px 36px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#0f172a' }}>Dashboard</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Patients" value={patients.data?.length ?? '—'} color="#0ea5e9" />
          <StatCard label="Total Appointments" value={appointments.data?.length ?? '—'} color="#8b5cf6" />
          <StatCard label="Pending Today" value={pendingAppts} color="#f59e0b" />
          <StatCard label="Scheduled Today" value={todayAppts} color="#10b981" />
        </div>

        <div style={{ background: '#fff', borderRadius: 10, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>Recent Jobs</h3>
          {recentJobs.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No jobs yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Type', 'Status', 'Created'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(j => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', color: '#334155' }}>{j.type}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <StatusBadge status={j.status} />
                    </td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                      {new Date(j.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: '#f59e0b', PROCESSING: '#3b82f6',
    COMPLETED: '#10b981', FAILED: '#ef4444',
    CONFIRMED: '#10b981', CANCELLED: '#ef4444',
  };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      background: colors[status] + '22', color: colors[status], fontSize: 12, fontWeight: 600,
    }}>
      {status}
    </span>
  );
}
