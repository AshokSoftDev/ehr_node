import { Router } from 'express';
import { validate } from '../../../middleware/validate.middleware';
import { SocialController } from './social.controller';
import {
  createSocialSchema,
  listSocialSchema,
  updateSocialSchema,
  deleteSocialSchema,
} from './social.schema';

const router = Router();
const controller = new SocialController();

router.get('/', validate(listSocialSchema), controller.list);
router.post('/', validate(createSocialSchema), controller.create);
router.get('/:id', validate(deleteSocialSchema), controller.get);
router.put('/:id', validate(updateSocialSchema), controller.update);
router.delete('/:id', validate(deleteSocialSchema), controller.remove);

export default router;
