import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { qk } from '../lib/queryClient';
import type {
  Branch,
  Service,
  DentistWithSchedule,
  AvailabilityResponse,
  PublicBookingRequest,
  PublicBookingResponse,
  PublicPatientLookupResponse,
} from '@molave/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function callFunction<T>(name: string, params?: URLSearchParams): Promise<T> {
  const url = `${SUPABASE_URL}/functions/v1/${name}${params ? `?${params}` : ''}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${ANON_KEY}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function postFunction<T>(name: string, body: unknown): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useBranches() {
  return useQuery({
    queryKey: qk.public.branches(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name, address, phone, isActive:is_active')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Branch[];
    },
    staleTime: Infinity,
  });
}

export function usePublicServices() {
  return useQuery({
    queryKey: qk.public.services(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, description, durationMins:duration_mins, isActive:is_active')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Service[];
    },
    staleTime: Infinity,
  });
}

export function useDentists(branchId: string) {
  return useQuery({
    queryKey: qk.public.dentists(branchId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dentists')
        .select(`
          id, name, email, phone,
          branchId:branch_id,
          schedules:dentist_schedules(id, dayOfWeek:day_of_week, startTime:start_time, endTime:end_time, slotMinutes:slot_minutes)
        `)
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as unknown as DentistWithSchedule[];
    },
    enabled: Boolean(branchId),
    staleTime: Infinity,
  });
}

export function useAvailability(
  branchId: string,
  dentistId: string | null,
  date: string,
  durationMins: number,
) {
  return useQuery({
    queryKey: qk.public.availability(branchId, dentistId, date, durationMins),
    queryFn: async () => {
      const params = new URLSearchParams({ branchId, date, durationMins: String(durationMins) });
      if (dentistId) params.set('dentistId', dentistId);
      return callFunction<AvailabilityResponse>('availability', params);
    },
    enabled: Boolean(branchId) && Boolean(date) && durationMins > 0,
    staleTime: 1000 * 60, // 1 min — slots change as others book
  });
}

export function usePatientLookup(phone: string) {
  return useQuery({
    queryKey: qk.public.patientLookup(phone),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, email, phone')
        .eq('phone', phone)
        .maybeSingle();
      if (error) throw error;
      return { patient: data } as unknown as PublicPatientLookupResponse;
    },
    enabled: phone.length >= 7,
    staleTime: 1000 * 30,
  });
}

export function useBookAppointment() {
  return useMutation({
    mutationFn: (dto: PublicBookingRequest) =>
      postFunction<PublicBookingResponse>('public-book', dto),
  });
}
