"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientInfoController = void 0;
const errors_1 = require("../../../utils/errors");
const patientInfo_service_1 = require("./patientInfo.service");
class PatientInfoController {
    constructor() {
        this.service = new patientInfo_service_1.PatientInfoService();
        this.get = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const data = await this.service.get(patientId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const data = await this.service.create(patientId, req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const patientId = Number(req.params.patientId);
            const data = await this.service.update(patientId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
    }
}
exports.PatientInfoController = PatientInfoController;
