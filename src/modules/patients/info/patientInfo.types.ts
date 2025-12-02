export interface PatientInfoPayload {
  bloodGroup: string;
  overseas: boolean;
  passportNumber?: string;
  validityDate?: Date | string;
  occupation?: string;
  department?: string;
  companyName?: string;
  designation?: string;
  employeeCode?: string;
  primaryDoctorId?: string;
}

export type PatientInfoUpdatePayload = Partial<PatientInfoPayload>;
