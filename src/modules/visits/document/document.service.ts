import path from 'path';
import fs from 'fs';
import { DocumentRepository } from './document.repository';
import { CreateDocumentDto, UpdateDocumentDto } from './document.types';

const repository = new DocumentRepository();

export class DocumentService {
  async list(visitId: number) {
    return repository.listByVisit(visitId);
  }

  async getOne(documentId: number) {
    return repository.findById(documentId);
  }

  async create(
    visitId: number,
    file: Express.Multer.File,
    dto: { document_type_id: string | number; description?: string },
    userId?: string
  ) {
    const visit = await repository.findVisitById(visitId);
    if (!visit) {
      throw new Error('Visit not found');
    }

    // Build relative path for storage
    const relativePath = `uploads/${visit.patient_id}/${visitId}/document/${file.filename}`;

    const data: CreateDocumentDto = {
      file_name: file.originalname,
      document_type_id: Number(dto.document_type_id),
      file_path: relativePath,
      description: dto.description,
      mime_type: file.mimetype,
      file_size: file.size,
    };

    return repository.create({
      visit_id: visitId,
      patient_id: visit.patient_id,
      ...data,
      createdBy: userId,
    });
  }

  async update(documentId: number, dto: UpdateDocumentDto, userId?: string) {
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
  static ensureUploadDir(patientId: number, visitId: number): string {
    const uploadDir = path.join(process.cwd(), 'uploads', String(patientId), String(visitId), 'document');
    fs.mkdirSync(uploadDir, { recursive: true });
    return uploadDir;
  }
}
