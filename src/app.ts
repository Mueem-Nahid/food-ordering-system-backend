import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import config from './config';

const app: Application = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
});
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/users/google-auth', authLimiter);
app.use('/api/v1/users/signup', authLimiter);

// CORS
const corsOptions = {
  origin:
    config.env === 'production'
      ? config.frontend_url
      : [config.frontend_url || 'http://localhost:3000', 'http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));

// parse data
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Prevent parameter pollution
app.use(hpp());

// Sanitize MongoDB queries
app.use(mongoSanitize());

// cookie parser
app.use(cookieParser());

// application routes
app.use('/api/v1', routes);

// global error handler
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response): void => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found !',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found !',
      },
    ],
  });
});

export default app;
