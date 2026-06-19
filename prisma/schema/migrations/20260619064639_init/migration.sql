-- CreateTable
CREATE TABLE "Appointment" (
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

-- CreateTable
CREATE TABLE "Invoice" (
    "invoice_id" SERIAL NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "gross_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_type" TEXT NOT NULL DEFAULT 'percentage',
    "discount_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "net_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "coupon_code" TEXT,
    "coupon_discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_reason" TEXT,
    "invoice_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "item_id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "item_type" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "reference_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "premium" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_type" TEXT NOT NULL DEFAULT 'percentage',
    "discount_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax_applicable" BOOLEAN NOT NULL DEFAULT false,
    "net_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "assigned_user" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "receipt_id" SERIAL NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateTable
CREATE TABLE "Doctor" (
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

-- CreateTable
CREATE TABLE "Insurance" (
    "i_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "policy" TEXT NOT NULL,
    "policyNo" TEXT NOT NULL,
    "validationFrom" TIMESTAMP(3) NOT NULL,
    "validationTo" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("i_id")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "allergy_id" SERIAL NOT NULL,
    "allergyName" TEXT NOT NULL,
    "allergyType" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("allergy_id")
);

-- CreateTable
CREATE TABLE "Location" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "drug_id" SERIAL NOT NULL,
    "drug_generic" TEXT NOT NULL,
    "drug_name" TEXT NOT NULL,
    "drug_type" TEXT NOT NULL,
    "drug_dosage" TEXT NOT NULL,
    "drug_measure" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "instruction" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("drug_id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
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

-- CreateTable
CREATE TABLE "Patient" (
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

-- CreateTable
CREATE TABLE "PatientAllergy" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "allergy_id" INTEGER,
    "allergyName" TEXT NOT NULL,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientAllergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientInfo" (
    "pi_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "bloodGroup" TEXT,
    "overseas" BOOLEAN,
    "passportNumber" TEXT,
    "validityDate" TIMESTAMP(3),
    "occupation" TEXT,
    "department" TEXT,
    "companyName" TEXT,
    "designation" TEXT,
    "employeeCode" TEXT,
    "primaryDoctorId" TEXT,
    "activeStatus" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientInfo_pkey" PRIMARY KEY ("pi_id")
);

-- CreateTable
CREATE TABLE "PatientEmergency" (
    "pe_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PatientEmergency_pkey" PRIMARY KEY ("pe_id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "groupId" TEXT,
    "password" TEXT NOT NULL,
    "parentId" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'child',
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
CREATE TABLE "Group" (
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
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubModule" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SubModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupModulePermission" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GroupModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupSubModulePermission" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "subModuleId" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "groupModulePermissionId" TEXT,

    CONSTRAINT "GroupSubModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "visit_id" SERIAL NOT NULL,
    "appointment_id" INTEGER,
    "patient_id" INTEGER NOT NULL,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "location_id" INTEGER,
    "doctor_id" TEXT NOT NULL,
    "visit_type" TEXT NOT NULL,
    "reason_for_visit" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "DentalHPI" (
    "hpi_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" TEXT,
    "dentition_type" TEXT NOT NULL,
    "teeth_surfaces" JSONB NOT NULL,
    "chief_complaints" JSONB NOT NULL,
    "severity" TEXT,
    "duration_years" INTEGER NOT NULL DEFAULT 0,
    "duration_months" INTEGER NOT NULL DEFAULT 0,
    "duration_weeks" INTEGER NOT NULL DEFAULT 0,
    "duration_days" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "DentalHPI_pkey" PRIMARY KEY ("hpi_id")
);

-- CreateTable
CREATE TABLE "VisitDocument" (
    "document_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "document_type_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "ClinicalNotes" (
    "cn_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "appointment_id" INTEGER,
    "visit_id" INTEGER NOT NULL,
    "location_id" INTEGER,
    "doctor_id" TEXT NOT NULL,
    "notes_type" TEXT NOT NULL DEFAULT 'text',
    "editor_notes" TEXT,
    "transcription" TEXT,
    "audio_url" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "ai_notes" TEXT,
    "ai_notes_retry_count" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "ClinicalNotes_pkey" PRIMARY KEY ("cn_id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "prescription_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "appointment_id" INTEGER,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" TEXT,
    "drug_id" INTEGER,
    "drug_name" TEXT NOT NULL,
    "drug_generic" TEXT,
    "drug_type" TEXT,
    "drug_dosage" TEXT,
    "drug_measure" TEXT,
    "instruction" TEXT,
    "duration" INTEGER,
    "duration_type" TEXT,
    "quantity" INTEGER,
    "morning_bf" BOOLEAN NOT NULL DEFAULT false,
    "morning_af" BOOLEAN NOT NULL DEFAULT false,
    "noon_bf" BOOLEAN NOT NULL DEFAULT false,
    "noon_af" BOOLEAN NOT NULL DEFAULT false,
    "evening_bf" BOOLEAN NOT NULL DEFAULT false,
    "evening_af" BOOLEAN NOT NULL DEFAULT false,
    "night_bf" BOOLEAN NOT NULL DEFAULT false,
    "night_af" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "PrescriptionTemplate" (
    "temp_id" SERIAL NOT NULL,
    "template_id" BIGINT NOT NULL,
    "template_name" TEXT NOT NULL,
    "drug_id" INTEGER,
    "drug_name" TEXT NOT NULL,
    "drug_generic" TEXT,
    "drug_type" TEXT,
    "drug_dosage" TEXT,
    "drug_measure" TEXT,
    "instruction" TEXT,
    "duration" INTEGER,
    "duration_type" TEXT,
    "quantity" INTEGER,
    "morning_bf" BOOLEAN NOT NULL DEFAULT false,
    "morning_af" BOOLEAN NOT NULL DEFAULT false,
    "noon_bf" BOOLEAN NOT NULL DEFAULT false,
    "noon_af" BOOLEAN NOT NULL DEFAULT false,
    "evening_bf" BOOLEAN NOT NULL DEFAULT false,
    "evening_af" BOOLEAN NOT NULL DEFAULT false,
    "night_bf" BOOLEAN NOT NULL DEFAULT false,
    "night_af" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PrescriptionTemplate_pkey" PRIMARY KEY ("temp_id")
);

-- CreateIndex
CREATE INDEX "Appointment_patient_id_idx" ON "Appointment"("patient_id");

-- CreateIndex
CREATE INDEX "Appointment_doctor_id_idx" ON "Appointment"("doctor_id");

-- CreateIndex
CREATE INDEX "Appointment_appointment_date_idx" ON "Appointment"("appointment_date");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_number_key" ON "Invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "Invoice_patient_id_idx" ON "Invoice"("patient_id");

-- CreateIndex
CREATE INDEX "Invoice_visit_id_idx" ON "Invoice"("visit_id");

-- CreateIndex
CREATE INDEX "Invoice_invoice_number_idx" ON "Invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_invoice_date_idx" ON "Invoice"("invoice_date");

-- CreateIndex
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_idx" ON "Invoice"("deletedAt");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoice_id_idx" ON "InvoiceItem"("invoice_id");

-- CreateIndex
CREATE INDEX "InvoiceItem_item_type_idx" ON "InvoiceItem"("item_type");

-- CreateIndex
CREATE INDEX "InvoiceItem_reference_id_idx" ON "InvoiceItem"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receipt_number_key" ON "Receipt"("receipt_number");

-- CreateIndex
CREATE INDEX "Receipt_invoice_id_idx" ON "Receipt"("invoice_id");

-- CreateIndex
CREATE INDEX "Receipt_patient_id_idx" ON "Receipt"("patient_id");

-- CreateIndex
CREATE INDEX "Receipt_receipt_number_idx" ON "Receipt"("receipt_number");

-- CreateIndex
CREATE INDEX "Receipt_status_idx" ON "Receipt"("status");

-- CreateIndex
CREATE INDEX "Receipt_payment_date_idx" ON "Receipt"("payment_date");

-- CreateIndex
CREATE INDEX "Receipt_createdAt_idx" ON "Receipt"("createdAt");

-- CreateIndex
CREATE INDEX "Receipt_deletedAt_idx" ON "Receipt"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenceNo_key" ON "Doctor"("licenceNo");

-- CreateIndex
CREATE INDEX "Doctor_email_idx" ON "Doctor"("email");

-- CreateIndex
CREATE INDEX "Doctor_licenceNo_idx" ON "Doctor"("licenceNo");

-- CreateIndex
CREATE INDEX "Doctor_specialty_idx" ON "Doctor"("specialty");

-- CreateIndex
CREATE INDEX "Doctor_status_idx" ON "Doctor"("status");

-- CreateIndex
CREATE INDEX "Doctor_createdAt_idx" ON "Doctor"("createdAt");

-- CreateIndex
CREATE INDEX "Doctor_deletedAt_idx" ON "Doctor"("deletedAt");

-- CreateIndex
CREATE INDEX "Insurance_status_idx" ON "Insurance"("status");

-- CreateIndex
CREATE INDEX "Insurance_createdAt_idx" ON "Insurance"("createdAt");

-- CreateIndex
CREATE INDEX "Insurance_deletedAt_idx" ON "Insurance"("deletedAt");

-- CreateIndex
CREATE INDEX "Allergy_status_idx" ON "Allergy"("status");

-- CreateIndex
CREATE INDEX "Allergy_createdAt_idx" ON "Allergy"("createdAt");

-- CreateIndex
CREATE INDEX "Allergy_deletedAt_idx" ON "Allergy"("deletedAt");

-- CreateIndex
CREATE INDEX "Location_status_idx" ON "Location"("status");

-- CreateIndex
CREATE INDEX "Location_active_idx" ON "Location"("active");

-- CreateIndex
CREATE INDEX "Location_createdAt_idx" ON "Location"("createdAt");

-- CreateIndex
CREATE INDEX "Location_deletedAt_idx" ON "Location"("deletedAt");

-- CreateIndex
CREATE INDEX "Drug_status_idx" ON "Drug"("status");

-- CreateIndex
CREATE INDEX "Drug_createdAt_idx" ON "Drug"("createdAt");

-- CreateIndex
CREATE INDEX "Drug_deletedAt_idx" ON "Drug"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_type_name_key" ON "DocumentType"("type_name");

-- CreateIndex
CREATE INDEX "DocumentType_status_idx" ON "DocumentType"("status");

-- CreateIndex
CREATE INDEX "DocumentType_createdAt_idx" ON "DocumentType"("createdAt");

-- CreateIndex
CREATE INDEX "DocumentType_deletedAt_idx" ON "DocumentType"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mrn_key" ON "Patient"("mrn");

-- CreateIndex
CREATE INDEX "PatientAllergy_patient_id_idx" ON "PatientAllergy"("patient_id");

-- CreateIndex
CREATE INDEX "PatientAllergy_allergy_id_idx" ON "PatientAllergy"("allergy_id");

-- CreateIndex
CREATE INDEX "PatientAllergy_status_idx" ON "PatientAllergy"("status");

-- CreateIndex
CREATE INDEX "PatientAllergy_createdAt_idx" ON "PatientAllergy"("createdAt");

-- CreateIndex
CREATE INDEX "PatientAllergy_deletedAt_idx" ON "PatientAllergy"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PatientInfo_patient_id_key" ON "PatientInfo"("patient_id");

-- CreateIndex
CREATE INDEX "PatientInfo_patient_id_idx" ON "PatientInfo"("patient_id");

-- CreateIndex
CREATE INDEX "PatientInfo_primaryDoctorId_idx" ON "PatientInfo"("primaryDoctorId");

-- CreateIndex
CREATE INDEX "PatientInfo_activeStatus_idx" ON "PatientInfo"("activeStatus");

-- CreateIndex
CREATE INDEX "PatientEmergency_patient_id_idx" ON "PatientEmergency"("patient_id");

-- CreateIndex
CREATE INDEX "PatientEmergency_status_idx" ON "PatientEmergency"("status");

-- CreateIndex
CREATE INDEX "PatientEmergency_createdAt_idx" ON "PatientEmergency"("createdAt");

-- CreateIndex
CREATE INDEX "PatientEmergency_deletedAt_idx" ON "PatientEmergency"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_groupId_idx" ON "User"("groupId");

-- CreateIndex
CREATE INDEX "User_userStatus_idx" ON "User"("userStatus");

-- CreateIndex
CREATE INDEX "User_parentId_idx" ON "User"("parentId");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "User"("accountType");

-- CreateIndex
CREATE INDEX "User_createdBy_idx" ON "User"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_moduleId_name_key" ON "SubModule"("moduleId", "name");

-- CreateIndex
CREATE INDEX "GroupModulePermission_groupId_idx" ON "GroupModulePermission"("groupId");

-- CreateIndex
CREATE INDEX "GroupModulePermission_moduleId_idx" ON "GroupModulePermission"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupModulePermission_groupId_moduleId_key" ON "GroupModulePermission"("groupId", "moduleId");

-- CreateIndex
CREATE INDEX "GroupSubModulePermission_groupId_idx" ON "GroupSubModulePermission"("groupId");

-- CreateIndex
CREATE INDEX "GroupSubModulePermission_subModuleId_idx" ON "GroupSubModulePermission"("subModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupSubModulePermission_groupId_subModuleId_key" ON "GroupSubModulePermission"("groupId", "subModuleId");

-- CreateIndex
CREATE INDEX "Visit_appointment_id_idx" ON "Visit"("appointment_id");

-- CreateIndex
CREATE INDEX "Visit_patient_id_idx" ON "Visit"("patient_id");

-- CreateIndex
CREATE INDEX "Visit_location_id_idx" ON "Visit"("location_id");

-- CreateIndex
CREATE INDEX "Visit_doctor_id_idx" ON "Visit"("doctor_id");

-- CreateIndex
CREATE INDEX "Visit_visit_date_idx" ON "Visit"("visit_date");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- CreateIndex
CREATE INDEX "DentalHPI_visit_id_idx" ON "DentalHPI"("visit_id");

-- CreateIndex
CREATE INDEX "DentalHPI_patient_id_idx" ON "DentalHPI"("patient_id");

-- CreateIndex
CREATE INDEX "DentalHPI_doctor_id_idx" ON "DentalHPI"("doctor_id");

-- CreateIndex
CREATE INDEX "DentalHPI_status_idx" ON "DentalHPI"("status");

-- CreateIndex
CREATE INDEX "VisitDocument_visit_id_idx" ON "VisitDocument"("visit_id");

-- CreateIndex
CREATE INDEX "VisitDocument_patient_id_idx" ON "VisitDocument"("patient_id");

-- CreateIndex
CREATE INDEX "VisitDocument_document_type_id_idx" ON "VisitDocument"("document_type_id");

-- CreateIndex
CREATE INDEX "VisitDocument_status_idx" ON "VisitDocument"("status");

-- CreateIndex
CREATE INDEX "ClinicalNotes_patient_id_idx" ON "ClinicalNotes"("patient_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_appointment_id_idx" ON "ClinicalNotes"("appointment_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_visit_id_idx" ON "ClinicalNotes"("visit_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_doctor_id_idx" ON "ClinicalNotes"("doctor_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_location_id_idx" ON "ClinicalNotes"("location_id");

-- CreateIndex
CREATE INDEX "ClinicalNotes_status_idx" ON "ClinicalNotes"("status");

-- CreateIndex
CREATE INDEX "Prescription_visit_id_idx" ON "Prescription"("visit_id");

-- CreateIndex
CREATE INDEX "Prescription_appointment_id_idx" ON "Prescription"("appointment_id");

-- CreateIndex
CREATE INDEX "Prescription_patient_id_idx" ON "Prescription"("patient_id");

-- CreateIndex
CREATE INDEX "Prescription_doctor_id_idx" ON "Prescription"("doctor_id");

-- CreateIndex
CREATE INDEX "Prescription_drug_id_idx" ON "Prescription"("drug_id");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE INDEX "PrescriptionTemplate_template_id_idx" ON "PrescriptionTemplate"("template_id");

-- CreateIndex
CREATE INDEX "PrescriptionTemplate_drug_id_idx" ON "PrescriptionTemplate"("drug_id");

-- CreateIndex
CREATE INDEX "PrescriptionTemplate_status_idx" ON "PrescriptionTemplate"("status");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("invoice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAllergy" ADD CONSTRAINT "PatientAllergy_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAllergy" ADD CONSTRAINT "PatientAllergy_allergy_id_fkey" FOREIGN KEY ("allergy_id") REFERENCES "Allergy"("allergy_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInfo" ADD CONSTRAINT "PatientInfo_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInfo" ADD CONSTRAINT "PatientInfo_primaryDoctorId_fkey" FOREIGN KEY ("primaryDoctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEmergency" ADD CONSTRAINT "PatientEmergency_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModule" ADD CONSTRAINT "SubModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupModulePermission" ADD CONSTRAINT "GroupModulePermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupModulePermission" ADD CONSTRAINT "GroupModulePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSubModulePermission" ADD CONSTRAINT "GroupSubModulePermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSubModulePermission" ADD CONSTRAINT "GroupSubModulePermission_subModuleId_fkey" FOREIGN KEY ("subModuleId") REFERENCES "SubModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSubModulePermission" ADD CONSTRAINT "GroupSubModulePermission_groupModulePermissionId_fkey" FOREIGN KEY ("groupModulePermissionId") REFERENCES "GroupModulePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalHPI" ADD CONSTRAINT "DentalHPI_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalHPI" ADD CONSTRAINT "DentalHPI_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalHPI" ADD CONSTRAINT "DentalHPI_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitDocument" ADD CONSTRAINT "VisitDocument_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitDocument" ADD CONSTRAINT "VisitDocument_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitDocument" ADD CONSTRAINT "VisitDocument_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "DocumentType"("document_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNotes" ADD CONSTRAINT "ClinicalNotes_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "Drug"("drug_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionTemplate" ADD CONSTRAINT "PrescriptionTemplate_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "Drug"("drug_id") ON DELETE SET NULL ON UPDATE CASCADE;
