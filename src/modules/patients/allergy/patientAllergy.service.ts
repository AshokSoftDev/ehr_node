import { AppError } from '../../../utils/errors';
import { PatientAllergyRepository } from './patientAllergy.repository';
import { PatientAllergyPayload, PatientAllergyUpdatePayload, SyncPatientAllergyPayload } from './patientAllergy.types';

export class PatientAllergyService {
  private repo = new PatientAllergyRepository();

  async list(patientId: number, search?: string) {
    await this.ensurePatientActive(patientId);
    return this.repo.list(patientId, search);
  }

  async get(patientId: number, paId: number) {
    await this.ensurePatientActive(patientId);
    const record = await this.repo.findById(paId);
    if (!record || record.status === 0 || record.patient_id !== patientId) {
      throw new AppError('Patient allergy not found', 404);
    }
    return record;
  }

  async create(patientId: number, payload: PatientAllergyPayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    return this.repo.create({
      patient_id: patientId,
      allergyName: payload.allergyName,
      allergy_id: payload.allergyId ?? null,
      notes: payload.notes ?? null,
      status: payload.status ?? 1,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }

  async createBulk(patientId: number, payloads: PatientAllergyPayload[], userId?: string) {
    await this.ensurePatientActive(patientId);
    
    if (payloads.length === 0) return { count: 0 };

    const data = payloads.map((payload) => ({
      patient_id: patientId,
      allergyName: payload.allergyName,
      allergy_id: payload.allergyId ?? null,
      notes: payload.notes ?? null,
      status: payload.status ?? 1,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    }));

    return this.repo.createMany(data);
  }

  async syncBulk(patientId: number, payloads: SyncPatientAllergyPayload[], userId?: string) {
    await this.ensurePatientActive(patientId);
    
    // 1. Get current active allergies for patient
    const current = await this.repo.list(patientId);
    
    // 2. Determine which to keep, which to remove, which to add
    const incomingIds = payloads.filter(p => p.id !== undefined).map(p => p.id!);
    const toRemove = current.filter(c => !incomingIds.includes(c.id));
    const toUpdate = payloads.filter(p => p.id !== undefined);
    const toAdd = payloads.filter(p => p.id === undefined);
    
    // 3. Execute removes
    for (const item of toRemove) {
      await this.repo.update(item.id, {
        status: 0,
        deletedAt: new Date(),
        deletedBy: userId ?? null,
      });
    }
    
    // 4. Execute updates
    for (const item of toUpdate) {
      const existing = current.find(c => c.id === item.id);
      if (existing) {
        await this.repo.update(existing.id, {
          allergyName: item.allergyName ?? existing.allergyName,
          allergy_id: item.allergyId ?? existing.allergy_id ?? null,
          notes: item.notes !== undefined ? item.notes : existing.notes,
          updatedBy: userId ?? null,
        });
      }
    }
    
    // 5. Execute adds
    if (toAdd.length > 0) {
      const addData = toAdd.map(payload => ({
        patient_id: patientId,
        allergyName: payload.allergyName,
        allergy_id: payload.allergyId ?? null,
        notes: payload.notes ?? null,
        status: payload.status ?? 1,
        createdBy: userId ?? null,
        updatedBy: userId ?? null,
      }));
      await this.repo.createMany(addData);
    }
    
    return { success: true };
  }

  async update(patientId: number, paId: number, payload: PatientAllergyUpdatePayload, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.findById(paId);
    if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
      throw new AppError('Patient allergy not found', 404);
    }

    return this.repo.update(paId, {
      ...payload,
      allergyName: payload.allergyName ?? existing.allergyName,
      allergy_id: payload.allergyId ?? existing.allergy_id ?? null,
      notes: payload.notes !== undefined ? payload.notes : existing.notes,
      updatedBy: userId ?? null,
    });
  }

  async remove(patientId: number, paId: number, userId?: string) {
    await this.ensurePatientActive(patientId);
    const existing = await this.repo.findById(paId);
    if (!existing || existing.status === 0 || existing.patient_id !== patientId) {
      throw new AppError('Patient allergy not found', 404);
    }

    return this.repo.update(paId, {
      status: 0,
      deletedAt: new Date(),
      deletedBy: userId ?? null,
    });
  }

  private async ensurePatientActive(patientId: number) {
    const patient = await this.repo.findPatient(patientId);
    if (!patient || patient.activeStatus === 0) {
      throw new AppError('Patient not found', 404);
    }
    return patient;
  }
}
