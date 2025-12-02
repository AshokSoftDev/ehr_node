-- DropForeignKey
ALTER TABLE "public"."PatientAllergy" DROP CONSTRAINT "PatientAllergy_allergy_id_fkey";

-- AlterTable
ALTER TABLE "public"."PatientAllergy" ALTER COLUMN "allergyName" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."PatientAllergy" ADD CONSTRAINT "PatientAllergy_allergy_id_fkey" FOREIGN KEY ("allergy_id") REFERENCES "public"."Allergy"("allergy_id") ON DELETE SET NULL ON UPDATE CASCADE;
