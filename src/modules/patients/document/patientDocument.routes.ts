import { Router } from 'express';
import { PatientDocumentController } from './patientDocument.controller';
import { PatientDocumentService } from './patientDocument.service';
import multer from 'multer';
import path from 'path';

const router = Router({ mergeParams: true });
const controller = new PatientDocumentController();

// Configure multer storage 
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const patientId = Number(req.params.patientId);
    try {
      const uploadDir = PatientDocumentService.ensureUploadDir(patientId);
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, '');
    }
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

router.get('/', controller.list);
router.post('/', upload.single('file'), controller.create);
router.get('/:documentId', controller.getOne);
router.put('/:documentId', controller.update);
router.delete('/:documentId', controller.remove);
router.get('/:documentId/file', controller.serveFile);

export default router;
