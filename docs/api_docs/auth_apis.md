# Auth APIs

Base Path: `/api/v1/users`

## POST `/register`
- Body: `{ title, fullName, firstName, lastName, email, phoneNumber?, groupId?, password }`
- Returns: `{ status: 'success', data: { user, accessToken, refreshToken } }`
- Files: `src/modules/users/user.routes.ts`, `user.controller.ts`, `user.service.ts`, `user.schema.ts`

## POST `/login`
- Body: `{ email, password }`
- Returns: `{ status: 'success', data: { user, accessToken, refreshToken } }`
- Files: same as above

Notes
- Access token: Bearer token for protected routes
- Refresh token: long-lived; storage strategy up to client
