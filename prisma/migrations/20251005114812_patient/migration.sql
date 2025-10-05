-- CreateTable
CREATE TABLE "public"."Patient" (
    "patient_id" SERIAL NOT NULL,
    "mrn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "age" INTEGER,
    "gender" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "aadhar" TEXT,
    "referalSource" TEXT,
    "comments" TEXT,
    "activeStatus" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mrn_key" ON "public"."Patient"("mrn");
