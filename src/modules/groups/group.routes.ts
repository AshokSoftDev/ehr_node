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
router.post('/', requireRole('parent'), validate(createGroupSchema), groupController.createGroup);
router.get('/', groupController.listGroups);
// router.get('/', validate(listGroupsSchema), groupController.listGroups);
router.get('/:groupId', validate(getGroupSchema), groupController.getGroup);
router.put('/:groupId', requireRole('parent'), validate(updateGroupSchema), groupController.updateGroup);
router.delete('/:groupId', requireRole('parent'), validate(deleteGroupSchema), groupController.deleteGroup);

export default router;
