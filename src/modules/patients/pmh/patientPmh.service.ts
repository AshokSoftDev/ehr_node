import { AppError } from '../../../utils/errors';
import { PatientPmhRepository } from './patientPmh.repository';
import { SyncPatientPmhPayload } from './patientPmh.types';

export class PatientPmhService {
  private repo = new PatientPmhRepository();

  async list(patientId: number) {
    await this.ensurePatientActive(patientId);
    return this.repo.list(patientId);
  }

  async syncBulk(patientId: number, payloads: SyncPatientPmhPayload[], userId?: string) {
    await this.ensurePatientActive(patientId);
    
    // 1. Get current active PMH for patient
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
          pmh: { connect: { pmh_id: item.pmhId ?? existing.pmh_id } },
          month: item.month !== undefined ? item.month : existing.month,
          year: item.year !== undefined ? item.year : existing.year,
          comments: item.comments !== undefined ? item.comments : existing.comments,
          updatedBy: userId ?? null,
        });
      }
    }
    
    // 5. Execute adds
    if (toAdd.length > 0) {
      const addData = toAdd.map(payload => ({
        patient_id: patientId,
        pmh_id: payload.pmhId,
        month: payload.month ?? null,
        year: payload.year ?? null,
        comments: payload.comments ?? null,
        status: payload.status ?? 1,
        createdBy: userId ?? null,
        updatedBy: userId ?? null,
      }));
      await this.repo.createMany(addData);
    }
    
    return { success: true };
  }

  private async ensurePatientActive(patientId: number) {
    const patient = await this.repo.findPatient(patientId);
    if (!patient || patient.activeStatus === 0) {
      throw new AppError('Patient not found', 404);
    }
    return patient;
  }
}
