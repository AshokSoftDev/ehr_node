-- CreateTable
CREATE TABLE "public"."Invoice" (
    "invoice_id" SERIAL NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "gross_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_type" TEXT NOT NULL DEFAULT 'percentage',
    "discount_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "net_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "coupon_code" TEXT,
    "discount_reason" TEXT,
    "invoice_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "public"."InvoiceItem" (
    "item_id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "item_type" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "reference_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "premium" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_type" TEXT NOT NULL DEFAULT 'percentage',
    "discount_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax_applicable" BOOLEAN NOT NULL DEFAULT false,
    "net_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "assigned_user" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "public"."Receipt" (
    "receipt_id" SERIAL NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_number_key" ON "public"."Invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "Invoice_patient_id_idx" ON "public"."Invoice"("patient_id");

-- CreateIndex
CREATE INDEX "Invoice_visit_id_idx" ON "public"."Invoice"("visit_id");

-- CreateIndex
CREATE INDEX "Invoice_invoice_number_idx" ON "public"."Invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "public"."Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_invoice_date_idx" ON "public"."Invoice"("invoice_date");

-- CreateIndex
CREATE INDEX "Invoice_createdAt_idx" ON "public"."Invoice"("createdAt");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_idx" ON "public"."Invoice"("deletedAt");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoice_id_idx" ON "public"."InvoiceItem"("invoice_id");

-- CreateIndex
CREATE INDEX "InvoiceItem_item_type_idx" ON "public"."InvoiceItem"("item_type");

-- CreateIndex
CREATE INDEX "InvoiceItem_reference_id_idx" ON "public"."InvoiceItem"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receipt_number_key" ON "public"."Receipt"("receipt_number");

-- CreateIndex
CREATE INDEX "Receipt_invoice_id_idx" ON "public"."Receipt"("invoice_id");

-- CreateIndex
CREATE INDEX "Receipt_patient_id_idx" ON "public"."Receipt"("patient_id");

-- CreateIndex
CREATE INDEX "Receipt_receipt_number_idx" ON "public"."Receipt"("receipt_number");

-- CreateIndex
CREATE INDEX "Receipt_status_idx" ON "public"."Receipt"("status");

-- CreateIndex
CREATE INDEX "Receipt_payment_date_idx" ON "public"."Receipt"("payment_date");

-- CreateIndex
CREATE INDEX "Receipt_createdAt_idx" ON "public"."Receipt"("createdAt");

-- CreateIndex
CREATE INDEX "Receipt_deletedAt_idx" ON "public"."Receipt"("deletedAt");

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("invoice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Receipt" ADD CONSTRAINT "Receipt_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Receipt" ADD CONSTRAINT "Receipt_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
