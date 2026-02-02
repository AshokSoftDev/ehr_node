"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billing_controller_1 = require("./billing.controller");
const router = (0, express_1.Router)();
// Invoice routes
router.post('/invoices', billing_controller_1.billingController.createInvoice);
router.get('/invoices', billing_controller_1.billingController.listInvoices);
router.get('/invoices/:id', billing_controller_1.billingController.getInvoice);
router.put('/invoices/:id', billing_controller_1.billingController.updateInvoice);
router.delete('/invoices/:id', billing_controller_1.billingController.deleteInvoice);
// Visit prescriptions for invoice
router.get('/visits/:visitId/prescriptions-for-invoice', billing_controller_1.billingController.getVisitPrescriptionsForInvoice);
// Receipt routes
router.post('/receipts', billing_controller_1.billingController.createReceipt);
router.get('/receipts', billing_controller_1.billingController.listReceipts);
router.get('/receipts/:id', billing_controller_1.billingController.getReceipt);
router.put('/receipts/:id', billing_controller_1.billingController.updateReceipt);
router.delete('/receipts/:id', billing_controller_1.billingController.deleteReceipt);
exports.default = router;
