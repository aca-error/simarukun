import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
