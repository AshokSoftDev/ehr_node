import { Response } from 'express';
import { AuthRequest } from '../../types/express';
import { ModuleService } from './module.service';
import { catchAsync } from '../../utils/errors';

export class ModuleController {
    private moduleService = new ModuleService();

    seedModules = catchAsync(async (req: AuthRequest, res: Response) => {
        const modules = await this.moduleService.seedModules();
        res.status(201).json({
            status: 'success',
            message: 'Modules seeded successfully',
            data: modules,
        });
    });

    listModules = catchAsync(async (req: AuthRequest, res: Response) => {
        const modules = await this.moduleService.listModules();
        res.json({
            status: 'success',
            data: modules,
        });
    });

    addModule = catchAsync(async (req: AuthRequest, res: Response) => {
        const module = await this.moduleService.addModule(req.body);
        res.status(201).json({
            status: 'success',
            data: module,
        });
    });

    addSubModule = catchAsync(async (req: AuthRequest, res: Response) => {
        const subModule = await this.moduleService.addSubModule(
            req.params.moduleId,
            req.body
        );
        res.status(201).json({
            status: 'success',
            data: subModule,
        });
    });
}
