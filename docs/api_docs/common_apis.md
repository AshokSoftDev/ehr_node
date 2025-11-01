# Common & Master APIs

## Health
- GET `/api/v1/health`
- Returns: `{ status: 'OK', timestamp, environment }`
- File: `src/app.ts`

## Master: Insurance
- Base: `/api/v1/master/insurance` (auth required)
- GET `/` → list with search: `{ status, data: Insurance[] }`
- POST `/` → create: `{ status, data: Insurance }`
- PUT `/:id` → update: `{ status, data: Insurance }`
- DELETE `/:id` → soft delete: `{ status, message, data: Insurance }`
- Files: `src/modules/master/insurance/*`, router: `src/modules/master/master.routes.ts`

## Master: Allergy (catalog)
- Base: `/api/v1/master/allergy` (auth required)
- GET `/` → list with search: `{ status, data: Allergy[] }`
- POST `/` → create: `{ status, data: Allergy }`
- PUT `/:id` → update: `{ status, data: Allergy }`
- DELETE `/:id` → soft delete: `{ status, message, data: Allergy }`
- Files: `src/modules/master/allergy/*`, router: `src/modules/master/master.routes.ts`
