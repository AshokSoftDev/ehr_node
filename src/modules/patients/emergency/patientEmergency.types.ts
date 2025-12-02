export interface PatientEmergencyPayload {
  name: string;
  relation: string;
  contactNumber: string;
  status?: number;
}

export type PatientEmergencyUpdatePayload = Partial<PatientEmergencyPayload>;
