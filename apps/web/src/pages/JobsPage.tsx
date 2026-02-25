import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { qk } from '../lib/queryClient';
import type { Job } from '@molave/types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b', PROCESSING: '#3b82f6',
  COMPLETED: '#10b981', FAILED: '#ef4444',
};

export default function JobsPage() {
  const { data: jobs, isLoading, refetch } = useQuery({
    queryKey: qk.jobs.all(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, type, status, error, createdAt:created_at, updatedAt:updated_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Job[];
    },
  });

  return (
    <Layout>
      <div style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Background Jobs</h2>
          <button onClick={() => refetch()} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748b' }}>
            Refresh
          </button>
        </div>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>
          Live updates via Supabase Realtime — table auto-refreshes when jobs complete.
        </p>

        {isLoading ? (
          <p style={{ color: '#94a3b8' }}>Loading…</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  {['ID', 'Type', 'Status', 'Error', 'Created', 'Updated'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs?.map(j => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>{j.id.slice(0, 8)}…</td>
                    <td style={{ padding: '10px 16px', color: '#334155' }}>{j.type}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 99,
                        background: (STATUS_COLORS[j.status] ?? '#e2e8f0') + '22',
                        color: STATUS_COLORS[j.status] ?? '#64748b',
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {j.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#ef4444', fontSize: 12 }}>{j.error ?? '—'}</td>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', fontSize: 12 }}>{new Date(j.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', fontSize: 12 }}>{new Date(j.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs?.length === 0 && (
              <p style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No jobs yet. Create an appointment to trigger a confirmation job.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
