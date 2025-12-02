import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, requireModule } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
    createUserSchema,
    updateUserSchema,
    loginSchema,
    getUserSchema,
    deleteUserSchema,
    listUsersSchema,
} from './user.schema';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', validate(createUserSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// Protected routes
router.use(authenticate, requireModule('User Management')); // All routes below require authentication + module permission

router.post('/create', validate(createUserSchema), userController.registerWithAuth);
router.get('/', userController.listUsers);
// router.get('/', validate(listUsersSchema), userController.listUsers);
router.get('/:userId', validate(getUserSchema), userController.getUser);
router.put('/:userId', validate(updateUserSchema), userController.updateUser);
router.delete('/:userId', validate(deleteUserSchema), userController.deleteUser);

export default router;
