"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const document_service_1 = require("./document.service");
const errors_1 = require("../../../utils/errors");
const service = new document_service_1.DocumentService();
class DocumentController {
    constructor() {
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const documents = await service.list(visitId);
            res.json({ status: 'success', data: documents });
        });
        this.getOne = (0, errors_1.catchAsync)(async (req, res) => {
            const documentId = Number(req.params.documentId);
            const document = await service.getOne(documentId);
            if (!document) {
                return res.status(404).json({ status: 'error', message: 'Document not found' });
            }
            res.json({ status: 'success', data: document });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const file = req.file;
            if (!file) {
                return res.status(400).json({ status: 'error', message: 'No file uploaded' });
            }
            const userId = req.user?.id;
            const document = await service.create(visitId, file, req.body, userId);
            res.status(201).json({ status: 'success', data: document });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const documentId = Number(req.params.documentId);
            const userId = req.user?.id;
            const document = await service.update(documentId, req.body, userId);
            res.json({ status: 'success', data: document });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const documentId = Number(req.params.documentId);
            const userId = req.user?.id;
            const document = await service.remove(documentId, userId);
            res.json({ status: 'success', data: document });
        });
        this.serveFile = (0, errors_1.catchAsync)(async (req, res) => {
            const documentId = Number(req.params.documentId);
            try {
                const filePath = await service.getFilePath(documentId);
                if (!filePath) {
                    return res.status(404).json({ status: 'error', message: 'File not found' });
                }
                // Set headers to allow cross-origin embedding
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
                res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
                res.sendFile(filePath);
            }
            catch (error) {
                console.error('Error serving file:', error);
                return res.status(500).json({ status: 'error', message: 'Failed to serve file' });
            }
        });
    }
}
exports.DocumentController = DocumentController;
