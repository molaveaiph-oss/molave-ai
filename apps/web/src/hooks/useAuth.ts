import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth.store';

/**
 * Initialises the Supabase session on mount and keeps the Zustand auth store
 * in sync with auth state changes (login, logout, token refresh).
 * Call this once at the top of the component tree (App.tsx).
 */
export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    // Rehydrate from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuth(session.user, session);
    });

    // Keep in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setAuth(session.user, session);
      else clearAuth();
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
