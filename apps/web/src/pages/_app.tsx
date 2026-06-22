import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import * as Sentry from '@sentry/nextjs';

// Sentry Error Boundary Component
function SentryErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Wrap the entire app with Sentry Error Boundary
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SentryErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SentryErrorBoundary>
  );
}

// Export both for compatibility
export default Sentry.withSentry(MyApp);
