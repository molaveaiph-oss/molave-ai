import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { qk } from '../lib/queryClient';
import type { Patient, CreatePatientDto, UpdatePatientDto } from '@molave/types';

const PATIENT_SELECT =
  'id, name, email, phone, dateOfBirth:date_of_birth, createdAt:created_at, updatedAt:updated_at';

function dtoToRow(dto: CreatePatientDto | UpdatePatientDto) {
  return {
    ...(dto.name !== undefined && { name: dto.name }),
    ...(dto.email !== undefined && { email: dto.email }),
    ...(dto.phone !== undefined && { phone: dto.phone }),
    ...(dto.dateOfBirth !== undefined && { date_of_birth: dto.dateOfBirth }),
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function usePatients() {
  return useQuery({
    queryKey: qk.patients.all(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(PATIENT_SELECT)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Patient[];
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: qk.patients.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(PATIENT_SELECT)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Patient;
    },
    enabled: Boolean(id),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreatePatientDto) => {
      const { data, error } = await supabase
        .from('patients')
        .insert(dtoToRow(dto))
        .select(PATIENT_SELECT)
        .single();
      if (error) throw error;
      return data as Patient;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.patients.all() }),
  });
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdatePatientDto) => {
      const { data, error } = await supabase
        .from('patients')
        .update(dtoToRow(dto))
        .eq('id', id)
        .select(PATIENT_SELECT)
        .single();
      if (error) throw error;
      return data as Patient;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.patients.all() });
      qc.invalidateQueries({ queryKey: qk.patients.detail(id) });
    },
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.patients.all() }),
  });
}
