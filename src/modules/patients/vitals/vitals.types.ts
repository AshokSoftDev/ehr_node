import { PatientVital } from '@prisma/client';

export interface VitalFilters {
  patientId: number;
  visitId?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedVitalsResponse {
  vitals: PatientVital[];
  total: number;
  page: number;
  totalPages: number;
}
