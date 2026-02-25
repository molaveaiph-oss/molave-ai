export const JOB_STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_TYPES = {
  APPOINTMENT_REMINDER: 'APPOINTMENT_REMINDER',
  APPOINTMENT_CONFIRMATION: 'APPOINTMENT_CONFIRMATION',
  PUBLIC_BOOKING_CONFIRMATION: 'PUBLIC_BOOKING_CONFIRMATION',
} as const;
export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export interface Job {
  id: string;
  appointmentId: string | null;
  type: string;
  status: JobStatus;
  payload: unknown;
  result: unknown;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Socket.IO event payloads */
export interface JobUpdateEvent {
  jobId: string;
  status: JobStatus;
  type: string;
  appointmentId?: string | null;
}

export interface AppointmentUpdateEvent {
  appointmentId: string;
  status: string;
}

export type WsEvent = 'job:update' | 'appointment:update';
