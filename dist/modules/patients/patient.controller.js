"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const patient_service_1 = require("./patient.service");
class PatientController {
    constructor() {
        this.patientService = new patient_service_1.PatientService();
        this.createPatient = async (req, res, next) => {
            try {
                const dto = req.body;
                const userId = 'c9a8b9e4-1b7d-4b8a-9f0a-3d2c1b7e8f0a'; // Replace with actual user ID from auth
                const patient = await this.patientService.createPatient(dto, userId);
                res.status(201).json(patient);
            }
            catch (error) {
                next(error);
            }
        };
        this.updatePatient = async (req, res, next) => {
            try {
                const { id } = req.params;
                const dto = req.body;
                const userId = 'c9a8b9e4-1b7d-4b8a-9f0a-3d2c1b7e8f0a'; // Replace with actual user ID from auth
                const patient = await this.patientService.updatePatient(Number(id), dto, userId);
                res.status(200).json(patient);
            }
            catch (error) {
                next(error);
            }
        };
        this.getPatientById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const patient = await this.patientService.getPatientById(Number(id));
                res.status(200).json(patient);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllPatients = async (req, res, next) => {
            try {
                const { search, page, limit } = req.query;
                const filters = {
                    search: search,
                };
                const pagination = {
                    page: page ? Number(page) : undefined,
                    limit: limit ? Number(limit) : undefined,
                };
                const result = await this.patientService.getAllPatients(filters, pagination);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.deletePatient = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = 'c9a8b9e4-1b7d-4b8a-9f0a-3d2c1b7e8f0a'; // Replace with actual user ID from auth
                const patient = await this.patientService.deletePatient(Number(id), userId);
                res.status(200).json(patient);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.PatientController = PatientController;
