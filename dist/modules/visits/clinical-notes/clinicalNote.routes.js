"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const validate_middleware_1 = require("../../../middleware/validate.middleware");
const clinicalNote_controller_1 = require("./clinicalNote.controller");
const clinicalNote_schema_1 = require("./clinicalNote.schema");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new clinicalNote_controller_1.ClinicalNoteController();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/', (0, validate_middleware_1.validate)(clinicalNote_schema_1.listClinicalNotesSchema), controller.list);
router.get('/:noteId', (0, validate_middleware_1.validate)(clinicalNote_schema_1.clinicalNoteParamsSchema), controller.getOne);
router.post('/', upload.single('audio'), (0, validate_middleware_1.validate)(clinicalNote_schema_1.createClinicalNoteSchema), controller.create);
router.put('/:noteId', (0, validate_middleware_1.validate)(clinicalNote_schema_1.updateClinicalNoteSchema), controller.update);
router.delete('/:noteId', (0, validate_middleware_1.validate)(clinicalNote_schema_1.clinicalNoteParamsSchema), controller.remove);
exports.default = router;
