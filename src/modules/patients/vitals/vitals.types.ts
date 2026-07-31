import { PatientVital } from '@prisma/client';

export interface VitalFilters {
  patientId: number;
  visitId?: number;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedVitalsResponse {
  vitals: PatientVital[];
  total: number;
  page: number;
  totalPages: number;
}
