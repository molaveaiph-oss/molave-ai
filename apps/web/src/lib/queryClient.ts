import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,      // 30 s
      gcTime: 1000 * 60 * 5,     // 5 min
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

/** Centralised query key factory — prevents key drift */
export const qk = {
  patients: {
    all: () => ['patients'] as const,
    detail: (id: string) => ['patients', id] as const,
  },
  appointments: {
    all: () => ['appointments'] as const,
    detail: (id: string) => ['appointments', id] as const,
  },
  jobs: {
    all: () => ['jobs'] as const,
    detail: (id: string) => ['jobs', id] as const,
  },
  public: {
    branches: () => ['public', 'branches'] as const,
    services: () => ['public', 'services'] as const,
    dentists: (branchId: string) => ['public', 'dentists', branchId] as const,
    availability: (branchId: string, dentistId: string | null, date: string, durationMins: number) =>
      ['public', 'availability', branchId, dentistId, date, durationMins] as const,
    patientLookup: (phone: string) => ['public', 'patient', phone] as const,
  },
};
