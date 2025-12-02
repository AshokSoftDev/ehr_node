/*
  Warnings:

  - The primary key for the `PatientAllergy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `allergyId` on the `PatientAllergy` table. All the data in the column will be lost.
  - You are about to drop the column `allergyName` on the `PatientAllergy` table. All the data in the column will be lost.
  - You are about to drop the column `pa_id` on the `PatientAllergy` table. All the data in the column will be lost.
  - You are about to drop the `PatientEmergency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `allergy_id` to the `PatientAllergy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PatientAllergy" DROP CONSTRAINT "PatientAllergy_allergyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientEmergency" DROP CONSTRAINT "PatientEmergency_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientInfo" DROP CONSTRAINT "PatientInfo_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientInfo" DROP CONSTRAINT "PatientInfo_primaryDoctorId_fkey";

-- DropIndex
DROP INDEX "public"."PatientAllergy_allergyId_idx";

-- AlterTable
ALTER TABLE "public"."PatientAllergy" DROP CONSTRAINT "PatientAllergy_pkey",
DROP COLUMN "allergyId",
DROP COLUMN "allergyName",
DROP COLUMN "pa_id",
ADD COLUMN     "allergy_id" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD CONSTRAINT "PatientAllergy_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."PatientEmergency";

-- DropTable
DROP TABLE "public"."PatientInfo";

-- CreateTable
CREATE TABLE "public"."Location" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "public"."Drug" (
    "drug_id" SERIAL NOT NULL,
    "drug_generic" TEXT NOT NULL,
    "drug_name" TEXT NOT NULL,
    "drug_type" TEXT NOT NULL,
    "drug_dosage" TEXT NOT NULL,
    "drug_measure" TEXT NOT NULL,
    "instruction" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("drug_id")
);

-- CreateTable
CREATE TABLE "public"."Visit" (
    "visit_id" SERIAL NOT NULL,
    "appointment_id" INTEGER,
    "patient_id" INTEGER NOT NULL,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "location_id" INTEGER,
    "doctor_id" TEXT NOT NULL,
    "visit_type" TEXT NOT NULL,
    "reason_for_visit" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("visit_id")
);

-- CreateIndex
CREATE INDEX "Location_status_idx" ON "public"."Location"("status");

-- CreateIndex
CREATE INDEX "Location_active_idx" ON "public"."Location"("active");

-- CreateIndex
CREATE INDEX "Location_createdAt_idx" ON "public"."Location"("createdAt");

-- CreateIndex
CREATE INDEX "Location_deletedAt_idx" ON "public"."Location"("deletedAt");

-- CreateIndex
CREATE INDEX "Drug_status_idx" ON "public"."Drug"("status");

-- CreateIndex
CREATE INDEX "Drug_createdAt_idx" ON "public"."Drug"("createdAt");

-- CreateIndex
CREATE INDEX "Drug_deletedAt_idx" ON "public"."Drug"("deletedAt");

-- CreateIndex
CREATE INDEX "Visit_appointment_id_idx" ON "public"."Visit"("appointment_id");

-- CreateIndex
CREATE INDEX "Visit_patient_id_idx" ON "public"."Visit"("patient_id");

-- CreateIndex
CREATE INDEX "Visit_location_id_idx" ON "public"."Visit"("location_id");

-- CreateIndex
CREATE INDEX "Visit_doctor_id_idx" ON "public"."Visit"("doctor_id");

-- CreateIndex
CREATE INDEX "Visit_visit_date_idx" ON "public"."Visit"("visit_date");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "public"."Visit"("status");

-- CreateIndex
CREATE INDEX "PatientAllergy_allergy_id_idx" ON "public"."PatientAllergy"("allergy_id");

-- CreateIndex
CREATE INDEX "PatientAllergy_createdAt_idx" ON "public"."PatientAllergy"("createdAt");

-- CreateIndex
CREATE INDEX "PatientAllergy_deletedAt_idx" ON "public"."PatientAllergy"("deletedAt");

-- AddForeignKey
ALTER TABLE "public"."PatientAllergy" ADD CONSTRAINT "PatientAllergy_allergy_id_fkey" FOREIGN KEY ("allergy_id") REFERENCES "public"."Allergy"("allergy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
