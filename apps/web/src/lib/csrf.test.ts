/**
 * Unit Tests for CSRF Functions
 * 
 * @package SimaRukun
 * @subpackage Frontend/Lib
 */

import { getCsrfToken, setupCsrfInterceptor, withCsrfToken } from './csrf';

// Mock document and window for testing
global.document = {
  cookie: 'XSRF-TOKEN=test-token; other-cookie=value',
} as any;

global.window = {
  axios: {
    defaults: {
      headers: {
        common: {},
      },
    },
  },
} as any;

describe('CSRF Functions', () => {
  beforeEach(() => {
    // Reset cookie and axios headers before each test
    global.document.cookie = 'XSRF-TOKEN=test-token; other-cookie=value';
    global.window.axios.defaults.headers.common = {};
  });

  describe('getCsrfToken', () => {
    it('should return CSRF token from cookie', () => {
      const token = getCsrfToken();
      expect(token).toBe('test-token');
    });

    it('should return null if XSRF-TOKEN cookie not found', () => {
      global.document.cookie = 'other-cookie=value';
      const token = getCsrfToken();
      expect(token).toBeNull();
    });

    it('should return null if document is not defined', () => {
      const originalDocument = global.document;
      global.document = undefined as any;

      const token = getCsrfToken();
      expect(token).toBeNull();

      global.document = originalDocument;
    });

    it('should handle multiple cookies', () => {
      global.document.cookie = 'cookie1=value1; XSRF-TOKEN=my-token; cookie2=value2';
      const token = getCsrfToken();
      expect(token).toBe('my-token');
    });

    it('should handle cookie with special characters', () => {
      global.document.cookie = 'XSRF-TOKEN=abc123!@#$%^&*()';
      const token = getCsrfToken();
      expect(token).toBe('abc123!@#$%^&*()');
    });
  });

  describe('setupCsrfInterceptor', () => {
    it('should add CSRF token to axios headers', () => {
      setupCsrfInterceptor();
      expect(global.window.axios.defaults.headers.common['X-XSRF-TOKEN']).toBe('test-token');
    });

    it('should not add header if token is null', () => {
      global.document.cookie = 'other-cookie=value';
      setupCsrfInterceptor();
      expect(global.window.axios.defaults.headers.common['X-XSRF-TOKEN']).toBeUndefined();
    });

    it('should not add header if window is not defined', () => {
      const originalWindow = global.window;
      global.window = undefined as any;

      setupCsrfInterceptor();

      global.window = originalWindow;
    });

    it('should not add header if axios is not defined', () => {
      const originalAxios = global.window.axios;
      global.window.axios = undefined as any;

      setupCsrfInterceptor();

      global.window.axios = originalAxios;
    });
  });

  describe('withCsrfToken', () => {
    it('should add CSRF token to request headers', () => {
      const request = { headers: {} } as any;
      const result = withCsrfToken(request);

      expect(result.headers['X-XSRF-TOKEN']).toBe('test-token');
    });

    it('should return original request if token is null', () => {
      global.document.cookie = 'other-cookie=value';
      const request = { headers: {} } as any;
      const result = withCsrfToken(request);

      expect(result.headers['X-XSRF-TOKEN']).toBeUndefined();
    });

    it('should merge with existing headers', () => {
      const request = { headers: { 'Content-Type': 'application/json' } } as any;
      const result = withCsrfToken(request);

      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['X-XSRF-TOKEN']).toBe('test-token');
    });

    it('should handle null request', () => {
      const result = withCsrfToken(null as any);
      expect(result).toBeNull();
    });

    it('should handle request without headers', () => {
      const request = {} as any;
      const result = withCsrfToken(request);

      expect(result.headers['X-XSRF-TOKEN']).toBe('test-token');
    });
  });
});
