import { Request, Response } from 'express';
import { GroupService } from './group.service';
import { CreateGroupInput, UpdateGroupInput, DeleteGroupInput, GetGroupInput, ListGroupsInput } from './group.schema';
import { UpdateGroupDto } from './group.types';

export class GroupController {
  private groupService: GroupService;

  constructor() {
    this.groupService = new GroupService();
  }

  createGroup = async (req: Request<{}, {}, CreateGroupInput['body']>, res: Response) => {
    try {
      const userId = (req as any).user?.userId; // Get from auth middleware
      const group = await this.groupService.createGroup(req.body, userId);
      
      res.status(201).json({
        status: 'success',
        message: 'Group created successfully',
        data: group,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to create group',
      });
    }
  };

  updateGroup = async (req: Request<UpdateGroupInput['params'], {}, UpdateGroupInput['body']>, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;
      const group = await this.groupService.updateGroup(id, req.body as UpdateGroupDto, userId);
      
      res.status(200).json({
        status: 'success',
        message: 'Group updated successfully',
        data: group,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to update group',
      });
    }
  };

  deleteGroup = async (req: Request<DeleteGroupInput['params']>, res: Response) => {
    try {
      const { id } = req.params;
      await this.groupService.deleteGroup(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Group deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to delete group',
      });
    }
  };

  getGroup = async (req: Request<GetGroupInput['params']>, res: Response) => {
    try {
      const { id } = req.params;
      const group = await this.groupService.getGroupById(id);
      
      res.status(200).json({
        status: 'success',
        data: group,
      });
    } catch (error: any) {
      res.status(404).json({
        status: 'error',
        message: error.message || 'Group not found',
      });
    }
  };

  listGroups = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string | undefined;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await this.groupService.listGroups({
        search,
        page: page || 1,
        limit: limit || 10,
      });
      
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to fetch groups',
      });
    }
  };

  getModules = async (req: Request, res: Response) => {
    try {
      const modules = await this.groupService.getAllModules();
      
      res.status(200).json({
        status: 'success',
        data: modules,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to fetch modules',
      });
    }
  };
}
