"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const errors_1 = require("../../utils/errors");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.register = (0, errors_1.catchAsync)(async (req, res) => {
            const result = await this.userService.register(req.body);
            res.status(201).json({
                status: 'success',
                data: result,
            });
        });
        this.registerWithAuth = (0, errors_1.catchAsync)(async (req, res) => {
            const result = await this.userService.register(req.body, req.user);
            res.status(201).json({
                status: 'success',
                data: result,
            });
        });
        this.login = (0, errors_1.catchAsync)(async (req, res) => {
            const result = await this.userService.login(req.body);
            res.json({
                status: 'success',
                data: result,
            });
        });
        this.getUser = (0, errors_1.catchAsync)(async (req, res) => {
            const user = await this.userService.getUser(req.params.userId, req.user);
            res.json({
                status: 'success',
                data: user,
            });
        });
        this.updateUser = (0, errors_1.catchAsync)(async (req, res) => {
            const user = await this.userService.updateUser(req.params.userId, req.body, req.user);
            res.json({
                status: 'success',
                data: user,
            });
        });
        this.deleteUser = (0, errors_1.catchAsync)(async (req, res) => {
            await this.userService.deleteUser(req.params.userId, req.user);
            res.status(204).send();
        });
        this.listUsers = (0, errors_1.catchAsync)(async (req, res) => {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await this.userService.listUsers(filters, Number(page), Number(limit), req.user);
            res.json({
                status: 'success',
                data: result,
            });
        });
    }
}
exports.UserController = UserController;
