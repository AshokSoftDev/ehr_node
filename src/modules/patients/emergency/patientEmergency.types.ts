export interface CreatePatientEmergencyDto {
  name: string;
  relation: string;
  contactNumber: string;
  status?: number; // 1=active,0=inactive
}

export type UpdatePatientEmergencyDto = Partial<CreatePatientEmergencyDto>;

