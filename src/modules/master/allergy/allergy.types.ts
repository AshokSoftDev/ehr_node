export interface CreateAllergyDto {
  allergyName: string;
  allergyType: string;
}

export type UpdateAllergyDto = Partial<CreateAllergyDto> & {
  status?: number;
};

export interface AllergyFilters {
  search?: string;
}

