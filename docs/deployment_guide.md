# Deployment Guide

## Prerequisites
- Node.js (LTS)
- PostgreSQL database & `DATABASE_URL`
- `.env` populated (see env_reference.md)

## Install & Build
- `npm ci` (or `npm install`)
- Merge & generate Prisma client: `npm run prisma:generate`
- Apply migrations (dev): `npm run prisma:migrate`

## Run
- Dev: `npm run dev` (nodemon + ts-node)
- Prod (transpile optional):
  - Start with ts-node: `NODE_ENV=production node dist/server.js` (if built)
  - Or run via PM2 (recommended)

## PM2 (example)
```bash
pm2 start ts-node --name ehr-api -- src/server.ts \
  --transpile-only --inlineSourceMap
pm2 save
pm2 status
```

## Environment & Scaling
- Set `PORT`, `NODE_ENV`, DB & JWT secrets.
- Configure reverse proxy (NGINX) and SSL if needed.
- Monitor logs (`pm2 logs ehr-api`) and health endpoint `/api/v1/health`.
