"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const visit_controller_1 = require("./visit.controller");
const visit_schema_1 = require("./visit.schema");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const clinicalNote_routes_1 = __importDefault(require("./clinical-notes/clinicalNote.routes"));
const prescription_routes_1 = __importDefault(require("./prescriptions/prescription.routes"));
const prescriptionTemplate_routes_1 = __importDefault(require("./prescription-templates/prescriptionTemplate.routes"));
const document_routes_1 = __importDefault(require("./document/document.routes"));
const dentalHpi_routes_1 = __importDefault(require("./dental-hpi/dentalHpi.routes"));
const router = (0, express_1.Router)();
const controller = new visit_controller_1.VisitController();
router.use(auth_middleware_1.authenticate);
// router.use(authenticate, requireModule('Visits'));
router.use('/:visitId/clinical-notes', clinicalNote_routes_1.default);
router.use('/:visitId/prescriptions', prescription_routes_1.default);
router.use('/:visitId/documents', document_routes_1.default);
router.use('/:visitId/dental-hpi', dentalHpi_routes_1.default);
router.use('/prescription-templates', prescriptionTemplate_routes_1.default);
// Status counts for dashboard cards
router.get('/status-counts', controller.getStatusCounts);
// List visits with filters and pagination
router.get('/', (0, validate_middleware_1.validate)(visit_schema_1.listVisitsSchema), controller.list);
exports.default = router;
