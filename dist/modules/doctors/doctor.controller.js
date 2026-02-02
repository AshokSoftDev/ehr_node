"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const doctor_service_1 = require("./doctor.service");
const errors_1 = require("../../utils/errors");
class DoctorController {
    constructor() {
        this.doctorService = new doctor_service_1.DoctorService();
        this.createDoctor = (0, errors_1.catchAsync)(async (req, res) => {
            const doctor = await this.doctorService.createDoctor(req.body, req.user.userId);
            res.status(201).json({
                status: 'success',
                data: doctor,
            });
        });
        this.updateDoctor = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const doctor = await this.doctorService.updateDoctor(id, req.body, req.user.userId);
            res.status(200).json({
                status: 'success',
                data: doctor,
            });
        });
        this.getDoctor = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const doctor = await this.doctorService.getDoctorById(id);
            res.status(200).json({
                status: 'success',
                data: doctor,
            });
        });
        this.getAllDoctors = (0, errors_1.catchAsync)(async (req, res) => {
            const filters = {
                search: req.query.search,
                specialty: req.query.specialty,
                status: req.query.status ? parseInt(req.query.status) : undefined,
                email: req.query.email,
                licenceNo: req.query.licenceNo,
            };
            const pagination = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
            };
            const result = await this.doctorService.getAllDoctors(filters, pagination);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        });
        this.deleteDoctor = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const doctor = await this.doctorService.deleteDoctor(id, req.user.userId);
            res.status(200).json({
                status: 'success',
                message: 'Doctor deactivated successfully',
                data: doctor,
            });
        });
    }
}
exports.DoctorController = DoctorController;
