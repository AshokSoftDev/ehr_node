export interface PatientPmhPayload {
  pmhId: number;
  month?: number | null;
  year?: number | null;
  comments?: string | null;
  status?: number;
}

export interface SyncPatientPmhPayload extends PatientPmhPayload {
  id?: number;
}
