-- CreateTable
CREATE TABLE "PatientVital" (
    "vital_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "visit_id" INTEGER,
    "vital_date" TIMESTAMP(3) NOT NULL,
    "vital_time" TEXT,
    "weight" DECIMAL(65,30),
    "weight_unit" TEXT NOT NULL DEFAULT 'kg',
    "height" DECIMAL(65,30),
    "height_unit" TEXT NOT NULL DEFAULT 'cm',
    "bmi" DECIMAL(65,30),
    "temperature" DECIMAL(65,30),
    "temperature_unit" TEXT NOT NULL DEFAULT 'celsius',
    "pulse" INTEGER,
    "rr" INTEGER,
    "bp_systolic" INTEGER,
    "bp_diastolic" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientVital_pkey" PRIMARY KEY ("vital_id")
);

-- CreateIndex
CREATE INDEX "PatientVital_patient_id_idx" ON "PatientVital"("patient_id");

-- CreateIndex
CREATE INDEX "PatientVital_visit_id_idx" ON "PatientVital"("visit_id");

-- CreateIndex
CREATE INDEX "PatientVital_status_idx" ON "PatientVital"("status");

-- AddForeignKey
ALTER TABLE "PatientVital" ADD CONSTRAINT "PatientVital_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientVital" ADD CONSTRAINT "PatientVital_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE SET NULL ON UPDATE CASCADE;
