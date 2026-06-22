import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as Sentry from '@sentry/node';
import { SentryService } from './modules/monitoring/sentry.service';
import { LoggerService } from './modules/logger/logger.service';
import { LoggerInterceptor } from './modules/logger/logger.interceptor';
import { MetricsInterceptor } from './modules/monitoring/metrics.interceptor';

async function bootstrap() {
  // Initialize Sentry for error tracking (Tahap 3)
  const sentryService = new SentryService({ get: (key: string) => process.env[key] } as any);
  
  // Flush Sentry before process exit
  process.on('unhandledRejection', (err: Error) => {
    Sentry.captureException(err);
    Sentry.flush(2000).then(() => process.exit(1));
  });

  process.on('uncaughtException', (err: Error) => {
    Sentry.captureException(err);
    Sentry.flush(2000).then(() => process.exit(1));
  });

  const app = await NestFactory.create(AppModule);

  // ========== SECURITY MIDDLEWARES (PHASE 1) ==========

  // 1. Helmet.js - Security Headers
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    }),
  );
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }));

  // 5. Secure Cookies - Apply to all responses
  app.use((req, res, next) => {
    const originalCookie = res.cookie;
    res.cookie = function (name, value, options) {
      const secureOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        ...options,
      };
      originalCookie.call(this, name, value, secureOptions);
    };
    next();
  });

  // 8. CORS Strict Policy
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://simarukun.com', 'https://api.simarukun.com', 'https://www.simarukun.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 jam
  });

  // 2. Rate Limiting - Apply globally
  app.useGlobalGuards(new ThrottlerGuard());

  // Cookie Parser for CSRF
  app.use(cookieParser());

  // ========== MONITORING (PHASE 3) ==========
  
  // Sentry Request Handler - should be before all other middleware
  app.use(Sentry.Handlers.requestHandler());
  
  // Tracing Handler - should be before all other middleware
  app.use(Sentry.Handlers.tracingHandler());

  // Logger Interceptor - Global request logging
  const logger = new LoggerService('Main', { get: (key: string) => process.env[key] } as any);
  app.useGlobalInterceptors(
    new LoggerInterceptor(logger),
    new MetricsInterceptor(new MetricsService({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any)),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  // Log startup
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Metrics available at: http://localhost:${port}/api/metrics`);
  console.log(`Health check: http://localhost:${port}/api/health`);
  
  // Sentry Error Handler - should be the last middleware
  app.use(Sentry.Handlers.errorHandler());
}

bootstrap();
