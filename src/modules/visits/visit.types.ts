export interface VisitFilters {
  dateFrom?: Date;
  dateTo?: Date;
  doctor?: string; // matches doctor name/displayName/specialty
  patient?: string; // matches MRN or patient name
  reason?: string;
  status?: string; // appointment_status
  page?: number;
  limit?: number;
}

export interface PaginatedVisitsResponse<T = any> {
  visits: T[];
  total: number;
  page: number;
  totalPages: number;
}

