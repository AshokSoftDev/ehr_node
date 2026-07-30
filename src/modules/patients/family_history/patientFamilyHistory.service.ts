import { AppError } from '../../../utils/errors';
import { PatientFamilyHistoryRepository } from './patientFamilyHistory.repository';
import { SyncPatientFamilyHistoryPayload } from './patientFamilyHistory.types';

export class PatientFamilyHistoryService {
  private repo = new PatientFamilyHistoryRepository();

  async list(patientId: number) {
    await this.ensurePatientActive(patientId);
    return this.repo.list(patientId);
  }

  async syncBulk(patientId: number, payloads: SyncPatientFamilyHistoryPayload[], userId?: string) {
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
          familyDisease: { connect: { family_disease_id: item.familyDiseaseId ?? existing.family_disease_id } },
          mother: item.mother !== undefined ? item.mother : existing.mother,
          father: item.father !== undefined ? item.father : existing.father,
          sisters: item.sisters !== undefined ? item.sisters : existing.sisters,
          brothers: item.brothers !== undefined ? item.brothers : existing.brothers,
          maternalMother: item.maternalMother !== undefined ? item.maternalMother : existing.maternalMother,
          maternalFather: item.maternalFather !== undefined ? item.maternalFather : existing.maternalFather,
          paternalMother: item.paternalMother !== undefined ? item.paternalMother : existing.paternalMother,
          paternalFather: item.paternalFather !== undefined ? item.paternalFather : existing.paternalFather,
          otherRelatives: item.otherRelatives !== undefined ? item.otherRelatives : existing.otherRelatives,
          comments: item.comments !== undefined ? item.comments : existing.comments,
          updatedBy: userId ?? null,
        });
      }
    }
    
    if (toAdd.length > 0) {
      const addData = toAdd.map(payload => ({
        patient_id: patientId,
        family_disease_id: payload.familyDiseaseId,
        mother: payload.mother ?? false,
        father: payload.father ?? false,
        sisters: payload.sisters ?? false,
        brothers: payload.brothers ?? false,
        maternalMother: payload.maternalMother ?? false,
        maternalFather: payload.maternalFather ?? false,
        paternalMother: payload.paternalMother ?? false,
        paternalFather: payload.paternalFather ?? false,
        otherRelatives: payload.otherRelatives ?? null,
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
