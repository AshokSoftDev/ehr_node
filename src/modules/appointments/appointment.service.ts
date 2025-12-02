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

  listCheckedOut(filters: { patient_id?: number; dateFrom?: Date; dateTo?: Date; page?: number; limit?: number }) {
    return this.repo.listCheckedOut(filters);
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

    const statusUpper = dto.appointment_status?.toUpperCase();

    const appointment = await this.repo.create({
      ...dto,
      appointment_status: statusUpper,
      ...snap,
      createdBy: userId,
      updatedBy: userId,
    });

    // Create a corresponding Visit record for this appointment.
    // Uses appointment_date as visit_date and mirrors key fields.
    try {
      await (prisma as any).visit.create({
        data: {
          appointment_id: appointment.appointment_id,
          patient_id: appointment.patient_id,
          visit_date: appointment.appointment_date,
          location_id: null,
          doctor_id: appointment.doctor_id,
          visit_type: appointment.appointment_type,
          reason_for_visit: appointment.reason_for_visit,
          status: 1,
          createdBy: userId,
          updatedBy: userId,
        },
      });
    } catch (error) {
      // Swallow visit creation errors to avoid breaking appointment creation.
      // Log to console for debugging; can be replaced with structured logging.
      // eslint-disable-next-line no-console
      console.error('Failed to create Visit for appointment', error);
    }

    return appointment;
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

    const nextStatus = dto.appointment_status ? dto.appointment_status.toUpperCase() : undefined;

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

    const updated = await this.repo.update(id, {
      ...dto,
      appointment_status: nextStatus ?? exists.appointment_status,
      ...snap,
      updatedBy: userId,
    });

    // If moved to WITH DOCTOR, ensure a Visit exists for this appointment.
    if (nextStatus === 'WITH DOCTOR') {
      const client = prisma as any;
      const visitExists = await client.visit.findFirst({
        where: { appointment_id: id },
      });
      if (!visitExists) {
        try {
          await client.visit.create({
            data: {
              appointment_id: id,
              patient_id: updated.patient_id,
              visit_date: updated.appointment_date,
              location_id: null,
              doctor_id: updated.doctor_id,
              visit_type: updated.appointment_type,
              reason_for_visit: updated.reason_for_visit,
              status: 1,
              createdBy: userId,
              updatedBy: userId,
            },
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to create Visit on status change', error);
        }
      }
    }

    return updated;
  }

  async remove(id: number, userId?: string) {
    const exists = await prisma.appointment.findUnique({ where: { appointment_id: id } });
    if (!exists || exists.status === 0) throw new AppError('Appointment not found', 404);
    return this.repo.softDelete(id, userId);
  }
}
