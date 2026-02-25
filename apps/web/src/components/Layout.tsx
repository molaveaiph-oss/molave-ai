import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { supabase } from '../lib/supabase';

const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/jobs', label: 'Jobs' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    clearAuth();
    navigate('/login');
  }

  const displayName = user?.user_metadata?.name ?? user?.email ?? 'User';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1e293b', color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px 16px', fontSize: 20, fontWeight: 700, color: '#fff', borderBottom: '1px solid #334155' }}>
          🦷 Molave
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              style={{
                display: 'block',
                padding: '10px 20px',
                color: pathname === n.to ? '#38bdf8' : '#94a3b8',
                textDecoration: 'none',
                fontWeight: pathname === n.to ? 600 : 400,
                background: pathname === n.to ? '#0f172a' : 'transparent',
                borderLeft: pathname === n.to ? '3px solid #38bdf8' : '3px solid transparent',
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #334155', fontSize: 13, color: '#94a3b8' }}>
          <div style={{ marginBottom: 8 }}>{displayName}</div>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid #475569', color: '#94a3b8', cursor: 'pointer', padding: '4px 12px', borderRadius: 4, fontSize: 12 }}
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
