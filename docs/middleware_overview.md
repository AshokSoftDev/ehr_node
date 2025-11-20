# Middleware Overview

## Authentication
- File: `src/middleware/auth.middleware.ts`
- `authenticate` extracts Bearer token, verifies via `utils/jwt.ts`, attaches `req.user` or throws 401.
- `requireRole(...roles)` optional role guard returning 403 on insufficient permissions.

## Validation
- File: `src/middleware/validate.middleware.ts`
- `validate(schema)` parses `{ body, query, params }` using Zod schemas.
- Reassigns `req.body/query/params` with validated values.
- Helpers: `validateQuery`, `validateBody`, `validateParams`.

## Error Handling
- File: `src/middleware/error.middleware.ts`
- `errorHandler` sends `{ message }` with appropriate status.
- `notFound` returns 404 for unknown routes.

## Security & CORS
- File: `src/app.ts`
- `helmet()` for security headers.
- `cors()` configured for allowed origins, credentials, methods, and headers.
