import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto, LoginDto, AuthResponse, UserFilters } from './user.types';
import { hashPassword, verifyPassword } from '../../utils/bcrypt';
import { signJwt, signRefreshToken } from '../../utils/jwt';
import { AppError } from '../../utils/errors';

export class UserService {
  private userRepository = new UserRepository();

  async register(dto: CreateUserDto, currentUser?: any): Promise<AuthResponse> {
    // Check if email exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    // Determine parent and account type
    let parentId: string | undefined;
    let accountType = 'parent';

    if (currentUser) {
      // If created by a logged-in user
      if (currentUser.accountType === 'child') {
        // Child users create users under their parent
        parentId = currentUser.parentId || currentUser.userId;
        accountType = 'child';
      } else {
        // Parent users create child users
        parentId = currentUser.userId;
        accountType = 'child';
      }
    }

    // Create user
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
      createdBy: currentUser?.userId,
      parentId,
      accountType,
    });



    // Generate tokens
    const accessToken = signJwt({
      sub: user.userId,
      email: user.email,
      accountType: user.accountType,
      groupId: user.groupId,
    });

    const refreshToken = signRefreshToken(user.userId);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid credentials', 404);
    }

    // Check password
    const isValidPassword = await verifyPassword(dto.password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (user.userStatus !== 1) {
      throw new AppError('Account is inactive', 403);
    }

    // Generate tokens
    const accessToken = signJwt({
      sub: user.userId,
      email: user.email,
      accountType: user.accountType,
      groupId: user.groupId,
    });

    const refreshToken = signRefreshToken(user.userId);

    const { password, otp, otpExpiry, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async getUser(userId: string, currentUser: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check permissions
    if (!this.canAccessUser(currentUser, user)) {
      throw new AppError('Access denied', 403);
    }

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto, currentUser: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check permissions
    if (!this.canModifyUser(currentUser, user)) {
      throw new AppError('Access denied', 403);
    }

    return this.userRepository.update(userId, {
      ...dto,
      updatedBy: currentUser.userId,
    });
  }

  async deleteUser(userId: string, currentUser: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check permissions
    if (!this.canModifyUser(currentUser, user)) {
      throw new AppError('Access denied', 403);
    }

    // Prevent self-deletion
    if (userId === currentUser.userId) {
      throw new AppError('Cannot delete your own account', 400);
    }

    await this.userRepository.delete(userId);
  }

  async listUsers(filters: UserFilters, page: number, limit: number, currentUser: any) {
    // Apply access control filters
    const accessFilters = this.applyAccessFilters(filters, currentUser);
    return this.userRepository.findMany(accessFilters, page, limit);
  }

  private canAccessUser(currentUser: any, targetUser: any): boolean {
    // Users can access their own data
    if (currentUser.userId === targetUser.userId) return true;

    // Parent users can access their children
    if (currentUser.accountType === 'parent' && targetUser.parentId === currentUser.userId) return true;

    // Child users can access users under same parent
    if (currentUser.accountType === 'child' && currentUser.parentId === targetUser.parentId) return true;

    return false;
  }

  private canModifyUser(currentUser: any, targetUser: any): boolean {
    // Users can modify their own data
    if (currentUser.userId === targetUser.userId) return true;

    // Parent users can modify their children
    if (currentUser.accountType === 'parent' && targetUser.parentId === currentUser.userId) return true;

    return false;
  }

  private applyAccessFilters(filters: UserFilters, currentUser: any): UserFilters {
    const appliedFilters = { ...filters };

    // Exclude root-level accounts (parentId null) for non-root users
    if (currentUser?.parentId !== null) {
      appliedFilters.excludeRoot = true;
    }

    if (currentUser.accountType === 'parent') {
      // Parent sees only their children and themselves
      appliedFilters.parentId = currentUser.userId;
    } else if (currentUser.accountType === 'child') {
      // Child sees only users under same parent
      appliedFilters.parentId = currentUser.parentId;
    }

    return appliedFilters;
  }
}
