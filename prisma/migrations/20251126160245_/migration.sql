-- CreateTable
CREATE TABLE "public"."ClinicalNotes" (
    "cn_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "appointment_id" INTEGER,
    "visit_id" INTEGER NOT NULL,
    "location_id" INTEGER,
    "doctor_id" TEXT NOT NULL,
    "editor_notes" TEXT,
    "transcription" TEXT,
    "audio_url" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "ClinicalNotes_pkey" PRIMARY KEY ("cn_id")
);

-- CreateIndex
CREATE INDEX "ClinicalNotes_patient_id_idx" ON "public"."ClinicalNotes"("patient_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_appointment_id_idx" ON "public"."ClinicalNotes"("appointment_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_visit_id_idx" ON "public"."ClinicalNotes"("visit_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_doctor_id_idx" ON "public"."ClinicalNotes"("doctor_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_location_id_idx" ON "public"."ClinicalNotes"("location_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_status_idx" ON "public"."ClinicalNotes"("status");

-- AddForeignKey
ALTER TABLE "public"."ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
