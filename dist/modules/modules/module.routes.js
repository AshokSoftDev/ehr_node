"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const module_controller_1 = require("./module.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const moduleController = new module_controller_1.ModuleController();
router.use(auth_middleware_1.authenticate);
// Public routes (for authenticated users)
router.get('/', moduleController.listModules);
// Admin only routes
router.post('/seed', (0, auth_middleware_1.requireRole)('parent'), moduleController.seedModules);
router.post('/', (0, auth_middleware_1.requireRole)('parent'), moduleController.addModule);
router.post('/:moduleId/submodules', (0, auth_middleware_1.requireRole)('parent'), moduleController.addSubModule);
exports.default = router;
