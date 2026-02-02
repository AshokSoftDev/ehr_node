"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const errors_1 = require("../../../utils/errors");
const location_service_1 = require("./location.service");
class LocationController {
    constructor() {
        this.service = new location_service_1.LocationService();
        this.list = (0, errors_1.catchAsync)(async (req, res) => {
            const filters = {
                search: req.query.search,
            };
            const data = await this.service.list(filters);
            res.status(200).json({ status: 'success', data });
        });
        this.create = (0, errors_1.catchAsync)(async (req, res) => {
            const data = await this.service.create(req.body, req.user?.userId || 'system');
            res.status(201).json({ status: 'success', data });
        });
        this.update = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const data = await this.service.update(Number(id), req.body, req.user?.userId || 'system');
            res.status(200).json({ status: 'success', data });
        });
        this.remove = (0, errors_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const data = await this.service.remove(Number(id), req.user?.userId || 'system');
            res.status(200).json({ status: 'success', message: 'Location removed', data });
        });
    }
}
exports.LocationController = LocationController;
