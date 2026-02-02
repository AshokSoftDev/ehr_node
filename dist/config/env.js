"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    // Server
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    // Database
    DATABASE_URL: zod_1.z.string(),
    // JWT
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('30d').optional(),
    // Optional: CORS
    CORS_ORIGIN: zod_1.z.string().default('*').optional(),
    // Optional: Rate limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('900000').optional(), // 15 minutes
    RATE_LIMIT_MAX: zod_1.z.string().default('100').optional(),
    // Optional: Logging
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info').optional(),
});
// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
