import { Router } from 'express';
import { userController } from './user.controller';
import { validate } from '@/middlewares//validate';
import { createUserSchema, getUserSchema, updateUserSchema } from './user.schema';
// If you want to protect routes, uncomment requireAuth
// import { requireAuth } from '@/middlewares/requireAuth';

const router = Router();

router.post("/", validate(createUserSchema), userController.createUser);
router.get("/:id", validate(getUserSchema), userController.getUser);
router.get("/", userController.getAllUsers);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);


export default router;
