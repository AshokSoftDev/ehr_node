export interface CreateDentalHPIDto {
  dentition_type: string;
  teeth_surfaces: Record<string, string[]>;
  chief_complaints: string[];
  severity?: string;
  duration_years?: number;
  duration_months?: number;
  duration_weeks?: number;
  duration_days?: number;
  notes?: string;
}

export interface UpdateDentalHPIDto {
  dentition_type?: string;
  teeth_surfaces?: Record<string, string[]>;
  chief_complaints?: string[];
  severity?: string;
  duration_years?: number;
  duration_months?: number;
  duration_weeks?: number;
  duration_days?: number;
  notes?: string;
}
