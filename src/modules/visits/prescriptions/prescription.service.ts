import { AppError } from '../../../utils/errors';
import { PrescriptionRepository } from './prescription.repository';
import { CreatePrescriptionDto, UpdatePrescriptionDto, BulkUpdatePrescriptionItem } from './prescription.types';

export class PrescriptionService {
  private repo = new PrescriptionRepository();

  async listByVisit(visitId: number) {
    await this.ensureVisitExists(visitId);
    return this.repo.listByVisit(visitId);
  }

  async create(visitId: number, payload: CreatePrescriptionDto, userId?: string) {
    const visit = await this.ensureVisitExists(visitId);

    return this.repo.create({
      visit_id: visit.visit_id,
      patient_id: visit.patient_id,
      appointment_id: visit.appointment_id ?? null,
      doctor_id: visit.doctor_id,
      drug_id: payload.drug_id ?? null,
      drug_name: payload.drug_name,
      drug_generic: payload.drug_generic ?? null,
      drug_type: payload.drug_type ?? null,
      drug_dosage: payload.drug_dosage ?? null,
      drug_measure: payload.drug_measure ?? null,
      instruction: payload.instruction ?? null,
      duration: payload.duration ?? null,
      duration_type: payload.duration_type ?? null,
      quantity: payload.quantity ?? null,
      morning_bf: payload.morning_bf ?? false,
      morning_af: payload.morning_af ?? false,
      noon_bf: payload.noon_bf ?? false,
      noon_af: payload.noon_af ?? false,
      evening_bf: payload.evening_bf ?? false,
      evening_af: payload.evening_af ?? false,
      night_bf: payload.night_bf ?? false,
      night_af: payload.night_af ?? false,
      notes: payload.notes ?? null,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }

  // Bulk create multiple prescriptions
  async bulkCreate(visitId: number, prescriptions: CreatePrescriptionDto[], userId?: string) {
    const visit = await this.ensureVisitExists(visitId);

    const results = await Promise.all(
      prescriptions.map((payload) =>
        this.repo.create({
          visit_id: visit.visit_id,
          patient_id: visit.patient_id,
          appointment_id: visit.appointment_id ?? null,
          doctor_id: visit.doctor_id,
          drug_id: payload.drug_id ?? null,
          drug_name: payload.drug_name,
          drug_generic: payload.drug_generic ?? null,
          drug_type: payload.drug_type ?? null,
          drug_dosage: payload.drug_dosage ?? null,
          drug_measure: payload.drug_measure ?? null,
          instruction: payload.instruction ?? null,
          duration: payload.duration ?? null,
          duration_type: payload.duration_type ?? null,
          quantity: payload.quantity ?? null,
          morning_bf: payload.morning_bf ?? false,
          morning_af: payload.morning_af ?? false,
          noon_bf: payload.noon_bf ?? false,
          noon_af: payload.noon_af ?? false,
          evening_bf: payload.evening_bf ?? false,
          evening_af: payload.evening_af ?? false,
          night_bf: payload.night_bf ?? false,
          night_af: payload.night_af ?? false,
          notes: payload.notes ?? null,
          createdBy: userId ?? null,
          updatedBy: userId ?? null,
        })
      )
    );

    return results;
  }

  // Bulk update multiple prescriptions
  async bulkUpdate(visitId: number, prescriptions: BulkUpdatePrescriptionItem[], userId?: string) {
    await this.ensureVisitExists(visitId);

    const results = await Promise.all(
      prescriptions.map(async (item) => {
        const { prescription_id, ...payload } = item;
        await this.getPrescriptionForVisitOrThrow(visitId, prescription_id);
        return this.repo.update(prescription_id, {
          ...payload,
          updatedBy: userId ?? null,
        });
      })
    );

    return results;
  }

  // Bulk delete (soft delete) multiple prescriptions
  async bulkDelete(visitId: number, prescriptionIds: number[], userId?: string) {
    await this.ensureVisitExists(visitId);

    const results = await Promise.all(
      prescriptionIds.map(async (prescriptionId) => {
        await this.getPrescriptionForVisitOrThrow(visitId, prescriptionId);
        return this.repo.update(prescriptionId, {
          status: 0,
          deletedAt: new Date(),
          deletedBy: userId ?? null,
        });
      })
    );

    return results;
  }

  async update(visitId: number, prescriptionId: number, payload: UpdatePrescriptionDto, userId?: string) {
    const prescription = await this.getPrescriptionForVisitOrThrow(visitId, prescriptionId);

    return this.repo.update(prescription.prescription_id, {
      ...payload,
      updatedBy: userId ?? null,
    });
  }

  async remove(visitId: number, prescriptionId: number, userId?: string) {
    const prescription = await this.getPrescriptionForVisitOrThrow(visitId, prescriptionId);

    return this.repo.update(prescription.prescription_id, {
      status: 0,
      deletedAt: new Date(),
      deletedBy: userId ?? null,
    });
  }

  async getOne(visitId: number, prescriptionId: number) {
    return this.getPrescriptionForVisitOrThrow(visitId, prescriptionId);
  }

  private async ensureVisitExists(visitId: number) {
    const visit = await this.repo.findVisitById(visitId);
    if (!visit || visit.status === 0) {
      throw new AppError('Visit not found', 404);
    }
    return visit;
  }

  private async getPrescriptionForVisitOrThrow(visitId: number, prescriptionId: number) {
    const prescription = await this.repo.findById(prescriptionId);
    if (!prescription || prescription.status === 0 || prescription.visit_id !== visitId) {
      throw new AppError('Prescription not found', 404);
    }
    return prescription;
  }
}

