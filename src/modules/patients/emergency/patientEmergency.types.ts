export interface PatientEmergencyPayload {
  name: string;
  relation: string;
  contactNumber: string;
  isPrimary?: boolean;
  status?: number;
}

export type PatientEmergencyUpdatePayload = Partial<PatientEmergencyPayload>;
