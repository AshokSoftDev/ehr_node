import { Request, Response, NextFunction } from 'express';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './patient.types';

export class PatientController {
    private patientService = new PatientService();

    createPatient = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: CreatePatientDto = req.body;
            const userId = 'c9a8b9e4-1b7d-4b8a-9f0a-3d2c1b7e8f0a'; // Replace with actual user ID from auth
            const patient = await this.patientService.createPatient(dto, userId);
            res.status(201).json(patient);
        } catch (error) {
            next(error);
        }
    };

    updatePatient = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const dto: UpdatePatientDto = req.body;
            const userId = 'c9a8b9e4-1b7d-4b8a-9f0a-3d2c1b7e8f0a'; // Replace with actual user ID from auth
            const patient = await this.patientService.updatePatient(Number(id), dto, userId);
            res.status(200).json(patient);
        } catch (error) {
            next(error);
        }
    };

    getPatientById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const patient = await this.patientService.getPatientById(Number(id));
            res.status(200).json(patient);
        } catch (error) {
            next(error);
        }
    };

    getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { search, page, limit } = req.query;
            const filters = {
                search: search as string,
            };
            const pagination = {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            };
            const result = await this.patientService.getAllPatients(filters, pagination);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    deletePatient = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = 'c9a8b9e4-1b7d-4b8a-9f0a-3d2c1b7e8f0a'; // Replace with actual user ID from auth
            const patient = await this.patientService.deletePatient(Number(id), userId);
            res.status(200).json(patient);
        } catch (error) {
            next(error);
        }
    };
}
