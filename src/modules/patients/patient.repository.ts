import { prisma } from '../../utils/prisma';
import { CreatePatientDto, UpdatePatientDto, PatientFilters, PatientListResponse, PaginationParams } from './patient.types';
import { Prisma, Patient } from '@prisma/client';

export class PatientRepository {

    async findNextMrn(): Promise<string> {
        const lastPatient = await prisma.patient.findFirst({
            orderBy: {
                patient_id: 'desc',
            },
        });

        let nextMrnNumber = 1001;
        if (lastPatient && lastPatient.mrn) {
            const lastMrnNumber = parseInt(lastPatient.mrn.replace('MRN', ''));
            nextMrnNumber = lastMrnNumber + 1;
        }

        return `MRN${nextMrnNumber}`;
    }

    async create(data: CreatePatientDto & { createdBy: string; updatedBy: string }): Promise<Patient> {
        const mrn = await this.findNextMrn();
        return prisma.patient.create({
            data: {
                ...data,
                mrn,
            },
        });
    }

    async findById(id: number): Promise<Patient | null> {
        return prisma.patient.findUnique({
            where: { patient_id: id, activeStatus: 1 },
        });
    }

    async update(id: number, data: UpdatePatientDto & { updatedBy: string }): Promise<Patient> {
        return prisma.patient.update({
            where: { patient_id: id },
            data,
        });
    }

    async softDelete(id: number, updatedBy: string): Promise<Patient> {
        return prisma.patient.update({
            where: { patient_id: id },
            data: {
                activeStatus: 0,
                updatedBy,
            },
        });
    }

    async findAll(filters: PatientFilters = {}, pagination: PaginationParams = {}): Promise<PatientListResponse> {
        const { search } = filters;
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const where: Prisma.PatientWhereInput = {
            activeStatus: 1,
            ...(search && {
                OR: [
                    { mrn: { contains: search, mode: 'insensitive' } },
                    { mobileNumber: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.patient.count({ where }),
        ]);

        return {
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
}
