"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = require("./group.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const group_schema_1 = require("./group.schema");
const router = (0, express_1.Router)();
const groupController = new group_controller_1.GroupController();
router.use(auth_middleware_1.authenticate);
// router.use(authenticate, requireModule('Group Management')); 
router.get('/modules', groupController.getModules);
router.post('/', (0, validate_middleware_1.validate)(group_schema_1.createGroupSchema), groupController.createGroup);
router.get('/', 
// validate(listGroupsSchema),
groupController.listGroups);
router.get('/:id', (0, validate_middleware_1.validate)(group_schema_1.getGroupSchema), groupController.getGroup);
router.put('/:id', (0, validate_middleware_1.validate)(group_schema_1.updateGroupSchema), groupController.updateGroup);
router.delete('/:id', (0, validate_middleware_1.validate)(group_schema_1.deleteGroupSchema), groupController.deleteGroup);
exports.default = router;
