export interface CreatePatientAllergyDto {
  allergyName: string;
  allergyId?: number; // optional link to master Allergy
  status?: number; // 1=active,0=inactive
}

export type UpdatePatientAllergyDto = Partial<CreatePatientAllergyDto>;

