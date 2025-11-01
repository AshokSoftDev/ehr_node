# Patients API – Technical Summary

Base URL
- `/api/v1`

Auth
- Header: `Authorization: Bearer <token>` (recommended; some patient endpoints may work without but audit fields will fallback to `system`).

Notes on responses
- Core patient endpoints return raw objects.
- Patient Info/Emergency/Allergy endpoints return `{ status: "success", data: ... }` and sometimes a `message` on delete.

Files (entry routes)
- `src/modules/patients/patient.routes.ts`

---

## Patient (core)
- POST `/patients`
  - Body: `{ title, firstName, lastName, gender, mobileNumber, address, area, city, state, country, pincode, dateOfBirth? | age?, aadhar?, referalSource?, comments? }`
  - Returns: `Patient` object
  - Files: controller `src/modules/patients/patient.controller.ts`, schema `src/modules/patients/patient.schema.ts`, service `src/modules/patients/patient.service.ts`, repository `src/modules/patients/patient.repository.ts`

- GET `/patients`
  - Query: `search?`, `page?`, `limit?`
  - Returns: `{ patients: Patient[], total, page, totalPages }`
  - Files: controller `src/modules/patients/patient.controller.ts`, schema `src/modules/patients/patient.schema.ts`

- GET `/patients/:id`
  - Params: `id` (number)
  - Returns: `Patient` object
  - Files: controller `src/modules/patients/patient.controller.ts`, schema `src/modules/patients/patient.schema.ts`

- PUT `/patients/:id`
  - Params: `id`
  - Body: any subset of create fields; `activeStatus?`
  - Returns: updated `Patient`
  - Files: controller `src/modules/patients/patient.controller.ts`, schema `src/modules/patients/patient.schema.ts`

- DELETE `/patients/:id`
  - Params: `id`
  - Action: soft delete (`activeStatus` → 0)
  - Returns: updated `Patient`
  - Files: controller `src/modules/patients/patient.controller.ts`, schema `src/modules/patients/patient.schema.ts`

---

## Patient Info
- GET `/patients/:id/info`
  - Params: `id`
  - Returns: `{ status, data: PatientInfo }`
  - Files: controller `src/modules/patients/info/patientInfo.controller.ts`, schema `src/modules/patients/info/patientInfo.schema.ts`, service `src/modules/patients/info/patientInfo.service.ts`, repository `src/modules/patients/info/patientInfo.repository.ts`

- POST `/patients/:id/info`
  - Params: `id`
  - Body: `{ bloodGroup (string), overseas (boolean), passportNumber?, validityDate?, occupation?, department?, companyName?, designation?, employeeCode?, primaryDoctorId? }`
  - Returns: `{ status, data: PatientInfo }`
  - Files: same as above

- PUT `/patients/:id/info`
  - Params: `id`
  - Body: any subset of POST body; at least one field required
  - Returns: `{ status, data: PatientInfo }`
  - Files: same as above

Model hints
- `validityDate` accepts ISO string or JS `Date`.
- `primaryDoctorId` must be UUID when provided.

---

## Patient Emergency Contacts
- GET `/patients/:id/emergency`
  - Params: `id`
  - Returns: `{ status, data: PatientEmergency[] }`
  - Files: controller `src/modules/patients/emergency/patientEmergency.controller.ts`, schema `src/modules/patients/emergency/patientEmergency.schema.ts`, service `src/modules/patients/emergency/patientEmergency.service.ts`, repository `src/modules/patients/emergency/patientEmergency.repository.ts`

- GET `/patients/:id/emergency/:peId`
  - Params: `id`, `peId`
  - Returns: `{ status, data: PatientEmergency }`
  - Files: same as above

- POST `/patients/:id/emergency`
  - Params: `id`
  - Body: `{ name (string), relation (string), contactNumber (10 digit string), status? }`
  - Returns: `{ status, data: PatientEmergency }`
  - Files: same as above

- PUT `/patients/:id/emergency/:peId`
  - Params: `id`, `peId`
  - Body: any subset of POST body
  - Returns: `{ status, data: PatientEmergency }`
  - Files: same as above

- DELETE `/patients/:id/emergency/:peId`
  - Params: `id`, `peId`
  - Action: soft delete (`status` → 0, sets `deletedAt/By`)
  - Returns: `{ status, message: 'Emergency contact removed', data: PatientEmergency }`
  - Files: same as above

---

## Patient Allergies
- GET `/patients/:id/allergies`
  - Params: `id`
  - Query: `search?` (filters by `allergyName`, case-insensitive)
  - Returns: `{ status, data: PatientAllergy[] }`
  - Files: controller `src/modules/patients/allergy/patientAllergy.controller.ts`, schema `src/modules/patients/allergy/patientAllergy.schema.ts`, service `src/modules/patients/allergy/patientAllergy.service.ts`, repository `src/modules/patients/allergy/patientAllergy.repository.ts`

- POST `/patients/:id/allergies`
  - Params: `id`
  - Body: `{ allergyName (string), allergyId? (number), status? }`
  - Returns: `{ status, data: PatientAllergy }`
  - Files: same as above

- PUT `/patients/:id/allergies/:paId`
  - Params: `id`, `paId`
  - Body: any subset of POST body
  - Returns: `{ status, data: PatientAllergy }`
  - Files: same as above

- DELETE `/patients/:id/allergies/:paId`
  - Params: `id`, `paId`
  - Action: soft delete (`status` → 0, sets `deletedAt/By`)
  - Returns: `{ status, message: 'Patient allergy removed', data: PatientAllergy }`
  - Files: same as above

---

Status codes (typical)
- 200 OK: successful fetch/update/delete
- 201 Created: successful create
- 400 Bad Request: validation errors
- 404 Not Found: missing patient/record
- 401/403: if auth is enforced and token is invalid/insufficient

Data models (keys commonly returned)
- Patient: `patient_id, mrn, title, firstName, lastName, dateOfBirth?, age?, gender, mobileNumber, address, area, city, state, country, pincode, aadhar?, referalSource?, comments?, activeStatus, createdAt, createdBy, updatedAt, updatedBy`
- PatientInfo: `pi_id, patient_id, bloodGroup, overseas, passportNumber?, validityDate?, occupation?, department?, companyName?, designation?, employeeCode?, primaryDoctorId?, activeStatus, createdAt, createdBy, updatedAt, updatedBy`
- PatientEmergency: `pe_id, patient_id, name, relation, contactNumber, status, createdAt, createdBy?, updatedAt, updatedBy?, deletedAt?, deletedBy?`
- PatientAllergy: `pa_id, patient_id, allergyId?, allergyName, status, createdAt, createdBy?, updatedAt, updatedBy?, deletedAt?, deletedBy?`
