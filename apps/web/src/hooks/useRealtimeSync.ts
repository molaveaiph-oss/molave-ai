import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { qk } from '../lib/queryClient';

/**
 * Subscribes to Supabase Realtime changes on the appointments and jobs tables,
 * invalidating the relevant TanStack Query caches on any change.
 * Call this once inside a protected route component tree.
 */
export function useRealtimeSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => { qc.invalidateQueries({ queryKey: qk.appointments.all() }); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => { qc.invalidateQueries({ queryKey: qk.jobs.all() }); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [qc]);
}
