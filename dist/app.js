"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// CORS configuration
// app.use(cors({
//     origin: env.CORS_ORIGIN || '*',
//     credentials: true,
// }));
// In your Node.js app
app.use((0, cors_1.default)({
    origin: '*',
    // [
    //     'https://9000-firebase-ehrreactgit-1756347536195.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev', 'http://localhost:5173'
    //     // Add any other origins you need
    // ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Security middleware
app.use((0, helmet_1.default)());
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// API routes
app.use('/api/v1', routes_1.default);
// Error handling
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
