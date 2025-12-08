import { Prisma, DocumentType } from '@prisma/client';
import { prisma } from '../../../utils/prisma';
import { DocumentTypeFilters } from './documentType.types';

export class DocumentTypeRepository {
  create(data: Prisma.DocumentTypeCreateInput): Promise<DocumentType> {
    return prisma.documentType.create({ data });
  }

  findAll(filters?: DocumentTypeFilters): Promise<DocumentType[]> {
    const where: Prisma.DocumentTypeWhereInput = {
      status: filters?.status ?? 1,
    };

    if (filters?.search) {
      where.OR = [
        { type_name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.documentType.findMany({
      where,
      orderBy: { type_name: 'asc' },
    });
  }

  findById(id: number): Promise<DocumentType | null> {
    return prisma.documentType.findUnique({
      where: { document_type_id: id },
    });
  }

  update(id: number, data: Prisma.DocumentTypeUpdateInput): Promise<DocumentType> {
    return prisma.documentType.update({
      where: { document_type_id: id },
      data,
    });
  }

  softDelete(id: number, deletedBy?: string): Promise<DocumentType> {
    return prisma.documentType.update({
      where: { document_type_id: id },
      data: {
        status: 0,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }
}
