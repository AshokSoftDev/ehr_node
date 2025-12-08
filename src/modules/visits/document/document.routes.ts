import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validate } from '../../../middleware/validate.middleware';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentParamsSchema,
  listDocumentsSchema,
} from './document.schema';

const router = Router({ mergeParams: true });
const controller = new DocumentController();
 
// Configure multer storage 
const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    const visitId = Number(req.params.visitId);
    // We need patient_id from visit - fetch it
    const { DocumentRepository } = await import('./document.repository');
    const repo = new DocumentRepository();
    const visit = await repo.findVisitById(visitId);
    
    if (!visit) {
      return cb(new Error('Visit not found'), '');
    }
    
    const uploadDir = DocumentService.ensureUploadDir(visit.patient_id, visitId);
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter - only PDF and images
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Routes
router.get('/', validate(listDocumentsSchema), controller.list);
router.get('/:documentId', validate(documentParamsSchema), controller.getOne);
router.get('/:documentId/file', validate(documentParamsSchema), controller.serveFile);
router.post('/', upload.single('file'), controller.create);
router.put('/:documentId', validate(updateDocumentSchema), controller.update);
router.delete('/:documentId', validate(documentParamsSchema), controller.remove);

export default router;
