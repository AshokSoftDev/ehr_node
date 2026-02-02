"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DentalHpiController = void 0;
const errors_1 = require("../../../utils/errors");
const dentalHpi_service_1 = require("./dentalHpi.service");
class DentalHpiController {
    constructor() {
        this.service = new dentalHpi_service_1.DentalHpiService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.listByVisit(visitId);
            res.status(200).json({ status: 'success', data });
        });
        this.getOne = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const hpiId = Number(req.params.hpiId);
            const data = await this.service.getOne(visitId, hpiId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.create(visitId, req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const hpiId = Number(req.params.hpiId);
            const data = await this.service.update(visitId, hpiId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const hpiId = Number(req.params.hpiId);
            const data = await this.service.remove(visitId, hpiId, req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Dental HPI entry deleted', data });
        });
    }
}
exports.DentalHpiController = DentalHpiController;
