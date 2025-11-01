export interface CreatePatientInfoDto {
  bloodGroup: string;
  overseas: boolean;
  passportNumber?: string | null;
  validityDate?: Date | null;
  occupation?: string | null;
  department?: string | null;
  companyName?: string | null;
  designation?: string | null;
  employeeCode?: string | null;
  primaryDoctorId?: string | null;
}

export type UpdatePatientInfoDto = Partial<CreatePatientInfoDto>;

