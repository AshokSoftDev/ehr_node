# User APIs

Base Path: `/api/v1/users`
Auth: Bearer token required for all except `/register`, `/login`.

## POST `/create`
- Body: same as `/register`
- Returns: `{ status: 'success', data: { user, accessToken, refreshToken } }`

## GET `/`
- Query: `page?`, `limit?`, filters (various)
- Returns: `{ status: 'success', data: { users, total, page, totalPages } }`

## GET `/:userId`
- Returns: `{ status: 'success', data: User }`

## PUT `/:userId`
- Body: partial update
- Returns: `{ status: 'success', data: User }`

## DELETE `/:userId`
- Returns: 204 No Content

Files
- `src/modules/users/user.routes.ts`, `user.controller.ts`, `user.service.ts`, `user.repository.ts`
