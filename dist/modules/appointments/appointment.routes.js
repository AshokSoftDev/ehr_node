"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const appointment_controller_1 = require("./appointment.controller");
const appointment_schema_1 = require("./appointment.schema");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const controller = new appointment_controller_1.AppointmentController();
// All appointment routes require auth + module permission
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.requireModule)('Appointments'));
// Search MRN -> patient_id + mrn list
router.get('/search/mrn', (0, validate_middleware_1.validate)(appointment_schema_1.searchMrnSchema), controller.searchMrn);
// Doctors list
router.get('/doctors', (0, validate_middleware_1.validate)(appointment_schema_1.doctorsListSchema), controller.doctors);
router.get('/completed', (0, validate_middleware_1.validate)(appointment_schema_1.listCheckedOutAppointmentsSchema), controller.listCheckedOut);
// Appointments CRUD + list
router.get('/', (0, validate_middleware_1.validate)(appointment_schema_1.listAppointmentsSchema), controller.list);
router.post('/', (0, validate_middleware_1.validate)(appointment_schema_1.createAppointmentSchema), controller.create);
router.put('/:id', (0, validate_middleware_1.validate)(appointment_schema_1.updateAppointmentSchema), controller.update);
router.delete('/:id', (0, validate_middleware_1.validate)(appointment_schema_1.deleteAppointmentSchema), controller.remove);
exports.default = router;
