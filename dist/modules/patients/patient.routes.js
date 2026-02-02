"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("./patient.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const patientInfo_routes_1 = __importDefault(require("./info/patientInfo.routes"));
const patientEmergency_routes_1 = __importDefault(require("./emergency/patientEmergency.routes"));
const patientAllergy_routes_1 = __importDefault(require("./allergy/patientAllergy.routes"));
const patient_schema_1 = require("./patient.schema");
const router = (0, express_1.Router)();
const patientController = new patient_controller_1.PatientController();
router.use(auth_middleware_1.authenticate);
// router.use(authenticate, requireModule('Patient Management'));
// Nested resources
router.use('/:patientId/info', patientInfo_routes_1.default);
router.use('/:patientId/emergency', patientEmergency_routes_1.default);
router.use('/:patientId/allergies', patientAllergy_routes_1.default);
router.post('/', (0, validate_middleware_1.validate)(patient_schema_1.createPatientSchema), patientController.createPatient);
router.get('/', (0, validate_middleware_1.validate)(patient_schema_1.getAllPatientsSchema), patientController.getAllPatients);
router.get('/:id', (0, validate_middleware_1.validate)(patient_schema_1.getPatientSchema), patientController.getPatientById);
router.put('/:id', (0, validate_middleware_1.validate)(patient_schema_1.updatePatientSchema), patientController.updatePatient);
router.delete('/:id', (0, validate_middleware_1.validate)(patient_schema_1.deletePatientSchema), patientController.deletePatient);
exports.default = router;
