# Common & Master APIs

## Health
- GET `/api/v1/health`
- Returns: `{ status: 'OK', timestamp, environment }`
- File: `src/app.ts`

## Master: Insurance
- Base: `/api/v1/master/insurance` (auth required)
- GET `/` – list with optional `search`: `{ status, data: Insurance[] }`
- POST `/` – create: `{ status, data: Insurance }`
- PUT `/:id` – update: `{ status, data: Insurance }`
- DELETE `/:id` – soft delete: `{ status, message, data: Insurance }`
- Files: `src/modules/master/insurance/*`, router: `src/modules/master/master.routes.ts`

## Master: Allergy (catalog)
- Base: `/api/v1/master/allergy` (auth required)
- GET `/` – list with optional `search`: `{ status, data: Allergy[] }`
- POST `/` – create: `{ status, data: Allergy }`
- PUT `/:id` – update: `{ status, data: Allergy }`
- DELETE `/:id` – soft delete: `{ status, message, data: Allergy }`
- Files: `src/modules/master/allergy/*`, router: `src/modules/master/master.routes.ts`

## Master: Location
- Base: `/api/v1/master/location` (auth required)
- GET `/` – list with optional `search` (matches `location_name`, `city`, or `state`, case-insensitive): `{ status, data: Location[] }`
- POST `/` – create: `{ status, data: Location }`
- PUT `/:id` – update: `{ status, data: Location }`
- DELETE `/:id` – soft delete (`status` → 0, sets `deletedAt/By`): `{ status, message, data: Location }`
- Files: `src/modules/master/location/*`, router: `src/modules/master/master.routes.ts`

## Master: Drug
- Base: `/api/v1/master/drug` (auth required)
- GET `/` – list with optional `search` (matches `drug_generic` or `drug_name`, case-insensitive): `{ status, data: Drug[] }`
- POST `/` – create: `{ status, data: Drug }`
- PUT `/:id` – update: `{ status, data: Drug }`
- DELETE `/:id` – soft delete (`status` → 0, sets `deletedAt/By`): `{ status, message, data: Drug }`
- Files: `src/modules/master/drug/*`, router: `src/modules/master/master.routes.ts`
