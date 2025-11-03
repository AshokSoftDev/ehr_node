export interface CreateAppointmentDto {
  patient_id: number;
  doctor_id: string;
  appointment_date: Date;
  start_time: Date;
  end_time: Date;
  duration?: number;
  appointment_type: string;
  reason_for_visit?: string;
  appointment_status: string;
  notes?: string;
}

export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;

export interface AppointmentFilters {
  mrn?: string;
  patientName?: string;
  doctorName?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedAppointmentsResponse<T = any> {
  appointments: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AppointmentSnapshot {
  patient_mrn: string;
  patient_title: string;
  patient_firstName: string;
  patient_lastName: string;
  doctor_title: string;
  doctor_firstName: string;
  doctor_lastName: string;
  doctor_specialty: string;
}
