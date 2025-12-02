import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'password' | 'otp' | 'otpExpiry'>;

export interface CreateUserDto {
    title: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    groupId?: string;
    dob?: Date;
}

export interface UpdateUserDto {
    title?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    groupId?: string;
    userStatus?: number;
    dob?: Date;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: SafeUser;
    accessToken: string;
    refreshToken?: string;
}

export interface UserFilters {
    groupId?: string;
    userStatus?: number;
    accountType?: string;
    parentId?: string;
    search?: string;
    excludeRoot?: boolean;
}
