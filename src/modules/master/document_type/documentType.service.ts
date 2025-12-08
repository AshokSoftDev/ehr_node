import { DocumentTypeRepository } from './documentType.repository';
import { CreateDocumentTypeDto, UpdateDocumentTypeDto, DocumentTypeFilters } from './documentType.types';

const repository = new DocumentTypeRepository();

export class DocumentTypeService {
  list(filters?: DocumentTypeFilters) {
    return repository.findAll(filters);
  }

  getOne(id: number) {
    return repository.findById(id);
  }

  create(dto: CreateDocumentTypeDto, userId?: string) {
    return repository.create({
      ...dto,
      createdBy: userId,
    });
  }

  update(id: number, dto: UpdateDocumentTypeDto, userId?: string) {
    return repository.update(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  remove(id: number, userId?: string) {
    return repository.softDelete(id, userId);
  }
}
