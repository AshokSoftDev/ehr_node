"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientAllergyController = void 0;
const errors_1 = require("../../../utils/errors");
const patientAllergy_service_1 = require("./patientAllergy.service");
class PatientAllergyController {
    constructor() {
        this.service = new patientAllergy_service_1.PatientAllergyService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const search = typeof req.query.search === 'string' ? req.query.search : undefined;
            const data = await this.service.list(patientId, search);
            res.status(200).json({ status: 'success', data });
        });
        this.get = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const paId = Number(req.params.paId);
            const data = await this.service.get(patientId, paId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const data = await this.service.create(patientId, req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const paId = Number(req.params.paId);
            const data = await this.service.update(patientId, paId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const paId = Number(req.params.paId);
            const data = await this.service.remove(patientId, paId, req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Patient allergy removed', data });
        });
    }
}
exports.PatientAllergyController = PatientAllergyController;
