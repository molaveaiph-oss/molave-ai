import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { qk } from '../lib/queryClient';
import type { Appointment, CreateAppointmentDto, UpdateAppointmentDto, Job } from '@molave/types';

const APPT_SELECT = `
  id,
  patientId:patient_id,
  branchId:branch_id,
  serviceId:service_id,
  dentistId:dentist_id,
  title, notes, status,
  referenceNumber:reference_number,
  scheduledAt:scheduled_at,
  createdAt:created_at,
  updatedAt:updated_at,
  patient:patients(id, name, email)
`.trim();

function dtoToRow(dto: CreateAppointmentDto | UpdateAppointmentDto) {
  return {
    ...(dto.patientId !== undefined && { patient_id: dto.patientId }),
    ...(dto.branchId !== undefined && { branch_id: dto.branchId }),
    ...(dto.serviceId !== undefined && { service_id: dto.serviceId }),
    ...(dto.dentistId !== undefined && { dentist_id: dto.dentistId }),
    ...(dto.title !== undefined && { title: dto.title }),
    ...(dto.notes !== undefined && { notes: dto.notes }),
    ...(dto.scheduledAt !== undefined && { scheduled_at: dto.scheduledAt }),
    ...((dto as UpdateAppointmentDto).status !== undefined && { status: (dto as UpdateAppointmentDto).status }),
  };
}

function generateRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'DN-';
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useAppointments() {
  return useQuery({
    queryKey: qk.appointments.all(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(APPT_SELECT)
        .order('scheduled_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Appointment[];
    },
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: qk.appointments.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(APPT_SELECT)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as unknown as Appointment;
    },
    enabled: Boolean(id),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateAppointmentDto) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert({ ...dtoToRow(dto), reference_number: generateRef() })
        .select(APPT_SELECT)
        .single();
      if (error) throw error;
      return data as unknown as Appointment;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.appointments.all() }),
  });
}

export function useUpdateAppointment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateAppointmentDto) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(dtoToRow(dto))
        .eq('id', id)
        .select(APPT_SELECT)
        .single();
      if (error) throw error;
      return data as unknown as Appointment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.appointments.all() });
      qc.invalidateQueries({ queryKey: qk.appointments.detail(id) });
    },
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.appointments.all() }),
  });
}

export function useSendReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-reminder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ appointmentId: id }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<Job>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.jobs.all() }),
  });
}
