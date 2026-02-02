"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleController = void 0;
const module_service_1 = require("./module.service");
const errors_1 = require("../../utils/errors");
class ModuleController {
    constructor() {
        this.moduleService = new module_service_1.ModuleService();
        this.seedModules = (0, errors_1.catchAsync)(async (req, res) => {
            const modules = await this.moduleService.seedModules();
            res.status(201).json({
                status: 'success',
                message: 'Modules seeded successfully',
                data: modules,
            });
        });
        this.listModules = (0, errors_1.catchAsync)(async (req, res) => {
            const modules = await this.moduleService.listModules();
            res.json({
                status: 'success',
                data: modules,
            });
        });
        this.addModule = (0, errors_1.catchAsync)(async (req, res) => {
            const module = await this.moduleService.addModule(req.body);
            res.status(201).json({
                status: 'success',
                data: module,
            });
        });
        this.addSubModule = (0, errors_1.catchAsync)(async (req, res) => {
            const subModule = await this.moduleService.addSubModule(req.params.moduleId, req.body);
            res.status(201).json({
                status: 'success',
                data: subModule,
            });
        });
    }
}
exports.ModuleController = ModuleController;
