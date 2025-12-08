import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authenticate, requireModule } from '../../middleware/auth.middleware';

import { InsuranceController } from './insurance/insurance.controller';
import {
  listInsuranceSchema,
  createInsuranceSchema,
  updateInsuranceSchema,
  deleteInsuranceSchema,
} from './insurance/insurance.schema';

import { AllergyController } from './allergy/allergy.controller';
import {
  listAllergySchema,
  createAllergySchema,
  updateAllergySchema,
  deleteAllergySchema,
} from './allergy/allergy.schema';
import { DrugController } from './drug/drug.controller';
import {
  listDrugSchema,
  createDrugSchema,
  updateDrugSchema,
  deleteDrugSchema,
} from './drug/drug.schema';
import { LocationController } from './location/location.controller';
import {
  listLocationSchema,
  createLocationSchema,
  updateLocationSchema,
  deleteLocationSchema,
} from './location/location.schema';
import documentTypeRoutes from './document_type/documentType.routes';

const router = Router();

// Authenticate all master routes
// router.use(authenticate, requireModule('Location Master'));
router.use(authenticate);

// Insurance routes
const insuranceController = new InsuranceController();
router.get('/insurance', validate(listInsuranceSchema), insuranceController.list);
router.post('/insurance', validate(createInsuranceSchema), insuranceController.create);
router.put('/insurance/:id', validate(updateInsuranceSchema), insuranceController.update);
router.delete('/insurance/:id', validate(deleteInsuranceSchema), insuranceController.remove);

// Allergy routes
const allergyController = new AllergyController();
router.get('/allergy', validate(listAllergySchema), allergyController.list);
router.post('/allergy', validate(createAllergySchema), allergyController.create);
router.put('/allergy/:id', validate(updateAllergySchema), allergyController.update);
router.delete('/allergy/:id', validate(deleteAllergySchema), allergyController.remove);

// Drug routes
const drugController = new DrugController();
router.get('/drug', validate(listDrugSchema), drugController.list);
router.post('/drug', validate(createDrugSchema), drugController.create);
router.put('/drug/:id', validate(updateDrugSchema), drugController.update);
router.delete('/drug/:id', validate(deleteDrugSchema), drugController.remove);

// Document Type routes
router.use('/document-type', documentTypeRoutes);

// Location routes
const locationController = new LocationController();
router.get('/location', validate(listLocationSchema), locationController.list);
router.post('/location', validate(createLocationSchema), locationController.create);
router.put('/location/:id', validate(updateLocationSchema), locationController.update);
router.delete('/location/:id', validate(deleteLocationSchema), locationController.remove);

export default router;
