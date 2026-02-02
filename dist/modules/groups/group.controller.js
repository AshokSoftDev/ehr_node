"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const group_service_1 = require("./group.service");
class GroupController {
    constructor() {
        this.createGroup = async (req, res) => {
            try {
                const userId = req.user?.userId; // Get from auth middleware
                const group = await this.groupService.createGroup(req.body, userId);
                res.status(201).json({
                    status: 'success',
                    message: 'Group created successfully',
                    data: group,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to create group',
                });
            }
        };
        this.updateGroup = async (req, res) => {
            try {
                const userId = req.user?.userId;
                const { id } = req.params;
                const group = await this.groupService.updateGroup(id, req.body, userId);
                res.status(200).json({
                    status: 'success',
                    message: 'Group updated successfully',
                    data: group,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to update group',
                });
            }
        };
        this.deleteGroup = async (req, res) => {
            try {
                const { id } = req.params;
                await this.groupService.deleteGroup(id);
                res.status(200).json({
                    status: 'success',
                    message: 'Group deleted successfully',
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to delete group',
                });
            }
        };
        this.getGroup = async (req, res) => {
            try {
                const { id } = req.params;
                const group = await this.groupService.getGroupById(id);
                res.status(200).json({
                    status: 'success',
                    data: group,
                });
            }
            catch (error) {
                res.status(404).json({
                    status: 'error',
                    message: error.message || 'Group not found',
                });
            }
        };
        this.listGroups = async (req, res) => {
            try {
                const search = req.query.search;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                const result = await this.groupService.listGroups({
                    search,
                    page: page || 1,
                    limit: limit || 10,
                });
                res.status(200).json({
                    status: 'success',
                    data: result,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to fetch groups',
                });
            }
        };
        this.getModules = async (req, res) => {
            try {
                const modules = await this.groupService.getAllModules();
                res.status(200).json({
                    status: 'success',
                    data: modules,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to fetch modules',
                });
            }
        };
        this.groupService = new group_service_1.GroupService();
    }
}
exports.GroupController = GroupController;
