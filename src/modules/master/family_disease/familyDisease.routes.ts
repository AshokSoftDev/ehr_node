import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { FamilyDiseaseController } from './familyDisease.controller';
import {
  createFamilyDiseaseSchema,
  listFamilyDiseaseSchema,
  updateFamilyDiseaseSchema,
  deleteFamilyDiseaseSchema,
} from './familyDisease.schema';

const router = Router();
const controller = new FamilyDiseaseController();

router.get('/', validate(listFamilyDiseaseSchema), controller.list);
router.post('/', validate(createFamilyDiseaseSchema), controller.create);
router.get('/:id', validate(deleteFamilyDiseaseSchema), controller.get);
router.put('/:id', validate(updateFamilyDiseaseSchema), controller.update);
router.delete('/:id', validate(deleteFamilyDiseaseSchema), controller.remove);

export default router;
