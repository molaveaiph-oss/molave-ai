import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ width: 360, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '40px 32px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>🦷 Molave</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>Dental Practice Management</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                background: mode === m ? '#0ea5e9' : '#f1f5f9', color: mode === m ? '#fff' : '#64748b',
              }}
            >
              {m === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <input
              required placeholder="Full name"
              value={name} onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            required type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            required type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            style={{ padding: '11px', borderRadius: 6, border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0',
  fontSize: 14, outline: 'none', width: '100%',
};
