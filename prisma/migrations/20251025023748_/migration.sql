-- CreateTable
CREATE TABLE "public"."Appointment" (
    "appointment_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "appointment_type" TEXT NOT NULL,
    "reason_for_visit" TEXT,
    "appointment_status" TEXT NOT NULL,
    "notes" TEXT,
    "patient_mrn" TEXT NOT NULL,
    "patient_title" TEXT NOT NULL,
    "patient_firstName" TEXT NOT NULL,
    "patient_lastName" TEXT NOT NULL,
    "doctor_title" TEXT NOT NULL,
    "doctor_firstName" TEXT NOT NULL,
    "doctor_lastName" TEXT NOT NULL,
    "doctor_specialty" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateIndex
CREATE INDEX "Appointment_patient_id_idx" ON "public"."Appointment"("patient_id");

-- CreateIndex
CREATE INDEX "Appointment_doctor_id_idx" ON "public"."Appointment"("doctor_id");

-- CreateIndex
CREATE INDEX "Appointment_appointment_date_idx" ON "public"."Appointment"("appointment_date");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "public"."Appointment"("status");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
