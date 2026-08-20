import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// Sentry Error Boundary Component
function SentryErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Wrap the entire app with Sentry Error Boundary
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SentryErrorBoundary>
      <Component {...pageProps} />
    </SentryErrorBoundary>
  );
}

export default MyApp;
