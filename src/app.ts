import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '@/routes';
import { errorHandler } from '@/middlewares/errorHandler';
import { notFound } from '@/middlewares/notFound';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
