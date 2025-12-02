# Schema Reference (Prisma)

Located in `prisma/schema/*.prisma` merged to `prisma/schema.prisma`.

## Core
- `User(userId, email, password, title, fullName, firstName, lastName, phoneNumber?, groupId?, userStatus, createdAt, createdBy?, updatedAt, updatedBy?)`
- `Group(id, name, description?, createdAt, createdBy?, updatedAt, updatedBy?)`
- `Module(id, name, description?, createdAt, updatedAt)`
- `SubModule(id, moduleId, name, description?)`
- `GroupModulePermission(id, groupId, moduleId, hasAccess)`
- `GroupSubModulePermission(id, groupId, subModuleId, allowed, groupModulePermissionId?)`

## Doctors
- `Doctor(id UUID, title, firstName, lastName, dob, email unique, licenceNo unique, degree, specialty, timeBlock?, displayName, displayColor, address?, area?, city?, state?, country?, pincode?, status, created/updated/deleted audit)`

## Patients
- `Patient(patient_id, mrn unique, title, firstName, lastName, dateOfBirth?, age?, gender, mobileNumber, address, area, city, state, country, pincode, aadhar?, referalSource?, comments?, activeStatus, createdBy, updatedBy, createdAt, updatedAt)`
- `PatientAllergy(id, patient_id FK, allergy_id FK, notes?, status, created/updated/deleted audit)`
- `Appointment(appointment_id, patient_id FK, doctor_id FK, appointment_date, start_time, end_time, duration?, appointment_type, reason_for_visit?, appointment_status, notes?, snapshot patient_*/doctor_* fields, status, created/updated/deleted audit)`

## Master
- `Insurance(i_id, type, company, policy, policyNo, validationFrom, validationTo, notes?, status, created/updated/deleted audit)`
- `Allergy(allergy_id, allergyName, allergyType, status, created/updated/deleted audit)`
- `Location(location_id, location_name, address?, city, state, status, active, created/updated/deleted audit)`
- `Drug(drug_id, drug_generic, drug_name, drug_type, drug_dosage, drug_measure, instruction?, status, created/updated/deleted audit)`

## Visits
- `Visit(visit_id, appointment_id, visit_date, location_id?, doctor_id, visit_type, reason_for_visit?, status, created/updated/deleted audit)`
