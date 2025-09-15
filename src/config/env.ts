import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  // Database
  DATABASE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d').optional(),

  // Optional: CORS
  CORS_ORIGIN: z.string().default('*').optional(),

  // Optional: Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').optional(), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100').optional(),

  // Optional: Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info').optional(),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

// Type for env
export type Env = z.infer<typeof envSchema>;
