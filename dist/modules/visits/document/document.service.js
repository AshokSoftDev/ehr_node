"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const document_repository_1 = require("./document.repository");
const repository = new document_repository_1.DocumentRepository();
class DocumentService {
    async list(visitId) {
        return repository.listByVisit(visitId);
    }
    async getOne(documentId) {
        return repository.findById(documentId);
    }
    async create(visitId, file, dto, userId) {
        const visit = await repository.findVisitById(visitId);
        if (!visit) {
            throw new Error('Visit not found');
        }
        // Build relative path for storage
        const relativePath = `uploads/${visit.patient_id}/${visitId}/document/${file.filename}`;
        const data = {
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
    async update(documentId, dto, userId) {
        return repository.update(documentId, {
            ...dto,
            updatedBy: userId,
        });
    }
    async remove(documentId, userId) {
        return repository.softDelete(documentId, userId);
    }
    async getFilePath(documentId) {
        const doc = await repository.findById(documentId);
        if (!doc || doc.status !== 1)
            return null;
        const fullPath = path_1.default.join(process.cwd(), doc.file_path);
        if (!fs_1.default.existsSync(fullPath))
            return null;
        return fullPath;
    }
    // Ensure upload directory exists
    static ensureUploadDir(patientId, visitId) {
        const uploadDir = path_1.default.join(process.cwd(), 'uploads', String(patientId), String(visitId), 'document');
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
        return uploadDir;
    }
}
exports.DocumentService = DocumentService;
