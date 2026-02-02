"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalNoteController = void 0;
const errors_1 = require("../../../utils/errors");
const clinicalNote_service_1 = require("./clinicalNote.service");
class ClinicalNoteController {
    constructor() {
        this.service = new clinicalNote_service_1.ClinicalNoteService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.listByVisit(visitId);
            res.status(200).json({ status: 'success', data });
        });
        this.getOne = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const noteId = Number(req.params.noteId);
            const data = await this.service.getOne(visitId, noteId);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const data = await this.service.create(visitId, req.body, req.file, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const noteId = Number(req.params.noteId);
            const data = await this.service.update(visitId, noteId, req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const visitId = Number(req.params.visitId);
            const noteId = Number(req.params.noteId);
            const data = await this.service.remove(visitId, noteId, req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Clinical note deleted', data });
        });
    }
}
exports.ClinicalNoteController = ClinicalNoteController;
