-- Add notes_type to ClinicalNotes
ALTER TABLE "public"."ClinicalNotes"
ADD COLUMN     "notes_type" TEXT NOT NULL DEFAULT 'text';

-- Add allergyName and allow null allergy_id for PatientAllergy
ALTER TABLE "public"."PatientAllergy"
ADD COLUMN     "allergyName" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "allergy_id" DROP NOT NULL;

-- Create PatientInfo table
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
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientInfo_pkey" PRIMARY KEY ("pi_id")
);

-- Ensure one info row per patient
CREATE UNIQUE INDEX "PatientInfo_patient_id_key" ON "public"."PatientInfo"("patient_id");

-- Create PatientEmergency table
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

-- Indexes
CREATE INDEX "PatientInfo_patient_id_idx" ON "public"."PatientInfo"("patient_id");
CREATE INDEX "PatientInfo_primaryDoctorId_idx" ON "public"."PatientInfo"("primaryDoctorId");
CREATE INDEX "PatientInfo_activeStatus_idx" ON "public"."PatientInfo"("activeStatus");

CREATE INDEX "PatientEmergency_patient_id_idx" ON "public"."PatientEmergency"("patient_id");
CREATE INDEX "PatientEmergency_status_idx" ON "public"."PatientEmergency"("status");
CREATE INDEX "PatientEmergency_createdAt_idx" ON "public"."PatientEmergency"("createdAt");
CREATE INDEX "PatientEmergency_deletedAt_idx" ON "public"."PatientEmergency"("deletedAt");

-- Foreign keys
ALTER TABLE "public"."PatientInfo"
ADD CONSTRAINT "PatientInfo_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."PatientInfo"
ADD CONSTRAINT "PatientInfo_primaryDoctorId_fkey" FOREIGN KEY ("primaryDoctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."PatientEmergency"
ADD CONSTRAINT "PatientEmergency_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
