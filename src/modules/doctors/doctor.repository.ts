import { prisma } from '../../utils/prisma';
import { CreateDoctorDto, UpdateDoctorDto, DoctorFilters, DoctorWithCounts, DoctorListResponse, PaginationParams } from './doctor.types';
import { Prisma } from '@prisma/client';

export class DoctorRepository {
    async create(data: CreateDoctorDto & { createdBy: string }): Promise<DoctorWithCounts> {
        return prisma.doctor.create({
            data,
        });
    }

    async findById(id: string): Promise<DoctorWithCounts | null> {
        return prisma.doctor.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<DoctorWithCounts | null> {
        return prisma.doctor.findUnique({
            where: { email },
        });
    }

    async findByLicenceNo(licenceNo: string): Promise<DoctorWithCounts | null> {
        return prisma.doctor.findUnique({
            where: { licenceNo },
        });
    }

    async update(id: string, data: UpdateDoctorDto & { updatedBy: string }): Promise<DoctorWithCounts> {
        return prisma.doctor.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: string, deletedBy: string): Promise<DoctorWithCounts> {
        return prisma.doctor.update({
            where: { id },
            data: {
                status: 0,
                deletedAt: new Date(),
                deletedBy,
            },
        });
    }

    async findAll(filters: DoctorFilters = {}, pagination: PaginationParams = {}): Promise<DoctorListResponse> {
        const { search, specialty, status = 1, email, licenceNo } = filters;
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const where: Prisma.DoctorWhereInput = {
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { displayName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { licenceNo: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(specialty && { specialty: { contains: specialty, mode: 'insensitive' } }),
            ...(status !== undefined && { status }),
            ...(email && { email: { contains: email, mode: 'insensitive' } }),
            ...(licenceNo && { licenceNo: { contains: licenceNo, mode: 'insensitive' } }),
        };

        const [doctors, total] = await Promise.all([
            prisma.doctor.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.doctor.count({ where }),
        ]);

        return {
            doctors,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findActive(pagination: PaginationParams = {}): Promise<DoctorListResponse> {
        return this.findAll({ status: 1 }, pagination);
    }
}
