"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalNoteService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("../../../utils/errors");
const deepgram_1 = require("../../../utils/deepgram");
const clinicalNote_repository_1 = require("./clinicalNote.repository");
class ClinicalNoteService {
    constructor() {
        this.repo = new clinicalNote_repository_1.ClinicalNoteRepository();
    }
    async listByVisit(visitId) {
        await this.ensureVisitExists(visitId);
        return this.repo.listByVisit(visitId);
    }
    async create(visitId, payload, file, userId) {
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
                throw new errors_1.AppError('editor_notes is required for text notes', 400);
            }
            return this.repo.create({
                ...baseData,
                editor_notes: editorNotes,
            });
        }
        if (payload.notes_type === 'audio') {
            if (!file) {
                throw new errors_1.AppError('Audio file is required for audio notes', 400);
            }
            const audioFileName = await this.saveAudio(file);
            let transcription = '';
            try {
                transcription = await (0, deepgram_1.transcribeAudioFromAudios)(audioFileName);
            }
            catch (error) {
                await this.safeDeleteAudio(audioFileName);
                throw new errors_1.AppError(`Failed to transcribe audio: ${error?.message || 'Unknown error'}`, 500);
            }
            return this.repo.create({
                ...baseData,
                audio_url: audioFileName,
                transcription,
            });
        }
        throw new errors_1.AppError('Invalid notes_type', 400);
    }
    async update(visitId, noteId, payload, userId) {
        const note = await this.getNoteForVisitOrThrow(visitId, noteId);
        const editorNotes = (payload.editor_notes || '').trim();
        if (!editorNotes) {
            throw new errors_1.AppError('editor_notes is required', 400);
        }
        return this.repo.update(note.cn_id, {
            editor_notes: editorNotes,
            updatedBy: userId ?? null,
        });
    }
    async remove(visitId, noteId, userId) {
        const note = await this.getNoteForVisitOrThrow(visitId, noteId);
        return this.repo.update(note.cn_id, {
            status: 0,
            deletedAt: new Date(),
            deletedBy: userId ?? null,
        });
    }
    async getOne(visitId, noteId) {
        return this.getNoteForVisitOrThrow(visitId, noteId);
    }
    async ensureVisitExists(visitId) {
        const visit = await this.repo.findVisitById(visitId);
        if (!visit || visit.status === 0) {
            throw new errors_1.AppError('Visit not found', 404);
        }
        return visit;
    }
    async getNoteForVisitOrThrow(visitId, noteId) {
        const note = await this.repo.findById(noteId);
        if (!note || note.status === 0 || note.visit_id !== visitId) {
            throw new errors_1.AppError('Clinical note not found', 404);
        }
        return note;
    }
    async saveAudio(file) {
        const audiosDir = path_1.default.join(process.cwd(), 'audios');
        await fs_1.default.promises.mkdir(audiosDir, { recursive: true });
        const ext = path_1.default.extname(file.originalname || '').toLowerCase() || '.wav';
        const safeExt = ext && ext.length <= 5 ? ext : '.wav';
        const fileName = `note_${Date.now()}_${Math.floor(Math.random() * 1000000)}${safeExt}`;
        const filePath = path_1.default.join(audiosDir, fileName);
        await fs_1.default.promises.writeFile(filePath, file.buffer);
        return fileName;
    }
    async safeDeleteAudio(fileName) {
        const filePath = path_1.default.join(process.cwd(), 'audios', fileName);
        await fs_1.default.promises.unlink(filePath).catch(() => undefined);
    }
}
exports.ClinicalNoteService = ClinicalNoteService;
