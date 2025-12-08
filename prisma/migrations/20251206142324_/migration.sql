/*
  Warnings:

  - You are about to drop the column `file_type` on the `VisitDocument` table. All the data in the column will be lost.
  - Added the required column `document_type_id` to the `VisitDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_name` to the `VisitDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VisitDocument" DROP COLUMN "file_type",
ADD COLUMN     "document_type_id" INTEGER NOT NULL,
ADD COLUMN     "type_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."DocumentType" (
    "document_type_id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("document_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_type_name_key" ON "public"."DocumentType"("type_name");

-- CreateIndex
CREATE INDEX "DocumentType_status_idx" ON "public"."DocumentType"("status");

-- CreateIndex
CREATE INDEX "DocumentType_createdAt_idx" ON "public"."DocumentType"("createdAt");

-- CreateIndex
CREATE INDEX "DocumentType_deletedAt_idx" ON "public"."DocumentType"("deletedAt");

-- CreateIndex
CREATE INDEX "VisitDocument_document_type_id_idx" ON "public"."VisitDocument"("document_type_id");

-- AddForeignKey
ALTER TABLE "public"."VisitDocument" ADD CONSTRAINT "VisitDocument_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "public"."DocumentType"("document_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
