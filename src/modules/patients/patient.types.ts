import { Patient } from '@prisma/client';

export interface CreatePatientDto {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  age?: number;
  gender: string;
  mobileNumber: string;
  address: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  aadhar?: string;
  referalSource?: string;
  comments?: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {
  activeStatus?: number;
}

export interface PatientFilters {
  search?: string;
  activeStatus?: number;
}

export interface PatientListResponse {
  patients: Patient[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
