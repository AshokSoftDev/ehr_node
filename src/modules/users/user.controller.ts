import { Response } from 'express';
import { AuthRequest, TypedRequest } from '../../types/express';
import { UserService } from './user.service';
import { catchAsync } from '../../utils/errors';
import { CreateUserDto, UpdateUserDto, LoginDto } from './user.types';

export class UserController {
  private userService = new UserService();

  register = catchAsync(async (req: TypedRequest<CreateUserDto>, res: Response) => {
    const result = await this.userService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  });

  registerWithAuth = catchAsync(async (req: AuthRequest<CreateUserDto>, res: Response) => {
    const result = await this.userService.register(req.body, req.user);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  });

  login = catchAsync(async (req: TypedRequest<LoginDto>, res: Response) => {
    const result = await this.userService.login(req.body);
    res.json({
      status: 'success',
      data: result,
    });
  });

  getUser = catchAsync(async (req: AuthRequest<any, any, { userId: string }>, res: Response) => {
    const user = await this.userService.getUser(req.params.userId, req.user);
    res.json({
      status: 'success',
      data: user,
    });
  });

  updateUser = catchAsync(async (req: AuthRequest<UpdateUserDto, any, { userId: string }>, res: Response) => {
    const user = await this.userService.updateUser(req.params.userId, req.body, req.user);
    res.json({
      status: 'success',
      data: user,
    });
  });

  deleteUser = catchAsync(async (req: AuthRequest<any, any, { userId: string }>, res: Response) => {
    await this.userService.deleteUser(req.params.userId, req.user);
    res.status(204).send();
  });

  listUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await this.userService.listUsers(
      filters,
      Number(page),
      Number(limit),
      req.user
    );
    res.json({
      status: 'success',
      data: result,
    });
  });
}
