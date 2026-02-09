-- AlterTable
ALTER TABLE "public"."ClinicalNotes" ADD COLUMN     "ai_notes" TEXT,
ADD COLUMN     "ai_notes_retry_count" INTEGER NOT NULL DEFAULT 0;
