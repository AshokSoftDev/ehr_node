-- AlterTable
ALTER TABLE "public"."PrescriptionTemplate" ALTER COLUMN "template_id" SET DATA TYPE BIGINT;

-- CreateTable
CREATE TABLE "public"."VisitDocument" (
    "document_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "description" TEXT,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "VisitDocument_pkey" PRIMARY KEY ("document_id")
);

-- CreateIndex
CREATE INDEX "VisitDocument_visit_id_idx" ON "public"."VisitDocument"("visit_id");

-- CreateIndex
CREATE INDEX "VisitDocument_patient_id_idx" ON "public"."VisitDocument"("patient_id");

-- CreateIndex
CREATE INDEX "VisitDocument_status_idx" ON "public"."VisitDocument"("status");

-- AddForeignKey
ALTER TABLE "public"."VisitDocument" ADD CONSTRAINT "VisitDocument_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VisitDocument" ADD CONSTRAINT "VisitDocument_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
