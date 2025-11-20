# Environment Variables

Loaded and validated via `src/config/env.ts`.

- `NODE_ENV` (development|production|test) – defaults to `development`
- `PORT` – server port, defaults to `3000`
- `DATABASE_URL` – Prisma connection string (PostgreSQL)
- `JWT_SECRET` – signing key for JWT
- `JWT_EXPIRES_IN` – access token TTL (e.g., `7d`)
- `JWT_REFRESH_EXPIRES_IN` – refresh token TTL (default `30d`)
- `CORS_ORIGIN` – allowed origin(s) for CORS; `*` by default
- `RATE_LIMIT_WINDOW_MS` – rate limit window in ms (default `900000`)
- `RATE_LIMIT_MAX` – max requests per window (default `100`)
- `LOG_LEVEL` – `error|warn|info|debug` (default `info`)
