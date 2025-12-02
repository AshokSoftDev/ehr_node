# Backend Overview

- Base URL: `/api/v1`
- Tech: Node.js, Express, TypeScript, Prisma (PostgreSQL)
- Structure: modular by feature with validation, services, repositories, and controllers per module.

## Modules
- Auth & Users: registration, login, user CRUD with access control.
- Patients: core CRUD + submodules: Info, Emergency Contacts, Allergies.
- Master Data: Insurance, Allergy, Location (catalog) under `/master`.
- Doctors: CRUD for provider directory.
- RBAC: Groups, Modules, SubModules, and permissions (internal use).

## Routing
- Mounts in `src/routes/index.ts`
  - `/users` → `src/modules/users/user.routes.ts`
  - `/doctors` → `src/modules/doctors/doctor.routes.ts`
  - `/patients` → `src/modules/patients/patient.routes.ts`
  - `/master` → `src/modules/master/master.routes.ts`

## Validation & Middleware
- Request validation via Zod in `src/middleware/validate.middleware.ts`.
- Auth via JWT in `src/middleware/auth.middleware.ts` (Bearer token).
- Security & CORS in `src/app.ts` (helmet, cors).
- Errors: `src/middleware/error.middleware.ts`.

## Database
- Prisma schema pieces under `prisma/schema/*.prisma` merged by `scripts/merge-prisma-schemas.js` into `prisma/schema.prisma`.
- Generate client: `npm run prisma:generate`
- Migrate dev DB: `npm run prisma:migrate`
- After creating or changing Prisma schema, run `npm run prisma:generate` followed by `npm run prisma:migrate`.
- Latest migrations have already been run manually; rerun only after new schema changes.
- When adding new models/relations, ensure both sides of Prisma relations exist (back-reference fields) to avoid schema validation errors before generating/migrating.

## Key Paths
- App entry: `src/app.ts`, `src/server.ts`
- Prisma client: `src/utils/prisma.ts`

### Detailed Docs
- [Auth APIs](./api_docs/auth_apis.md)
- [User APIs](./api_docs/user_apis.md)
- [Patient APIs](./api_docs/patient_apis.md)
- [Common APIs](./api_docs/common_apis.md)
- [Schema Reference](./schema_reference.md)
- [Environment Variables](./env_reference.md)
- [Middlewares](./middleware_overview.md)
- [Deployment Guide](./deployment_guide.md)
