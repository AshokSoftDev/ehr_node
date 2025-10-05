import { Response } from 'express';
import { AuthRequest } from '../../types/express';
import { DoctorService } from './doctor.service';
import { catchAsync } from '../../utils/errors';
import { CreateDoctorDto, UpdateDoctorDto, DoctorFilters, PaginationParams } from './doctor.types';

export class DoctorController {
    private doctorService = new DoctorService();

    createDoctor = catchAsync(async (req: AuthRequest<CreateDoctorDto>, res: Response) => {
        const doctor = await this.doctorService.createDoctor(req.body, req.user.userId);
        res.status(201).json({
            status: 'success',
            data: doctor,
        });
    });

    updateDoctor = catchAsync(async (req: AuthRequest<UpdateDoctorDto>, res: Response) => {
        const { id } = req.params;
        const doctor = await this.doctorService.updateDoctor(id, req.body, req.user.userId);
        res.status(200).json({
            status: 'success',
            data: doctor,
        });
    });

    getDoctor = catchAsync(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const doctor = await this.doctorService.getDoctorById(id);
        res.status(200).json({
            status: 'success',
            data: doctor,
        });
    });

    getAllDoctors = catchAsync(async (req: AuthRequest, res: Response) => {
        const filters: DoctorFilters = {
            search: req.query.search as string,
            specialty: req.query.specialty as string,
            status: req.query.status ? parseInt(req.query.status as string) : undefined,
            email: req.query.email as string,
            licenceNo: req.query.licenceNo as string,
        };

        const pagination: PaginationParams = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const result = await this.doctorService.getAllDoctors(filters, pagination);
        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    deleteDoctor = catchAsync(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const doctor = await this.doctorService.deleteDoctor(id, req.user.userId);
        res.status(200).json({
            status: 'success',
            message: 'Doctor deactivated successfully',
            data: doctor,
        });
    });
}
