export interface CreateDrugDto {
  drug_generic: string;
  drug_name: string;
  drug_type: string;
  drug_dosage: string;
  drug_measure: string;
  instruction?: string;
}

export type UpdateDrugDto = Partial<CreateDrugDto> & {
  status?: number;
};

export interface DrugFilters {
  search?: string;
}

