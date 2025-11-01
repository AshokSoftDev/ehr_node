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
- `PatientInfo(pi_id, patient_id FK, bloodGroup, overseas, passportNumber?, validityDate?, occupation?, department?, companyName?, designation?, employeeCode?, primaryDoctorId?, activeStatus, created/updated audit)`
- `PatientEmergency(pe_id, patient_id FK, name, relation, contactNumber, status, created/updated/deleted audit)`
- `PatientAllergy(pa_id, patient_id FK, allergyId? FK, allergyName, status, created/updated/deleted audit)`

## Master
- `Insurance(i_id, type, company, policy, policyNo, validationFrom, validationTo, notes?, status, created/updated/deleted audit)`
- `Allergy(allergy_id, allergyName, allergyType, status, created/updated/deleted audit)`
