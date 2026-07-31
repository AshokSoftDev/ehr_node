import path from 'path';
import fs from 'fs';
import { PatientDocumentRepository } from './patientDocument.repository';
import { CreatePatientDocumentDto, UpdatePatientDocumentDto } from './patientDocument.types';

const repository = new PatientDocumentRepository();

export class PatientDocumentService {
  async list(patientId: number, filters?: { search?: string; dateFrom?: string; dateTo?: string }) {
    return repository.listByPatient(patientId, filters);
  }

  async getOne(documentId: number) {
    return repository.findById(documentId);
  }

  async create(
    patientId: number,
    file: Express.Multer.File,
    dto: { document_type_id: string | number; description?: string },
    userId?: string
  ) {
    const patient = await repository.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Build relative path for storage
    const relativePath = `uploads/${patient.patient_id}/patient_document/${file.filename}`;

    const data: CreatePatientDocumentDto = {
      file_name: file.originalname,
      document_type_id: Number(dto.document_type_id),
      file_path: relativePath,
      description: dto.description,
      mime_type: file.mimetype,
      file_size: file.size,
    };

    return repository.create({
      patient_id: patientId,
      ...data,
      createdBy: userId,
    });
  }

  async update(documentId: number, dto: UpdatePatientDocumentDto, userId?: string) {
    return repository.update(documentId, {
      ...dto,
      updatedBy: userId,
    });
  }

  async remove(documentId: number, userId?: string) {
    return repository.softDelete(documentId, userId);
  }

  async getFilePath(documentId: number): Promise<string | null> {
    const doc = await repository.findById(documentId);
    if (!doc || doc.status !== 1) return null;
    
    const fullPath = path.join(process.cwd(), doc.file_path);
    if (!fs.existsSync(fullPath)) return null;
    
    return fullPath;
  }

  // Ensure upload directory exists
  static ensureUploadDir(patientId: number): string {
    const uploadDir = path.join(process.cwd(), 'uploads', String(patientId), 'patient_document');
    fs.mkdirSync(uploadDir, { recursive: true });
    return uploadDir;
  }
}
