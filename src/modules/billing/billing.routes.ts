import { Router } from 'express';
import { billingController } from './billing.controller';

const router = Router();

// Invoice routes
router.post('/invoices', billingController.createInvoice);
router.get('/invoices', billingController.listInvoices);
router.get('/invoices/:id', billingController.getInvoice);
router.put('/invoices/:id', billingController.updateInvoice);
router.delete('/invoices/:id', billingController.deleteInvoice);

// Pending invoices for a patient
router.get('/invoices/patient/:patientId/pending', billingController.getPatientPendingInvoices);

// Visit prescriptions for invoice
router.get('/visits/:visitId/prescriptions-for-invoice', billingController.getVisitPrescriptionsForInvoice);

// Consolidated billing visits
router.get('/visits', billingController.listBillingVisits);

// Receipt routes
router.post('/receipts', billingController.createReceipt);
router.get('/receipts', billingController.listReceipts);
router.get('/receipts/:id', billingController.getReceipt);
router.put('/receipts/:id', billingController.updateReceipt);
router.delete('/receipts/:id', billingController.deleteReceipt);

// Advance / Wallet routes
router.post('/advance', billingController.depositAdvance);
router.get('/advance/balance/:patientId', billingController.getAdvanceBalance);
router.get('/advance/ledger/:patientId', billingController.getAdvanceLedger);

// Payment routes (partial payments from invoice page)
router.post('/payments', billingController.createPayment);
router.get('/payments/invoice/:invoiceId', billingController.getInvoicePayments);

export default router;
