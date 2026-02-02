"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const errors_1 = require("../../utils/errors");
const appointment_repository_1 = require("./appointment.repository");
const prisma_1 = require("../../utils/prisma");
class AppointmentService {
    constructor() {
        this.repo = new appointment_repository_1.AppointmentRepository();
    }
    searchMrn(search) {
        return this.repo.searchMrn(search);
    }
    getDoctors() {
        return this.repo.getDoctors();
    }
    list(filters) {
        return this.repo.list(filters);
    }
    listCheckedOut(filters) {
        return this.repo.listCheckedOut(filters);
    }
    async create(dto, userId) {
        // Validate patient & doctor exist
        const [patient, doctor] = await Promise.all([
            prisma_1.prisma.patient.findUnique({ where: { patient_id: dto.patient_id } }),
            prisma_1.prisma.doctor.findUnique({ where: { id: dto.doctor_id } }),
        ]);
        if (!patient || patient.activeStatus !== 1)
            throw new errors_1.AppError('Patient not found', 404);
        if (!doctor || doctor.status === 0)
            throw new errors_1.AppError('Doctor not found', 404);
        const snap = {
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
            await prisma_1.prisma.visit.create({
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
        }
        catch (error) {
            // Swallow visit creation errors to avoid breaking appointment creation.
            // Log to console for debugging; can be replaced with structured logging.
            // eslint-disable-next-line no-console
            console.error('Failed to create Visit for appointment', error);
        }
        return appointment;
    }
    async update(id, dto, userId) {
        const exists = await prisma_1.prisma.appointment.findUnique({ where: { appointment_id: id } });
        if (!exists || exists.status === 0)
            throw new errors_1.AppError('Appointment not found', 404);
        const patientId = dto.patient_id ?? exists.patient_id;
        const doctorId = dto.doctor_id ?? exists.doctor_id;
        const [patient, doctor] = await Promise.all([
            prisma_1.prisma.patient.findUnique({ where: { patient_id: patientId } }),
            prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } }),
        ]);
        if (!patient || patient.activeStatus !== 1)
            throw new errors_1.AppError('Patient not found', 404);
        if (!doctor || doctor.status === 0)
            throw new errors_1.AppError('Doctor not found', 404);
        const nextStatus = dto.appointment_status ? dto.appointment_status.toUpperCase() : undefined;
        const snap = {
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
            const client = prisma_1.prisma;
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
                }
                catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to create Visit on status change', error);
                }
            }
        }
        return updated;
    }
    async remove(id, userId) {
        const exists = await prisma_1.prisma.appointment.findUnique({ where: { appointment_id: id } });
        if (!exists || exists.status === 0)
            throw new errors_1.AppError('Appointment not found', 404);
        return this.repo.softDelete(id, userId);
    }
}
exports.AppointmentService = AppointmentService;
