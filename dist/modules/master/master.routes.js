"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const insurance_controller_1 = require("./insurance/insurance.controller");
const insurance_schema_1 = require("./insurance/insurance.schema");
const allergy_controller_1 = require("./allergy/allergy.controller");
const allergy_schema_1 = require("./allergy/allergy.schema");
const drug_controller_1 = require("./drug/drug.controller");
const drug_schema_1 = require("./drug/drug.schema");
const location_controller_1 = require("./location/location.controller");
const location_schema_1 = require("./location/location.schema");
const documentType_routes_1 = __importDefault(require("./document_type/documentType.routes"));
const router = (0, express_1.Router)();
// Authenticate all master routes
// router.use(authenticate, requireModule('Location Master'));
router.use(auth_middleware_1.authenticate);
// Insurance routes
const insuranceController = new insurance_controller_1.InsuranceController();
router.get('/insurance', (0, validate_middleware_1.validate)(insurance_schema_1.listInsuranceSchema), insuranceController.list);
router.post('/insurance', (0, validate_middleware_1.validate)(insurance_schema_1.createInsuranceSchema), insuranceController.create);
router.put('/insurance/:id', (0, validate_middleware_1.validate)(insurance_schema_1.updateInsuranceSchema), insuranceController.update);
router.delete('/insurance/:id', (0, validate_middleware_1.validate)(insurance_schema_1.deleteInsuranceSchema), insuranceController.remove);
// Allergy routes
const allergyController = new allergy_controller_1.AllergyController();
router.get('/allergy', (0, validate_middleware_1.validate)(allergy_schema_1.listAllergySchema), allergyController.list);
router.post('/allergy', (0, validate_middleware_1.validate)(allergy_schema_1.createAllergySchema), allergyController.create);
router.put('/allergy/:id', (0, validate_middleware_1.validate)(allergy_schema_1.updateAllergySchema), allergyController.update);
router.delete('/allergy/:id', (0, validate_middleware_1.validate)(allergy_schema_1.deleteAllergySchema), allergyController.remove);
// Drug routes
const drugController = new drug_controller_1.DrugController();
router.get('/drug', (0, validate_middleware_1.validate)(drug_schema_1.listDrugSchema), drugController.list);
router.post('/drug', (0, validate_middleware_1.validate)(drug_schema_1.createDrugSchema), drugController.create);
router.put('/drug/:id', (0, validate_middleware_1.validate)(drug_schema_1.updateDrugSchema), drugController.update);
router.delete('/drug/:id', (0, validate_middleware_1.validate)(drug_schema_1.deleteDrugSchema), drugController.remove);
// Document Type routes
router.use('/document-type', documentType_routes_1.default);
// Location routes
const locationController = new location_controller_1.LocationController();
router.get('/location', (0, validate_middleware_1.validate)(location_schema_1.listLocationSchema), locationController.list);
router.post('/location', (0, validate_middleware_1.validate)(location_schema_1.createLocationSchema), locationController.create);
router.put('/location/:id', (0, validate_middleware_1.validate)(location_schema_1.updateLocationSchema), locationController.update);
router.delete('/location/:id', (0, validate_middleware_1.validate)(location_schema_1.deleteLocationSchema), locationController.remove);
exports.default = router;
