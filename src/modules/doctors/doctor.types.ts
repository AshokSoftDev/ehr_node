import { Doctor } from '@prisma/client';

export interface CreateDoctorDto {
  title: string;
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  licenceNo: string;
  degree: string;
  specialty: string;
  timeBlock?: string;
  displayName: string;
  displayColor: string;
  address?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {
  status?: number;
}

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  status?: number;
  email?: string;
  licenceNo?: string;
}

export interface DoctorWithCounts extends Doctor {
  _count?: {
    [key: string]: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DoctorListResponse {
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}
