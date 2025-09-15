-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "accountType" TEXT NOT NULL DEFAULT 'child',
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "User_parentId_idx" ON "public"."User"("parentId");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "public"."User"("accountType");

-- CreateIndex
CREATE INDEX "User_createdBy_idx" ON "public"."User"("createdBy");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
