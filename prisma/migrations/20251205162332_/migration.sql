-- CreateTable
CREATE TABLE "public"."Prescription" (
    "prescription_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "appointment_id" INTEGER,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" TEXT,
    "drug_id" INTEGER,
    "drug_name" TEXT NOT NULL,
    "drug_generic" TEXT,
    "drug_type" TEXT,
    "drug_dosage" TEXT,
    "drug_measure" TEXT,
    "instruction" TEXT,
    "duration" INTEGER,
    "duration_type" TEXT,
    "quantity" INTEGER,
    "morning_bf" BOOLEAN NOT NULL DEFAULT false,
    "morning_af" BOOLEAN NOT NULL DEFAULT false,
    "noon_bf" BOOLEAN NOT NULL DEFAULT false,
    "noon_af" BOOLEAN NOT NULL DEFAULT false,
    "evening_bf" BOOLEAN NOT NULL DEFAULT false,
    "evening_af" BOOLEAN NOT NULL DEFAULT false,
    "night_bf" BOOLEAN NOT NULL DEFAULT false,
    "night_af" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "public"."PrescriptionTemplate" (
    "temp_id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "template_name" TEXT NOT NULL,
    "drug_id" INTEGER,
    "drug_name" TEXT NOT NULL,
    "drug_generic" TEXT,
    "drug_type" TEXT,
    "drug_dosage" TEXT,
    "drug_measure" TEXT,
    "instruction" TEXT,
    "duration" INTEGER,
    "duration_type" TEXT,
    "quantity" INTEGER,
    "morning_bf" BOOLEAN NOT NULL DEFAULT false,
    "morning_af" BOOLEAN NOT NULL DEFAULT false,
    "noon_bf" BOOLEAN NOT NULL DEFAULT false,
    "noon_af" BOOLEAN NOT NULL DEFAULT false,
    "evening_bf" BOOLEAN NOT NULL DEFAULT false,
    "evening_af" BOOLEAN NOT NULL DEFAULT false,
    "night_bf" BOOLEAN NOT NULL DEFAULT false,
    "night_af" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PrescriptionTemplate_pkey" PRIMARY KEY ("temp_id")
);

-- CreateIndex
CREATE INDEX "Prescription_visit_id_idx" ON "public"."Prescription"("visit_id");

-- CreateIndex
CREATE INDEX "Prescription_appointment_id_idx" ON "public"."Prescription"("appointment_id");

-- CreateIndex
CREATE INDEX "Prescription_patient_id_idx" ON "public"."Prescription"("patient_id");

-- CreateIndex
CREATE INDEX "Prescription_doctor_id_idx" ON "public"."Prescription"("doctor_id");

-- CreateIndex
CREATE INDEX "Prescription_drug_id_idx" ON "public"."Prescription"("drug_id");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "public"."Prescription"("status");

-- CreateIndex
CREATE INDEX "PrescriptionTemplate_template_id_idx" ON "public"."PrescriptionTemplate"("template_id");

-- CreateIndex
CREATE INDEX "PrescriptionTemplate_drug_id_idx" ON "public"."PrescriptionTemplate"("drug_id");

-- CreateIndex
CREATE INDEX "PrescriptionTemplate_status_idx" ON "public"."PrescriptionTemplate"("status");

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "public"."Drug"("drug_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrescriptionTemplate" ADD CONSTRAINT "PrescriptionTemplate_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "public"."Drug"("drug_id") ON DELETE SET NULL ON UPDATE CASCADE;
