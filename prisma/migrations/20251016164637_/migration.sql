-- CreateTable
CREATE TABLE "public"."Insurance" (
    "i_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "policy" TEXT NOT NULL,
    "policyNo" TEXT NOT NULL,
    "validationFrom" TIMESTAMP(3) NOT NULL,
    "validationTo" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("i_id")
);

-- CreateTable
CREATE TABLE "public"."Allergy" (
    "allergy_id" SERIAL NOT NULL,
    "allergyName" TEXT NOT NULL,
    "allergyType" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("allergy_id")
);

-- CreateTable
CREATE TABLE "public"."PatientInfo" (
    "pi_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "overseas" BOOLEAN NOT NULL,
    "passportNumber" TEXT,
    "validityDate" TIMESTAMP(3),
    "occupation" TEXT,
    "department" TEXT,
    "companyName" TEXT,
    "designation" TEXT,
    "employeeCode" TEXT,
    "primaryDoctorId" TEXT,
    "activeStatus" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "PatientInfo_pkey" PRIMARY KEY ("pi_id")
);

-- CreateTable
CREATE TABLE "public"."PatientEmergency" (
    "pe_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientEmergency_pkey" PRIMARY KEY ("pe_id")
);

-- CreateTable
CREATE TABLE "public"."PatientAllergy" (
    "pa_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "allergyId" INTEGER,
    "allergyName" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientAllergy_pkey" PRIMARY KEY ("pa_id")
);

-- CreateIndex
CREATE INDEX "Insurance_status_idx" ON "public"."Insurance"("status");

-- CreateIndex
CREATE INDEX "Insurance_createdAt_idx" ON "public"."Insurance"("createdAt");

-- CreateIndex
CREATE INDEX "Insurance_deletedAt_idx" ON "public"."Insurance"("deletedAt");

-- CreateIndex
CREATE INDEX "Allergy_status_idx" ON "public"."Allergy"("status");

-- CreateIndex
CREATE INDEX "Allergy_createdAt_idx" ON "public"."Allergy"("createdAt");

-- CreateIndex
CREATE INDEX "Allergy_deletedAt_idx" ON "public"."Allergy"("deletedAt");

-- CreateIndex
CREATE INDEX "PatientInfo_patient_id_idx" ON "public"."PatientInfo"("patient_id");

-- CreateIndex
CREATE INDEX "PatientInfo_primaryDoctorId_idx" ON "public"."PatientInfo"("primaryDoctorId");

-- CreateIndex
CREATE INDEX "PatientEmergency_patient_id_idx" ON "public"."PatientEmergency"("patient_id");

-- CreateIndex
CREATE INDEX "PatientAllergy_patient_id_idx" ON "public"."PatientAllergy"("patient_id");

-- CreateIndex
CREATE INDEX "PatientAllergy_allergyId_idx" ON "public"."PatientAllergy"("allergyId");

-- CreateIndex
CREATE INDEX "PatientAllergy_status_idx" ON "public"."PatientAllergy"("status");

-- AddForeignKey
ALTER TABLE "public"."PatientInfo" ADD CONSTRAINT "PatientInfo_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientInfo" ADD CONSTRAINT "PatientInfo_primaryDoctorId_fkey" FOREIGN KEY ("primaryDoctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientEmergency" ADD CONSTRAINT "PatientEmergency_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientAllergy" ADD CONSTRAINT "PatientAllergy_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientAllergy" ADD CONSTRAINT "PatientAllergy_allergyId_fkey" FOREIGN KEY ("allergyId") REFERENCES "public"."Allergy"("allergy_id") ON DELETE SET NULL ON UPDATE CASCADE;
