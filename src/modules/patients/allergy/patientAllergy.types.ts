export interface PatientAllergyPayload {
  allergyName: string;
  allergyId?: number;
  status?: number;
  notes?: string;
}

export type PatientAllergyUpdatePayload = Partial<PatientAllergyPayload>;

export interface SyncPatientAllergyPayload extends PatientAllergyPayload {
  id?: number;
}
