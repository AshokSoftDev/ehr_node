"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingController = void 0;
const billing_service_1 = require("./billing.service");
const billing_schema_1 = require("./billing.schema");
exports.billingController = {
    // Invoice Controllers
    async createInvoice(req, res, next) {
        try {
            const validated = billing_schema_1.createInvoiceSchema.parse(req.body);
            const createdBy = req.user?.userId;
            const invoice = await billing_service_1.billingService.createInvoice(validated, createdBy);
            res.status(201).json(invoice);
        }
        catch (error) {
            next(error);
        }
    },
    async getInvoice(req, res, next) {
        try {
            const { id } = billing_schema_1.idParamSchema.parse(req.params);
            const invoice = await billing_service_1.billingService.getInvoice(id);
            res.json(invoice);
        }
        catch (error) {
            next(error);
        }
    },
    async listInvoices(req, res, next) {
        try {
            const filters = billing_schema_1.invoiceFiltersSchema.parse(req.query);
            const result = await billing_service_1.billingService.listInvoices(filters);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async updateInvoice(req, res, next) {
        try {
            const { id } = billing_schema_1.idParamSchema.parse(req.params);
            const validated = billing_schema_1.updateInvoiceSchema.parse(req.body);
            const updatedBy = req.user?.userId;
            const invoice = await billing_service_1.billingService.updateInvoice(id, validated, updatedBy);
            res.json(invoice);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteInvoice(req, res, next) {
        try {
            const { id } = billing_schema_1.idParamSchema.parse(req.params);
            const deletedBy = req.user?.userId;
            await billing_service_1.billingService.deleteInvoice(id, deletedBy);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    },
    async getVisitPrescriptionsForInvoice(req, res, next) {
        try {
            const { visitId } = billing_schema_1.visitIdParamSchema.parse(req.params);
            const items = await billing_service_1.billingService.getVisitPrescriptionsForInvoice(visitId);
            res.json(items);
        }
        catch (error) {
            next(error);
        }
    },
    // Receipt Controllers
    async createReceipt(req, res, next) {
        try {
            const validated = billing_schema_1.createReceiptSchema.parse(req.body);
            const createdBy = req.user?.userId;
            const receipt = await billing_service_1.billingService.createReceipt(validated, createdBy);
            res.status(201).json(receipt);
        }
        catch (error) {
            next(error);
        }
    },
    async getReceipt(req, res, next) {
        try {
            const { id } = billing_schema_1.idParamSchema.parse(req.params);
            const receipt = await billing_service_1.billingService.getReceipt(id);
            res.json(receipt);
        }
        catch (error) {
            next(error);
        }
    },
    async listReceipts(req, res, next) {
        try {
            const filters = billing_schema_1.receiptFiltersSchema.parse(req.query);
            const result = await billing_service_1.billingService.listReceipts(filters);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async updateReceipt(req, res, next) {
        try {
            const { id } = billing_schema_1.idParamSchema.parse(req.params);
            const validated = billing_schema_1.updateReceiptSchema.parse(req.body);
            const updatedBy = req.user?.userId;
            const receipt = await billing_service_1.billingService.updateReceipt(id, validated, updatedBy);
            res.json(receipt);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteReceipt(req, res, next) {
        try {
            const { id } = billing_schema_1.idParamSchema.parse(req.params);
            const deletedBy = req.user?.userId;
            await billing_service_1.billingService.deleteReceipt(id, deletedBy);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    },
};
