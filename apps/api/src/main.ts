import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV || 'development',
      release: process.env.RELEASE_VERSION || '1.2.0',
      integrations: [
        Sentry.httpIntegration(),
        Sentry.expressIntegration(),
      ],
    });
  }

  process.on('unhandledRejection', (err: Error) => {
    Sentry.captureException(err);
    Sentry.flush(2000).then(() => process.exit(1));
  });

  process.on('uncaughtException', (err: Error) => {
    Sentry.captureException(err);
    Sentry.flush(2000).then(() => process.exit(1));
  });

  const app = await NestFactory.create(AppModule);

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptor for standardized success responses
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameguard: { action: 'deny' },
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      xssFilter: true,
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'no-referrer-when-downgrade' },
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const originalCookie = res.cookie.bind(res);
    res.cookie = function (
      name: string,
      value: string,
      options?: CookieOptions,
    ) {
      const secureOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        ...options,
      };
      return originalCookie(name, value, secureOptions);
    };
    next();
  });

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://simarukun.com', 'https://api.simarukun.com', 'https://www.simarukun.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });

  app.use(cookieParser());

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API base URL: http://localhost:${port}/api`);
  console.log(`Metrics: http://localhost:${port}/api/metrics`);
  console.log(`Health check: http://localhost:${port}/api/health`);
}

bootstrap();
