"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
const errors_1 = require("../../utils/errors");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(dto, currentUser) {
        // Check if email exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new errors_1.AppError('Email already registered', 409);
        }
        // Hash password
        const hashedPassword = await (0, bcrypt_1.hashPassword)(dto.password);
        // Determine parent and account type
        let parentId;
        let accountType = 'parent';
        if (currentUser) {
            // If created by a logged-in user
            if (currentUser.accountType === 'child') {
                // Child users create users under their parent
                parentId = currentUser.parentId || currentUser.userId;
                accountType = 'child';
            }
            else {
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
        const accessToken = (0, jwt_1.signJwt)({
            sub: user.userId,
            email: user.email,
            accountType: user.accountType,
            groupId: user.groupId,
        });
        const refreshToken = (0, jwt_1.signRefreshToken)(user.userId);
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async login(dto) {
        // Find user
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new errors_1.AppError('Invalid credentials', 404);
        }
        // Check password
        const isValidPassword = await (0, bcrypt_1.verifyPassword)(dto.password, user.password);
        if (!isValidPassword) {
            throw new errors_1.AppError('Invalid credentials', 401);
        }
        // Check if user is active
        if (user.userStatus !== 1) {
            throw new errors_1.AppError('Account is inactive', 403);
        }
        // Generate tokens
        const accessToken = (0, jwt_1.signJwt)({
            sub: user.userId,
            email: user.email,
            accountType: user.accountType,
            groupId: user.groupId,
        });
        const refreshToken = (0, jwt_1.signRefreshToken)(user.userId);
        const { password, otp, otpExpiry, ...safeUser } = user;
        return {
            user: safeUser,
            accessToken,
            refreshToken,
        };
    }
    async getUser(userId, currentUser) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        // Check permissions
        if (!this.canAccessUser(currentUser, user)) {
            throw new errors_1.AppError('Access denied', 403);
        }
        return user;
    }
    async updateUser(userId, dto, currentUser) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        // Check permissions
        if (!this.canModifyUser(currentUser, user)) {
            throw new errors_1.AppError('Access denied', 403);
        }
        return this.userRepository.update(userId, {
            ...dto,
            updatedBy: currentUser.userId,
        });
    }
    async deleteUser(userId, currentUser) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        // Check permissions
        if (!this.canModifyUser(currentUser, user)) {
            throw new errors_1.AppError('Access denied', 403);
        }
        // Prevent self-deletion
        if (userId === currentUser.userId) {
            throw new errors_1.AppError('Cannot delete your own account', 400);
        }
        await this.userRepository.delete(userId);
    }
    async listUsers(filters, page, limit, currentUser) {
        // Apply access control filters
        const accessFilters = this.applyAccessFilters(filters, currentUser);
        return this.userRepository.findMany(accessFilters, page, limit);
    }
    canAccessUser(currentUser, targetUser) {
        // Users can access their own data
        if (currentUser.userId === targetUser.userId)
            return true;
        // Parent users can access their children
        if (currentUser.accountType === 'parent' && targetUser.parentId === currentUser.userId)
            return true;
        // Child users can access users under same parent
        if (currentUser.accountType === 'child' && currentUser.parentId === targetUser.parentId)
            return true;
        return false;
    }
    canModifyUser(currentUser, targetUser) {
        // Users can modify their own data
        if (currentUser.userId === targetUser.userId)
            return true;
        // Parent users can modify their children
        if (currentUser.accountType === 'parent' && targetUser.parentId === currentUser.userId)
            return true;
        return false;
    }
    applyAccessFilters(filters, currentUser) {
        const appliedFilters = { ...filters };
        // Exclude root-level accounts (parentId null) for non-root users
        if (currentUser?.parentId !== null) {
            appliedFilters.excludeRoot = true;
        }
        if (currentUser.accountType === 'parent') {
            // Parent sees only their children and themselves
            appliedFilters.parentId = currentUser.userId;
        }
        else if (currentUser.accountType === 'child') {
            // Child sees only users under same parent
            appliedFilters.parentId = currentUser.parentId;
        }
        return appliedFilters;
    }
}
exports.UserService = UserService;
