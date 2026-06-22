/**
 * Sentry Configuration for Frontend
 * 
 * @package SimaRukun
 * @subpackage Frontend/Lib
 */

import * as Sentry from '@sentry/nextjs';

// Initialize Sentry only in production or if DSN is provided
if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.NEXT_PUBLIC_RELEASE_VERSION || '1.0.0',
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    // Performance monitoring
    tracesSampler: (samplingContext) => {
      // Sample 100% of transactions for now
      return 1.0;
    },
    // Session replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of error sessions
    // Before send callback
    beforeSend(event) {
      // Add custom data to all events
      event.tags = {
        ...event.tags,
        app: 'simarukun-web',
        environment: process.env.NODE_ENV || 'development',
        release: process.env.NEXT_PUBLIC_RELEASE_VERSION || '1.0.0',
      };
      return event;
    },
  });
}

// Export Sentry functions for use in components
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const startTransaction = Sentry.startTransaction;
export const setUser = Sentry.setUser;
export const setContext = Sentry.setContext;
export const setTags = Sentry.setTags;
export const configureScope = Sentry.configureScope;
export const withScope = Sentry.withScope;

// Export Sentry for use in _app.tsx or _document.tsx
export default Sentry;
