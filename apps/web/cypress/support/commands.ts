/// <reference types="cypress" />

// Custom commands for Cypress

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('button[aria-label="Logout"]').click();
  cy.url().should('include', '/auth/login');
});

Cypress.Commands.add('loginAsWarga', () => {
  cy.login(
    Cypress.env('TEST_USER_EMAIL'),
    Cypress.env('TEST_USER_PASSWORD')
  );
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(
    Cypress.env('TEST_ADMIN_EMAIL'),
    Cypress.env('TEST_ADMIN_PASSWORD')
  );
});

Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.login(
    Cypress.env('TEST_SUPERADMIN_EMAIL'),
    Cypress.env('TEST_SUPERADMIN_PASSWORD')
  );
});

Cypress.Commands.add('createIuran', (data: {
  judul: string;
  deskripsi?: string;
  jumlah: number;
  tanggalJatuhTempo: string;
}) => {
  cy.visit('/iuran/create');
  cy.get('input[name="judul"]').type(data.judul);
  if (data.deskripsi) {
    cy.get('textarea[name="deskripsi"]').type(data.deskripsi);
  }
  cy.get('input[name="jumlah"]').type(data.jumlah.toString());
  cy.get('input[name="tanggalJatuhTempo"]').type(data.tanggalJatuhTempo);
  cy.get('button[type="submit"]').click();
  cy.contains('Iuran berhasil dibuat').should('be.visible');
});

Cypress.Commands.add('createAduan', (data: {
  judul: string;
  deskripsi: string;
  kategori: string;
  lokasi?: string;
}) => {
  cy.visit('/aduan/create');
  cy.get('input[name="judul"]').type(data.judul);
  cy.get('textarea[name="deskripsi"]').type(data.deskripsi);
  cy.get('select[name="kategori"]').select(data.kategori);
  if (data.lokasi) {
    cy.get('input[name="lokasi"]').type(data.lokasi);
  }
  cy.get('button[type="submit"]').click();
  cy.contains('Aduan berhasil dibuat').should('be.visible');
});

Cypress.Commands.add('checkNotification', (message: string) => {
  cy.get('.toast').should('contain', message);
});

// Add type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      loginAsWarga(): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      loginAsSuperAdmin(): Chainable<void>;
      createIuran(data: {
        judul: string;
        deskripsi?: string;
        jumlah: number;
        tanggalJatuhTempo: string;
      }): Chainable<void>;
      createAduan(data: {
        judul: string;
        deskripsi: string;
        kategori: string;
        lokasi?: string;
      }): Chainable<void>;
      checkNotification(message: string): Chainable<void>;
    }
  }
}
