/// <reference types="cypress" />

import { UserRole } from '../../../apps/api/src/common/enums/user-role.enum';

describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.visit('/auth/login');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show validation error for empty email', () => {
      cy.visit('/auth/login');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Email wajib diisi').should('be.visible');
    });

    it('should show validation error for empty password', () => {
      cy.visit('/auth/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.contains('Password wajib diisi').should('be.visible');
    });

    it('should show validation error for invalid email format', () => {
      cy.visit('/auth/login');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Email tidak valid').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/auth/login');
      cy.get('input[name="email"]').type('nonexistent@example.com');
      cy.get('input[name="password"]').type('wrong-password');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should redirect to dashboard after successful login', () => {
      cy.loginAsWarga();
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Registration Page', () => {
    it('should display registration form', () => {
      cy.visit('/auth/register');
      cy.get('input[name="nama"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show validation error for empty fields', () => {
      cy.visit('/auth/register');
      cy.get('button[type="submit"]').click();
      cy.contains('Nama wajib diisi').should('be.visible');
      cy.contains('Email wajib diisi').should('be.visible');
      cy.contains('Password wajib diisi').should('be.visible');
    });

    it('should show validation error for short password', () => {
      cy.visit('/auth/register');
      cy.get('input[name="nama"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
      cy.contains('Password minimal 8 karakter').should('be.visible');
    });

    it('should show validation error for invalid email format', () => {
      cy.visit('/auth/register');
      cy.get('input[name="nama"]').type('Test User');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Email tidak valid').should('be.visible');
    });

    it('should redirect to dashboard after successful registration', () => {
      cy.visit('/auth/register');
      cy.get('input[name="nama"]').type('New User');
      cy.get('input[name="email"]').type(`new-${Date.now()}@example.com`);
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Logout', () => {
    it('should redirect to login page after logout', () => {
      cy.loginAsWarga();
      cy.logout();
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Profile Page', () => {
    it('should display user profile after login', () => {
      cy.loginAsWarga();
      cy.visit('/profile');
      cy.get('h1').should('contain', 'Profil');
      cy.get('input[name="nama"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
    });

    it('should update user profile', () => {
      cy.loginAsWarga();
      cy.visit('/profile');
      cy.get('input[name="nama"]').clear().type('Updated User');
      cy.get('button[type="submit"]').click();
      cy.contains('Profil berhasil diperbarui').should('be.visible');
    });
  });

  describe('Role-Based Access', () => {
    it('should redirect Warga to dashboard (not admin pages)', () => {
      cy.loginAsWarga();
      cy.visit('/users');
      cy.url().should('include', '/dashboard');
    });

    it('should allow Admin to access users page', () => {
      cy.loginAsAdmin();
      cy.visit('/users');
      cy.url().should('include', '/users');
      cy.get('h1').should('contain', 'Manajemen Warga');
    });

    it('should allow Super Admin to access all pages', () => {
      cy.loginAsSuperAdmin();
      cy.visit('/users');
      cy.url().should('include', '/users');
      cy.visit('/backup');
      cy.url().should('include', '/backup');
    });
  });

  describe('Session Management', () => {
    it('should persist session after page reload', () => {
      cy.loginAsWarga();
      cy.reload();
      cy.url().should('include', '/dashboard');
    });

    it('should clear session after logout', () => {
      cy.loginAsWarga();
      cy.logout();
      cy.reload();
      cy.url().should('include', '/auth/login');
    });
  });
});
