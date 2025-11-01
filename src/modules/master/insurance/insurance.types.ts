export interface CreateInsuranceDto {
  type: string;
  company: string;
  policy: string;
  policyNo: string;
  validationFrom: Date;
  validationTo: Date;
  notes?: string | null;
}

export type UpdateInsuranceDto = Partial<CreateInsuranceDto> & {
  status?: number;
};

export interface InsuranceFilters {
  search?: string;
}

