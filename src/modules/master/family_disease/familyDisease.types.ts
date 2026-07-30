export interface CreateFamilyDiseaseDto {
  diseaseName: string;
  notes?: string;
  status?: number;
}

export type UpdateFamilyDiseaseDto = Partial<CreateFamilyDiseaseDto> & {
  status?: number;
};

export interface FamilyDiseaseFilters {
  search?: string;
}
