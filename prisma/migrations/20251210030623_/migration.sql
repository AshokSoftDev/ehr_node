-- CreateTable
CREATE TABLE "public"."DentalHPI" (
    "hpi_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" TEXT,
    "dentition_type" TEXT NOT NULL,
    "teeth_surfaces" JSONB NOT NULL,
    "chief_complaints" JSONB NOT NULL,
    "severity" TEXT,
    "duration_years" INTEGER NOT NULL DEFAULT 0,
    "duration_months" INTEGER NOT NULL DEFAULT 0,
    "duration_weeks" INTEGER NOT NULL DEFAULT 0,
    "duration_days" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "DentalHPI_pkey" PRIMARY KEY ("hpi_id")
);

-- CreateIndex
CREATE INDEX "DentalHPI_visit_id_idx" ON "public"."DentalHPI"("visit_id");

-- CreateIndex
CREATE INDEX "DentalHPI_patient_id_idx" ON "public"."DentalHPI"("patient_id");

-- CreateIndex
CREATE INDEX "DentalHPI_doctor_id_idx" ON "public"."DentalHPI"("doctor_id");

-- CreateIndex
CREATE INDEX "DentalHPI_status_idx" ON "public"."DentalHPI"("status");

-- AddForeignKey
ALTER TABLE "public"."DentalHPI" ADD CONSTRAINT "DentalHPI_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DentalHPI" ADD CONSTRAINT "DentalHPI_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DentalHPI" ADD CONSTRAINT "DentalHPI_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
