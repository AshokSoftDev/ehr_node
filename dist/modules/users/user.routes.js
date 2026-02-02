"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const user_schema_1 = require("./user.schema");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Public routes
router.post('/register', (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), userController.register);
router.post('/login', (0, validate_middleware_1.validate)(user_schema_1.loginSchema), userController.login);
// Protected routes
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.requireModule)('User Management')); // All routes below require authentication + module permission
router.post('/create', (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), userController.registerWithAuth);
router.get('/', userController.listUsers);
// router.get('/', validate(listUsersSchema), userController.listUsers);
router.get('/:userId', (0, validate_middleware_1.validate)(user_schema_1.getUserSchema), userController.getUser);
router.put('/:userId', (0, validate_middleware_1.validate)(user_schema_1.updateUserSchema), userController.updateUser);
router.delete('/:userId', (0, validate_middleware_1.validate)(user_schema_1.deleteUserSchema), userController.deleteUser);
exports.default = router;
