import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  },
  env: {
    API_URL: 'http://localhost:3001/api',
    TEST_USER_EMAIL: 'warga@example.com',
    TEST_USER_PASSWORD: 'password123',
    TEST_ADMIN_EMAIL: 'admin@example.com',
    TEST_ADMIN_PASSWORD: 'password123',
    TEST_SUPERADMIN_EMAIL: 'superadmin@example.com',
    TEST_SUPERADMIN_PASSWORD: 'password123',
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
});
