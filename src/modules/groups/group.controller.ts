import { Response } from 'express';
import { AuthRequest } from '../../types/express';
import { GroupService } from './group.service';
import { catchAsync } from '../../utils/errors';
import { CreateGroupDto, UpdateGroupDto } from './group.types';

export class GroupController {
    private groupService = new GroupService();

    createGroup = catchAsync(async (req: AuthRequest<CreateGroupDto>, res: Response) => {
        const group = await this.groupService.createGroup(req.body, req.user.userId);
        res.status(201).json({
            status: 'success',
            data: group,
        });
    });

    getGroup = catchAsync(async (req: AuthRequest<any, any, { groupId: string }>, res: Response) => {
        const group = await this.groupService.getGroup(req.params.groupId);
        res.json({
            status: 'success',
            data: group,
        });
    });

    updateGroup = catchAsync(async (req: AuthRequest<UpdateGroupDto, any, { groupId: string }>, res: Response) => {
        const group = await this.groupService.updateGroup(
            req.params.groupId,
            req.body,
            req.user.userId
        );
        res.json({
            status: 'success',
            data: group,
        });
    });

    deleteGroup = catchAsync(async (req: AuthRequest<any, any, { groupId: string }>, res: Response) => {
        await this.groupService.deleteGroup(req.params.groupId);
        res.status(204).send();
    });

    listGroups = catchAsync(async (req: AuthRequest, res: Response) => {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await this.groupService.listGroups(
            filters,
            Number(page),
            Number(limit)
        );
        res.json({
            status: 'success',
            data: result,
        });
    });

    getModules = catchAsync(async (req: AuthRequest, res: Response) => {
        const modules = await this.groupService.getModules();
        res.json({
            status: 'success',
            data: modules,
        });
    });
}
