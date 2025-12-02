export interface PatientAllergyPayload {
  allergyName: string;
  allergyId?: number;
  status?: number;
}

export type PatientAllergyUpdatePayload = Partial<PatientAllergyPayload>;
