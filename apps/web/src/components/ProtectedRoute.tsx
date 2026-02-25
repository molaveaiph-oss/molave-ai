import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuthStore();
  useRealtimeSync(); // Subscribe to realtime updates once authenticated

  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
