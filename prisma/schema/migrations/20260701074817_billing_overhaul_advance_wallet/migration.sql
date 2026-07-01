-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_visit_id_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_invoice_id_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "balance_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "paid_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "visit_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "receipt_type" TEXT NOT NULL DEFAULT 'payment',
ALTER COLUMN "invoice_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PatientAdvance" (
    "advance_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "reference_type" TEXT,
    "reference_id" INTEGER,
    "payment_method" TEXT,
    "receipt_id" INTEGER,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientAdvance_pkey" PRIMARY KEY ("advance_id")
);

-- CreateIndex
CREATE INDEX "PatientAdvance_patient_id_idx" ON "PatientAdvance"("patient_id");

-- CreateIndex
CREATE INDEX "PatientAdvance_transaction_type_idx" ON "PatientAdvance"("transaction_type");

-- CreateIndex
CREATE INDEX "PatientAdvance_status_idx" ON "PatientAdvance"("status");

-- CreateIndex
CREATE INDEX "PatientAdvance_createdAt_idx" ON "PatientAdvance"("createdAt");

-- CreateIndex
CREATE INDEX "PatientAdvance_deletedAt_idx" ON "PatientAdvance"("deletedAt");

-- CreateIndex
CREATE INDEX "Receipt_receipt_type_idx" ON "Receipt"("receipt_type");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("invoice_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAdvance" ADD CONSTRAINT "PatientAdvance_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
