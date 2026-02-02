"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugController = void 0;
const errors_1 = require("../../../utils/errors");
const drug_service_1 = require("./drug.service");
class DrugController {
    constructor() {
        this.service = new drug_service_1.DrugService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const filters = {
                search: req.query.search,
            };
            const data = await this.service.list(filters);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const data = await this.service.create(req.body, req.user?.userId);
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const data = await this.service.update(Number(id), req.body, req.user?.userId);
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const data = await this.service.remove(Number(id), req.user?.userId);
            res.status(200).json({ status: 'success', message: 'Drug removed', data });
        });
    }
}
exports.DrugController = DrugController;
