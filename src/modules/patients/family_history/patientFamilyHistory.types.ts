export interface PatientFamilyHistoryPayload {
  familyDiseaseId: number;
  mother?: boolean;
  father?: boolean;
  sisters?: boolean;
  brothers?: boolean;
  maternalMother?: boolean;
  maternalFather?: boolean;
  paternalMother?: boolean;
  paternalFather?: boolean;
  otherRelatives?: string | null;
  comments?: string | null;
  status?: number;
}

export interface SyncPatientFamilyHistoryPayload extends PatientFamilyHistoryPayload {
  id?: number;
}
