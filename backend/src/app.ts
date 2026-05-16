import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';

// Initialize express app
const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));

// Routes
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Root endpoint for Vercel
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Welcome to GigFlow API! Everything is running perfectly.' 
  });
});

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
