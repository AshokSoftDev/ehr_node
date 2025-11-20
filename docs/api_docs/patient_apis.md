# Patient APIs

Base Path: `/api/v1/patients`

## Core Patients
- POST `/`
  - Body: `{ title, firstName, lastName, gender, mobileNumber, address, area, city, state, country, pincode, dateOfBirth? | age?, aadhar?, referalSource?, comments? }`
  - Returns: `Patient`
- GET `/`
  - Query: `search?`, `page?`, `limit?`
  - Returns: `{ patients, total, page, totalPages }`
- GET `/:id`
  - Returns: `Patient`
- PUT `/:id`
  - Body: partial update, `activeStatus?`
  - Returns: updated `Patient`
- DELETE `/:id`
  - Soft delete → updated `Patient`

Files: `src/modules/patients/patient.routes.ts`, controller/service/repository in same folder.

## Patient Info
- GET `/:id/info` → `{ status, data: PatientInfo }`
- POST `/:id/info` → `{ status, data: PatientInfo }`
  - Body: `{ bloodGroup, overseas, passportNumber?, validityDate?, occupation?, department?, companyName?, designation?, employeeCode?, primaryDoctorId? }`
- PUT `/:id/info` → `{ status, data: PatientInfo }`

Files: `src/modules/patients/info/*`

## Patient Emergency
- GET `/:id/emergency` → `{ status, data: PatientEmergency[] }`
- GET `/:id/emergency/:peId` → `{ status, data: PatientEmergency }`
- POST `/:id/emergency` → `{ status, data: PatientEmergency }`
  - Body: `{ name, relation, contactNumber, status? }`
- PUT `/:id/emergency/:peId` → `{ status, data: PatientEmergency }`
- DELETE `/:id/emergency/:peId` → `{ status, message, data }`

Files: `src/modules/patients/emergency/*`

## Patient Allergies
- GET `/:id/allergies` → `{ status, data: PatientAllergy[] }` (query `search?`)
- POST `/:id/allergies` → `{ status, data: PatientAllergy }`
  - Body: `{ allergyName, allergyId?, status? }`
- PUT `/:id/allergies/:paId` → `{ status, data: PatientAllergy }`
- DELETE `/:id/allergies/:paId` → `{ status, message, data }`

Files: `src/modules/patients/allergy/*`
