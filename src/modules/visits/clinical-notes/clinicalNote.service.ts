import fs from 'fs';
import path from 'path';
import { AppError } from '../../../utils/errors';
import { transcribeAudioFromAudios } from '../../../utils/deepgram';
import { generateSoapNotes } from '../../ai/soapNotes.service';
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

  /**
   * Create clinical note with AI-generated SOAP notes
   * 1. Saves audio file
   * 2. Transcribes via Deepgram
   * 3. Generates SOAP notes via AI
   * 4. Saves to both ai_notes (raw JSON) and editor_notes (formatted HTML)
   */
  async createWithSoapNotes(visitId: number, file: Express.Multer.File, userId?: string) {
    const visit = await this.ensureVisitExists(visitId);

    const baseData = {
      patient_id: visit.patient_id,
      appointment_id: visit.appointment_id ?? null,
      visit_id: visit.visit_id,
      location_id: visit.location_id ?? null,
      doctor_id: visit.doctor_id,
      notes_type: 'audio' as const,
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    };

    // 1. Save audio file
    const audioFileName = await this.saveAudio(file);
    let transcription = '';

    // 2. Transcribe via Deepgram
    try {
      transcription = await transcribeAudioFromAudios(audioFileName);
    } catch (error: any) {
      await this.safeDeleteAudio(audioFileName);
      throw new AppError(`Failed to transcribe audio: ${error?.message || 'Unknown error'}`, 500);
    }

    if (!transcription || transcription.trim().length === 0) {
      await this.safeDeleteAudio(audioFileName);
      throw new AppError('Transcription is empty. Please try recording again with clearer audio.', 400);
    }

    // 3. Generate SOAP notes via AI
    const soapResult = await generateSoapNotes(transcription);

    if (soapResult.error) {
      // Still save the note with transcription, but flag the AI error
      return this.repo.create({
        ...baseData,
        audio_url: audioFileName,
        transcription,
        ai_notes: JSON.stringify({ error: soapResult.error }),
        ai_notes_retry_count: 1,
      });
    }

    // 4. Format SOAP notes as HTML for editor_notes
    const editorNotes = this.formatSoapNotesToHtml(soapResult.soap_notes);

    return this.repo.create({
      ...baseData,
      audio_url: audioFileName,
      transcription,
      editor_notes: editorNotes,
      ai_notes: JSON.stringify(soapResult),
    });
  }

  /**
   * Format SOAP notes to HTML for display in the editor
   */
  private formatSoapNotesToHtml(soapNotes: any): string {
    if (!soapNotes) return '';

    const sections: string[] = [];

    // Subjective
    if (soapNotes.subjective) {
      const s = soapNotes.subjective;
      sections.push('<h2>Subjective</h2>');
      if (s.chief_complaint) sections.push(`<p><strong>Chief Complaint:</strong> ${s.chief_complaint}</p>`);
      if (s.history_of_present_illness) sections.push(`<p><strong>History of Present Illness:</strong> ${s.history_of_present_illness}</p>`);
      if (s.past_medical_history) sections.push(`<p><strong>Past Medical History:</strong> ${s.past_medical_history}</p>`);
      if (s.medications) sections.push(`<p><strong>Current Medications:</strong> ${s.medications}</p>`);
      if (s.allergies) sections.push(`<p><strong>Allergies:</strong> ${s.allergies}</p>`);
      if (s.social_history) sections.push(`<p><strong>Social History:</strong> ${s.social_history}</p>`);
      if (s.family_history) sections.push(`<p><strong>Family History:</strong> ${s.family_history}</p>`);
      if (s.review_of_systems) sections.push(`<p><strong>Review of Systems:</strong> ${s.review_of_systems}</p>`);
    }

    // Objective
    if (soapNotes.objective) {
      const o = soapNotes.objective;
      sections.push('<h2>Objective</h2>');
      if (o.vital_signs) {
        const vs = o.vital_signs;
        const vitals = [
          vs.blood_pressure && `BP: ${vs.blood_pressure}`,
          vs.pulse && `Pulse: ${vs.pulse}`,
          vs.temperature && `Temp: ${vs.temperature}`,
          vs.respiratory_rate && `RR: ${vs.respiratory_rate}`,
          vs.spo2 && `SpO2: ${vs.spo2}`,
          vs.weight && `Weight: ${vs.weight}`,
          vs.height && `Height: ${vs.height}`,
        ].filter(Boolean);
        if (vitals.length > 0) {
          sections.push(`<p><strong>Vital Signs:</strong> ${vitals.join(' | ')}</p>`);
        }
      }
      if (o.physical_examination) sections.push(`<p><strong>Physical Examination:</strong> ${o.physical_examination}</p>`);
      if (o.investigations) sections.push(`<p><strong>Investigations:</strong> ${o.investigations}</p>`);
    }

    // Assessment
    if (soapNotes.assessment) {
      const a = soapNotes.assessment;
      sections.push('<h2>Assessment</h2>');
      if (a.primary_diagnosis) sections.push(`<p><strong>Primary Diagnosis:</strong> ${a.primary_diagnosis}</p>`);
      if (a.differential_diagnosis && a.differential_diagnosis.length > 0) {
        sections.push(`<p><strong>Differential Diagnosis:</strong> ${a.differential_diagnosis.join(', ')}</p>`);
      }
      if (a.icd_codes && a.icd_codes.length > 0) {
        sections.push(`<p><strong>ICD Codes:</strong> ${a.icd_codes.join(', ')}</p>`);
      }
    }

    // Plan
    if (soapNotes.plan) {
      const p = soapNotes.plan;
      sections.push('<h2>Plan</h2>');
      if (p.treatment_plan) sections.push(`<p><strong>Treatment Plan:</strong> ${p.treatment_plan}</p>`);
      if (p.follow_up) sections.push(`<p><strong>Follow-up:</strong> ${p.follow_up}</p>`);
      if (p.referrals) sections.push(`<p><strong>Referrals:</strong> ${p.referrals}</p>`);
      if (p.patient_education) sections.push(`<p><strong>Patient Education:</strong> ${p.patient_education}</p>`);
    }

    return sections.join('\n');
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
