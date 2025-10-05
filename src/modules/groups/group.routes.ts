import { Router } from 'express';
import { GroupController } from './group.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
    createGroupSchema,
    updateGroupSchema,
    getGroupSchema,
    deleteGroupSchema,
    listGroupsSchema,
} from './group.schema';

const router = Router();
const groupController = new GroupController();

router.use(authenticate); 

router.get('/modules', groupController.getModules);


router.post(
    '/',
    validate(createGroupSchema),
    groupController.createGroup
  );
  
  router.get(
    '/',
    // validate(listGroupsSchema),
    groupController.listGroups
  );
  
  router.get(
    '/:id',
    validate(getGroupSchema),
    groupController.getGroup
  );
  
  router.put(
    '/:id',
    validate(updateGroupSchema),
    groupController.updateGroup
  );
  
  router.delete(
    '/:id',
    validate(deleteGroupSchema),
    groupController.deleteGroup
  );

export default router;
