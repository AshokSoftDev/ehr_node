-- CreateTable
CREATE TABLE "public"."User" (
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "groupId" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "userStatus" INTEGER NOT NULL DEFAULT 1,
    "dob" TIMESTAMP(3),
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Module" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubModule" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SubModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupModulePermission" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GroupModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupSubModulePermission" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "subModuleId" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "groupModulePermissionId" TEXT,

    CONSTRAINT "GroupSubModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_groupId_idx" ON "public"."User"("groupId");

-- CreateIndex
CREATE INDEX "User_userStatus_idx" ON "public"."User"("userStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "public"."Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "public"."Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_moduleId_name_key" ON "public"."SubModule"("moduleId", "name");

-- CreateIndex
CREATE INDEX "GroupModulePermission_groupId_idx" ON "public"."GroupModulePermission"("groupId");

-- CreateIndex
CREATE INDEX "GroupModulePermission_moduleId_idx" ON "public"."GroupModulePermission"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupModulePermission_groupId_moduleId_key" ON "public"."GroupModulePermission"("groupId", "moduleId");

-- CreateIndex
CREATE INDEX "GroupSubModulePermission_groupId_idx" ON "public"."GroupSubModulePermission"("groupId");

-- CreateIndex
CREATE INDEX "GroupSubModulePermission_subModuleId_idx" ON "public"."GroupSubModulePermission"("subModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupSubModulePermission_groupId_subModuleId_key" ON "public"."GroupSubModulePermission"("groupId", "subModuleId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubModule" ADD CONSTRAINT "SubModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupModulePermission" ADD CONSTRAINT "GroupModulePermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupModulePermission" ADD CONSTRAINT "GroupModulePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupSubModulePermission" ADD CONSTRAINT "GroupSubModulePermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupSubModulePermission" ADD CONSTRAINT "GroupSubModulePermission_subModuleId_fkey" FOREIGN KEY ("subModuleId") REFERENCES "public"."SubModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupSubModulePermission" ADD CONSTRAINT "GroupSubModulePermission_groupModulePermissionId_fkey" FOREIGN KEY ("groupModulePermissionId") REFERENCES "public"."GroupModulePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
