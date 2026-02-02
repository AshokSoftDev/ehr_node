"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientEmergencyController = void 0;
const errors_1 = require("../../../utils/errors");
const patientEmergency_service_1 = require("./patientEmergency.service");
class PatientEmergencyController {
    constructor() {
        this.service = new patientEmergency_service_1.PatientEmergencyService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const data = await this.service.list(patientId);
            res.status(200).json({ status: 'success', data });
        });
        this.get = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const peId = Number(req.params.peId);
            const data = await this.service.get(patientId, peId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const data = await this.service.create(patientId, req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const peId = Number(req.params.peId);
            const data = await this.service.update(patientId, peId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const peId = Number(req.params.peId);
            const data = await this.service.remove(patientId, peId, req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Emergency contact removed', data });
        });
    }
}
exports.PatientEmergencyController = PatientEmergencyController;
