"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitController = void 0;
const errors_1 = require("../../utils/errors");
const visit_service_1 = require("./visit.service");
class VisitController {
    constructor() {
        this.service = new visit_service_1.VisitService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const q = req.query;
            const filters = {
                dateFrom: q.dateFrom ? new Date(String(q.dateFrom)) : undefined,
                dateTo: q.dateTo ? new Date(String(q.dateTo)) : undefined,
                doctor: q.doctor,
                doctor_id: q.doctor_id,
                patient: q.patient,
                reason: q.reason,
                status: q.status,
                page: q.page ? Number(q.page) : 1,
                limit: q.limit ? Number(q.limit) : 10,
            };
            const data = await this.service.list(filters);
            res.status(200).json({ status: 'success', data });
        });
        this.getStatusCounts = (0, errors_1.catchAsync)(async (req, res) => {
            const q = req.query;
            const filters = {
                date: q.date ? new Date(String(q.date)) : undefined,
                doctorId: q.doctorId,
            };
            const data = await this.service.getStatusCounts(filters);
            res.status(200).json({ status: 'success', data });
        });
    }
}
exports.VisitController = VisitController;
