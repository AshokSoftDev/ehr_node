export interface PatientSurgeryHistoryPayload {
  surgeryId: number;
  month?: number | null;
  year?: number | null;
  comments?: string | null;
  status?: number;
}

export interface SyncPatientSurgeryHistoryPayload extends PatientSurgeryHistoryPayload {
  id?: number;
}
