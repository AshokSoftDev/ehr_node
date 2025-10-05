-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "licenceNo" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "timeBlock" TEXT,
    "displayName" TEXT NOT NULL,
    "displayColor" TEXT NOT NULL,
    "address" TEXT,
    "area" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "public"."Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenceNo_key" ON "public"."Doctor"("licenceNo");

-- CreateIndex
CREATE INDEX "Doctor_email_idx" ON "public"."Doctor"("email");

-- CreateIndex
CREATE INDEX "Doctor_licenceNo_idx" ON "public"."Doctor"("licenceNo");

-- CreateIndex
CREATE INDEX "Doctor_specialty_idx" ON "public"."Doctor"("specialty");

-- CreateIndex
CREATE INDEX "Doctor_status_idx" ON "public"."Doctor"("status");

-- CreateIndex
CREATE INDEX "Doctor_createdAt_idx" ON "public"."Doctor"("createdAt");

-- CreateIndex
CREATE INDEX "Doctor_deletedAt_idx" ON "public"."Doctor"("deletedAt");
