import type { Request, Response, NextFunction } from 'express';
import { billingService } from './billing.service';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceFiltersSchema,
  createReceiptSchema,
  updateReceiptSchema,
  receiptFiltersSchema,
  idParamSchema,
  visitIdParamSchema,
} from './billing.schema';

export const billingController = {
  // Invoice Controllers
  async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createInvoiceSchema.parse(req.body);
      const createdBy = req.user?.userId;
      const invoice = await billingService.createInvoice(validated, createdBy);
      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  },

  async getInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const invoice = await billingService.getInvoice(id);
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },

  async listInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = invoiceFiltersSchema.parse(req.query);
      const result = await billingService.listInvoices(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = updateInvoiceSchema.parse(req.body);
      const updatedBy = req.user?.userId;
      const invoice = await billingService.updateInvoice(id, validated, updatedBy);
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },

  async deleteInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deletedBy = req.user?.userId;
      await billingService.deleteInvoice(id, deletedBy);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getVisitPrescriptionsForInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { visitId } = visitIdParamSchema.parse(req.params);
      const items = await billingService.getVisitPrescriptionsForInvoice(visitId);
      res.json(items);
    } catch (error) {
      next(error);
    }
  },

  // Receipt Controllers
  async createReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createReceiptSchema.parse(req.body);
      const createdBy = req.user?.userId;
      const receipt = await billingService.createReceipt(validated, createdBy);
      res.status(201).json(receipt);
    } catch (error) {
      next(error);
    }
  },

  async getReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const receipt = await billingService.getReceipt(id);
      res.json(receipt);
    } catch (error) {
      next(error);
    }
  },

  async listReceipts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = receiptFiltersSchema.parse(req.query);
      const result = await billingService.listReceipts(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = updateReceiptSchema.parse(req.body);
      const updatedBy = req.user?.userId;
      const receipt = await billingService.updateReceipt(id, validated, updatedBy);
      res.json(receipt);
    } catch (error) {
      next(error);
    }
  },

  async deleteReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deletedBy = req.user?.userId;
      await billingService.deleteReceipt(id, deletedBy);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

