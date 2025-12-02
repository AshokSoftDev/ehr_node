import fs from 'fs';
import path from 'path';
import { AppError } from '../../../utils/errors';
import { transcribeAudioFromAudios } from '../../../utils/deepgram';
import { ClinicalNoteRepository } from './clinicalNote.repository';
import { CreateClinicalNoteDto, UpdateClinicalNoteDto } from './clinicalNote.types';

export class ClinicalNoteService {
  private repo = new ClinicalNoteRepository();

  async listByVisit(visitId: number) {
    await this.ensureVisitExists(visitId);
    return this.repo.listByVisit(visitId);
  }

  async create(visitId: number, payload: CreateClinicalNoteDto, file: Express.Multer.File | undefined, userId?: string) {
    const visit = await this.ensureVisitExists(visitId);

    const baseData = {
      patient_id: visit.patient_id,
      appointment_id: visit.appointment_id ?? null,
      visit_id: visit.visit_id,
      location_id: visit.location_id ?? null,
      doctor_id: visit.doctor_id,
      notes_type: payload.notes_type,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    };

    if (payload.notes_type === 'text') {
      const editorNotes = (payload.editor_notes || '').trim();
      if (!editorNotes) {
        throw new AppError('editor_notes is required for text notes', 400);
      }

      return this.repo.create({
        ...baseData,
        editor_notes: editorNotes,
      });
    }

    if (payload.notes_type === 'audio') {
      if (!file) {
        throw new AppError('Audio file is required for audio notes', 400);
      }

      const audioFileName = await this.saveAudio(file);
      let transcription = '';

      try {
        transcription = await transcribeAudioFromAudios(audioFileName);
      } catch (error: any) {
        await this.safeDeleteAudio(audioFileName);
        throw new AppError(`Failed to transcribe audio: ${error?.message || 'Unknown error'}`, 500);
      }

      return this.repo.create({
        ...baseData,
        audio_url: audioFileName,
        transcription,
      });
    }

    throw new AppError('Invalid notes_type', 400);
  }

  async update(visitId: number, noteId: number, payload: UpdateClinicalNoteDto, userId?: string) {
    const note = await this.getNoteForVisitOrThrow(visitId, noteId);
    const editorNotes = (payload.editor_notes || '').trim();
    if (!editorNotes) {
      throw new AppError('editor_notes is required', 400);
    }

    return this.repo.update(note.cn_id, {
      editor_notes: editorNotes,
      updatedBy: userId ?? null,
    });
  }

  async remove(visitId: number, noteId: number, userId?: string) {
    const note = await this.getNoteForVisitOrThrow(visitId, noteId);
    return this.repo.update(note.cn_id, {
      status: 0,
      deletedAt: new Date(),
      deletedBy: userId ?? null,
    });
  }

  async getOne(visitId: number, noteId: number) {
    return this.getNoteForVisitOrThrow(visitId, noteId);
  }

  private async ensureVisitExists(visitId: number) {
    const visit = await this.repo.findVisitById(visitId);
    if (!visit || visit.status === 0) {
      throw new AppError('Visit not found', 404);
    }
    return visit;
  }

  private async getNoteForVisitOrThrow(visitId: number, noteId: number) {
    const note = await this.repo.findById(noteId);
    if (!note || note.status === 0 || note.visit_id !== visitId) {
      throw new AppError('Clinical note not found', 404);
    }
    return note;
  }

  private async saveAudio(file: Express.Multer.File): Promise<string> {
    const audiosDir = path.join(process.cwd(), 'audios');
    await fs.promises.mkdir(audiosDir, { recursive: true });

    const ext = path.extname(file.originalname || '').toLowerCase() || '.wav';
    const safeExt = ext && ext.length <= 5 ? ext : '.wav';
    const fileName = `note_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}${safeExt}`;
    const filePath = path.join(audiosDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);
    return fileName;
  }

  private async safeDeleteAudio(fileName: string) {
    const filePath = path.join(process.cwd(), 'audios', fileName);
    await fs.promises.unlink(filePath).catch(() => undefined);
  }
}
