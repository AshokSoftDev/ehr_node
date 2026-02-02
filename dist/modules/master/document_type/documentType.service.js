"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeService = void 0;
const documentType_repository_1 = require("./documentType.repository");
const repository = new documentType_repository_1.DocumentTypeRepository();
class DocumentTypeService {
    list(filters) {
        return repository.findAll(filters);
    }
    getOne(id) {
        return repository.findById(id);
    }
    create(dto, userId) {
        return repository.create({
            ...dto,
            createdBy: userId,
        });
    }
    update(id, dto, userId) {
        return repository.update(id, {
            ...dto,
            updatedBy: userId,
        });
    }
    remove(id, userId) {
        return repository.softDelete(id, userId);
    }
}
exports.DocumentTypeService = DocumentTypeService;
