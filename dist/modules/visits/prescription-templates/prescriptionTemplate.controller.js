"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionTemplateController = void 0;
const errors_1 = require("../../../utils/errors");
const prescriptionTemplate_service_1 = require("./prescriptionTemplate.service");
class PrescriptionTemplateController {
    constructor() {
        this.service = new prescriptionTemplate_service_1.PrescriptionTemplateService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const templateId = req.query.template_id ? Number(req.query.template_id) : undefined;
            const search = req.query.search ? String(req.query.search) : undefined;
            const data = await this.service.list(templateId, search);
            res.status(200).json({ status: 'success', data });
        });
        this.getOne = (0, errors_1.catchAsync)(async (req, res) => {
            const tempId = Number(req.params.tempId);
            const data = await this.service.getOne(tempId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const data = await this.service.create(req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.bulkCreate = (0, errors_1.catchAsync)(async (req, res) => {
            const data = await this.service.bulkCreate(req.body.templates, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const tempId = Number(req.params.tempId);
            const data = await this.service.update(tempId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const tempId = Number(req.params.tempId);
            const data = await this.service.remove(tempId, req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Prescription template deleted', data });
        });
    }
}
exports.PrescriptionTemplateController = PrescriptionTemplateController;
