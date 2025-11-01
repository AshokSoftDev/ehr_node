import { AppError } from '../../utils/errors';
import { AppointmentRepository } from './appointment.repository';
import { AppointmentFilters, CreateAppointmentDto, UpdateAppointmentDto, AppointmentSnapshot } from './appointment.types';
import { prisma } from '../../utils/prisma';

export class AppointmentService {
  private repo = new AppointmentRepository();

  searchMrn(search: string) {
    return this.repo.searchMrn(search);
  }

  getDoctors() {
    return this.repo.getDoctors();
  }

  list(filters: AppointmentFilters) {
    return this.repo.list(filters);
  }

  async create(dto: CreateAppointmentDto, userId?: string) {
    // Validate patient & doctor exist
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { patient_id: dto.patient_id } }),
      prisma.doctor.findUnique({ where: { id: dto.doctor_id } }),
    ]);
    if (!patient || patient.activeStatus !== 1) throw new AppError('Patient not found', 404);
    if (!doctor || (doctor as any).status === 0) throw new AppError('Doctor not found', 404);
    const snap: AppointmentSnapshot = {
      patient_mrn: patient.mrn,
      patient_title: patient.title,
      patient_firstName: patient.firstName,
      patient_lastName: patient.lastName,
      doctor_title: doctor.title,
      doctor_firstName: doctor.firstName,
      doctor_lastName: doctor.lastName,
      doctor_specialty: doctor.specialty,
    };

    return this.repo.create({ ...dto, ...snap, createdBy: userId, updatedBy: userId });
  }

  async update(id: number, dto: UpdateAppointmentDto, userId?: string) {
    const exists = await prisma.appointment.findUnique({ where: { appointment_id: id } });
    if (!exists || exists.status === 0) throw new AppError('Appointment not found', 404);
    const patientId = dto.patient_id ?? exists.patient_id;
    const doctorId = dto.doctor_id ?? exists.doctor_id;
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { patient_id: patientId } }),
      prisma.doctor.findUnique({ where: { id: doctorId } }),
    ]);
    if (!patient || patient.activeStatus !== 1) throw new AppError('Patient not found', 404);
    if (!doctor || (doctor as any).status === 0) throw new AppError('Doctor not found', 404);

    const snap: AppointmentSnapshot = {
      patient_mrn: patient.mrn,
      patient_title: patient.title,
      patient_firstName: patient.firstName,
      patient_lastName: patient.lastName,
      doctor_title: doctor.title,
      doctor_firstName: doctor.firstName,
      doctor_lastName: doctor.lastName,
      doctor_specialty: doctor.specialty,
    };

    return this.repo.update(id, { ...dto, ...snap, updatedBy: userId });
  }

  async remove(id: number, userId?: string) {
    const exists = await prisma.appointment.findUnique({ where: { appointment_id: id } });
    if (!exists || exists.status === 0) throw new AppError('Appointment not found', 404);
    return this.repo.softDelete(id, userId);
  }
}
