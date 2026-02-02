"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeController = void 0;
const errors_1 = require("../../../utils/errors");
const documentType_service_1 = require("./documentType.service");
const service = new documentType_service_1.DocumentTypeService();
class DocumentTypeController {
    constructor() {
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const filters = req.query;
            const documentTypes = await service.list(filters);
            res.json({ status: 'success', data: documentTypes });
        });
        this.getOne = (0, errors_1.catchAsync)(async (req, res) => {
            const id = Number(req.params.id);
            const documentType = await service.getOne(id);
            if (!documentType) {
                return res.status(404).json({ status: 'error', message: 'Document type not found' });
            }
            res.json({ status: 'success', data: documentType });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const documentType = await service.create(req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data: documentType });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const id = Number(req.params.id);
            const documentType = await service.update(id, req.body, req.user?.userId);
            res.json({ status: 'success', data: documentType });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const id = Number(req.params.id);
            await service.remove(id, req.user?.userId);
            res.json({ status: 'success', message: 'Document type deleted' });
        });
    }
}
exports.DocumentTypeController = DocumentTypeController;
