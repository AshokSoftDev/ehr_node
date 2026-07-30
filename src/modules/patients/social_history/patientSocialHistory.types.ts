export interface PatientSocialHistoryPayload {
  socialMasterId: number;
  selectedOption?: number | null;
  comments?: string | null;
  status?: number;
}

export interface SyncPatientSocialHistoryPayload extends PatientSocialHistoryPayload {
  id?: number;
}
