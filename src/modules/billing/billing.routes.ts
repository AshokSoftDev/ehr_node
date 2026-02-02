import { Router } from 'express';
import { billingController } from './billing.controller';

const router = Router();

// Invoice routes
router.post('/invoices', billingController.createInvoice);
router.get('/invoices', billingController.listInvoices);
router.get('/invoices/:id', billingController.getInvoice);
router.put('/invoices/:id', billingController.updateInvoice);
router.delete('/invoices/:id', billingController.deleteInvoice);

// Visit prescriptions for invoice
router.get('/visits/:visitId/prescriptions-for-invoice', billingController.getVisitPrescriptionsForInvoice);

// Receipt routes
router.post('/receipts', billingController.createReceipt);
router.get('/receipts', billingController.listReceipts);
router.get('/receipts/:id', billingController.getReceipt);
router.put('/receipts/:id', billingController.updateReceipt);
router.delete('/receipts/:id', billingController.deleteReceipt);

export default router;
