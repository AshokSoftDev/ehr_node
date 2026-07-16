-- CreateTable
CREATE TABLE "MasterAppointmentType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "color_code" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "MasterAppointmentType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterAppointmentType_code_key" ON "MasterAppointmentType"("code");

-- CreateIndex
CREATE INDEX "MasterAppointmentType_status_idx" ON "MasterAppointmentType"("status");

-- CreateIndex
CREATE INDEX "MasterAppointmentType_createdAt_idx" ON "MasterAppointmentType"("createdAt");

-- CreateIndex
CREATE INDEX "MasterAppointmentType_deletedAt_idx" ON "MasterAppointmentType"("deletedAt");
