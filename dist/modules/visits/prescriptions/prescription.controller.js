"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const errors_1 = require("../../../utils/errors");
const prescription_service_1 = require("./prescription.service");
class PrescriptionController {
    constructor() {
        this.service = new prescription_service_1.PrescriptionService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.listByVisit(visitId);
            res.status(200).json({ status: 'success', data });
        });
        this.getOne = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const prescriptionId = Number(req.params.prescriptionId);
            const data = await this.service.getOne(visitId, prescriptionId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.create(visitId, req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        // Bulk create multiple prescriptions
        this.bulkCreate = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.bulkCreate(visitId, req.body.prescriptions, req.user?.userId);
            res.status(201).json({ status: 'success', data, message: `Created ${data.length} prescriptions` });
        });
        // Bulk update multiple prescriptions
        this.bulkUpdate = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.bulkUpdate(visitId, req.body.prescriptions, req.user?.userId);
            res.status(200).json({ status: 'success', data, message: `Updated ${data.length} prescriptions` });
        });
        // Bulk delete multiple prescriptions
        this.bulkDelete = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.bulkDelete(visitId, req.body.prescriptionIds, req.user?.userId);
            res.status(200).json({ status: 'success', data, message: `Deleted ${data.length} prescriptions` });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const prescriptionId = Number(req.params.prescriptionId);
            const data = await this.service.update(visitId, prescriptionId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const prescriptionId = Number(req.params.prescriptionId);
            const data = await this.service.remove(visitId, prescriptionId, req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Prescription deleted', data });
        });
    }
}
exports.PrescriptionController = PrescriptionController;
