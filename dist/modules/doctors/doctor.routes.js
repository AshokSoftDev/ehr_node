"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("./doctor.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const doctor_schema_1 = require("./doctor.schema");
const router = (0, express_1.Router)();
const doctorController = new doctor_controller_1.DoctorController();
// All routes require authentication + module permission
router.use(auth_middleware_1.authenticate);
// router.use(authenticate, requireModule('Doctor Management'));
// Doctor routes
router.post('/', (0, validate_middleware_1.validate)(doctor_schema_1.createDoctorSchema), doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
// router.get('/', validateQuery(getAllDoctorsSchema), doctorController.getAllDoctors);
router.get('/:id', (0, validate_middleware_1.validate)(doctor_schema_1.getDoctorSchema), doctorController.getDoctor);
router.put('/:id', (0, validate_middleware_1.validate)(doctor_schema_1.updateDoctorSchema), doctorController.updateDoctor);
router.delete('/:id', (0, validate_middleware_1.validate)(doctor_schema_1.deleteDoctorSchema), doctorController.deleteDoctor);
exports.default = router;
