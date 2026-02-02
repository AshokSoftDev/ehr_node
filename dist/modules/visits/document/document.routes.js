"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const validate_middleware_1 = require("../../../middleware/validate.middleware");
const document_controller_1 = require("./document.controller");
const document_service_1 = require("./document.service");
const document_schema_1 = require("./document.schema");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new document_controller_1.DocumentController();
// Configure multer storage 
const storage = multer_1.default.diskStorage({
    destination: async (req, _file, cb) => {
        const visitId = Number(req.params.visitId);
        // We need patient_id from visit - fetch it
        const { DocumentRepository } = await Promise.resolve().then(() => __importStar(require('./document.repository')));
        const repo = new DocumentRepository();
        const visit = await repo.findVisitById(visitId);
        if (!visit) {
            return cb(new Error('Visit not found'), '');
        }
        const uploadDir = document_service_1.DocumentService.ensureUploadDir(visit.patient_id, visitId);
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});
// File filter - only PDF and images
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF and image files are allowed'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
// Routes
router.get('/', (0, validate_middleware_1.validate)(document_schema_1.listDocumentsSchema), controller.list);
router.get('/:documentId', (0, validate_middleware_1.validate)(document_schema_1.documentParamsSchema), controller.getOne);
router.get('/:documentId/file', (0, validate_middleware_1.validate)(document_schema_1.documentParamsSchema), controller.serveFile);
router.post('/', upload.single('file'), controller.create);
router.put('/:documentId', (0, validate_middleware_1.validate)(document_schema_1.updateDocumentSchema), controller.update);
router.delete('/:documentId', (0, validate_middleware_1.validate)(document_schema_1.documentParamsSchema), controller.remove);
exports.default = router;
