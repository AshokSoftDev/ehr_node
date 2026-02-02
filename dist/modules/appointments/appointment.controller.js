"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const errors_1 = require("../../utils/errors");
const appointment_service_1 = require("./appointment.service");
class AppointmentController {
    constructor() {
        this.service = new appointment_service_1.AppointmentService();
        this.searchMrn = (0, errors_1.catchAsync)(async (req, res) => {
            const { search } = req.query;
            const data = await this.service.searchMrn(String(search));
            res.status(200).json({ status: 'success', data });
        });
        this.doctors = (0, errors_1.catchAsync)(async (_req, res) => {
            const data = await this.service.getDoctors();
            res.status(200).json({ status: 'success', data });
        });
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const q = req.query;
            const filters = {
                search: q.search,
                mrn: q.mrn,
                patientName: q.patientName,
                doctorName: q.doctorName,
                dateFrom: q.dateFrom ? new Date(String(q.dateFrom)) : undefined,
                dateTo: q.dateTo ? new Date(String(q.dateTo)) : undefined,
                page: q.page ? Number(q.page) : 1,
                limit: q.limit ? Number(q.limit) : 10,
            };
            const data = await this.service.list(filters);
            res.status(200).json({ status: 'success', data });
        });
        this.listCheckedOut = (0, errors_1.catchAsync)(async (req, res) => {
            const q = req.query;
            const filters = {
                patient_id: q.patient_id ? Number(q.patient_id) : undefined,
                dateFrom: q.dateFrom ? new Date(String(q.dateFrom)) : undefined,
                dateTo: q.dateTo ? new Date(String(q.dateTo)) : undefined,
                page: q.page ? Number(q.page) : 1,
                limit: q.limit ? Number(q.limit) : 10,
            };
            const data = await this.service.listCheckedOut(filters);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const data = await this.service.create(req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const data = await this.service.update(Number(id), req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const data = await this.service.remove(Number(id), req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Appointment deleted', data });
        });
    }
}
exports.AppointmentController = AppointmentController;
