import { AppError } from '../../../utils/errors';
import { PatientSocialHistoryRepository } from './patientSocialHistory.repository';
import { SyncPatientSocialHistoryPayload } from './patientSocialHistory.types';

export class PatientSocialHistoryService {
  private repo = new PatientSocialHistoryRepository();

  async list(patientId: number) {
    await this.ensurePatientActive(patientId);
    return this.repo.list(patientId);
  }

  async syncBulk(patientId: number, payloads: SyncPatientSocialHistoryPayload[], userId?: string) {
    await this.ensurePatientActive(patientId);

    const current = await this.repo.list(patientId);

    const incomingIds = payloads.filter(p => p.id !== undefined).map(p => p.id!);
    const toRemove = current.filter(c => !incomingIds.includes(c.id));
    const toUpdate = payloads.filter(p => p.id !== undefined);
    const toAdd = payloads.filter(p => p.id === undefined);

    for (const item of toRemove) {
      await this.repo.update(item.id, {
        status: 0,
        deletedAt: new Date(),
        deletedBy: userId ?? null,
      });
    }

    for (const item of toUpdate) {
      const existing = current.find(c => c.id === item.id);
      if (existing) {
        await this.repo.update(existing.id, {
          socialMaster: { connect: { social_master_id: item.socialMasterId ?? existing.social_master_id } },
          selectedOption: item.selectedOption !== undefined ? item.selectedOption : existing.selectedOption,
          comments: item.comments !== undefined ? item.comments : existing.comments,
          updatedBy: userId ?? null,
        });
      }
    }

    if (toAdd.length > 0) {
      const addData = toAdd.map(payload => ({
        patient_id: patientId,
        social_master_id: payload.socialMasterId,
        selectedOption: payload.selectedOption ?? null,
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
