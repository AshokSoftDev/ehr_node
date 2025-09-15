import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { env } from './config/env';

const app = express();

// CORS configuration
// app.use(cors({
//     origin: env.CORS_ORIGIN || '*',
//     credentials: true,
// }));

// In your Node.js app
app.use(cors({
    origin: [
        'https://9000-firebase-ehrreactgit-1756347536195.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev',
        // Add any other origins you need
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
