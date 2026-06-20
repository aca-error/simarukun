/// <reference types="cypress" />

describe('Users Management E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/users');
  });

  describe('Users List Page', () => {
    it('should display users list for Admin', () => {
      cy.get('h1').should('contain', 'Manajemen Warga');
      cy.get('table').should('be.visible');
      cy.get('th').should('contain', 'Nama');
      cy.get('th').should('contain', 'Email');
      cy.get('th').should('contain', 'Role');
      cy.get('th').should('contain', 'Status');
    });

    it('should display pagination controls', () => {
      cy.get('.pagination').should('be.visible');
    });

    it('should filter users by role', () => {
      cy.get('select[name="role"]').select('ADMIN');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).get('td:nth-child(3)').should('contain', 'Admin');
      });
    });

    it('should filter users by active status', () => {
      cy.get('select[name="isActive"]').select('true');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).get('td:nth-child(4)').should('contain', 'Aktif');
      });
    });

    it('should search users by name or email', () => {
      cy.get('input[name="q"]').type('Admin');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').should('have.length.gt', 0);
    });
  });

  describe('Create User', () => {
    it('should display create user form', () => {
      cy.get('button[href="/users/create"]').click();
      cy.url().should('include', '/users/create');
      cy.get('h1').should('contain', 'Tambah Warga');
      cy.get('input[name="nama"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('select[name="role"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('button[href="/users/create"]').click();
      cy.get('button[type="submit"]').click();
      cy.contains('Nama wajib diisi').should('be.visible');
      cy.contains('Email wajib diisi').should('be.visible');
      cy.contains('Password wajib diisi').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get('button[href="/users/create"]').click();
      cy.get('input[name="nama"]').type('Test User');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Email tidak valid').should('be.visible');
    });

    it('should show validation error for short password', () => {
      cy.get('button[href="/users/create"]').click();
      cy.get('input[name="nama"]').type('Test User');
      cy.get('input[name="email"]').type(`test-${Date.now()}@example.com`);
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
      cy.contains('Password minimal 8 karakter').should('be.visible');
    });

    it('should create new user successfully', () => {
      cy.get('button[href="/users/create"]').click();
      cy.get('input[name="nama"]').type('New User');
      cy.get('input[name="email"]').type(`new-${Date.now()}@example.com`);
      cy.get('input[name="password"]').type('password123');
      cy.get('select[name="role"]').select('WARGA');
      cy.get('button[type="submit"]').click();
      cy.contains('Warga berhasil dibuat').should('be.visible');
      cy.url().should('include', '/users');
    });
  });

  describe('View User Detail', () => {
    it('should display user detail page', () => {
      cy.get('table tbody tr:first a[href*="/users/"]').first().click();
      cy.url().should('match', /\/users\/.*/);
      cy.get('h1').should('contain', 'Detail Warga');
      cy.get('dd').should('contain', 'Nama:');
      cy.get('dd').should('contain', 'Email:');
      cy.get('dd').should('contain', 'Role:');
    });
  });

  describe('Update User', () => {
    it('should update user successfully', () => {
      cy.get('table tbody tr:first a[href*="/users/"]').first().click();
      cy.get('button[href*="edit"]').click();
      cy.url().should('match', /\/users\/.*\/edit/);
      cy.get('input[name="nama"]').clear().type('Updated User');
      cy.get('button[type="submit"]').click();
      cy.contains('Warga berhasil diperbarui').should('be.visible');
      cy.url().should('match', /\/users\/.*/);
    });
  });

  describe('Toggle User Active Status', () => {
    it('should toggle user active status', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Aktifkan|Nonaktifkan/).click();
      });
      cy.contains('Status warga berhasil diperbarui').should('be.visible');
    });
  });

  describe('Delete User', () => {
    it('should show confirmation before delete', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Hapus/).click();
      });
      cy.get('.dialog').should('be.visible');
      cy.get('button').contains('Batal').click();
      cy.get('.dialog').should('not.be.visible');
    });

    it('should delete user successfully', () => {
      // Create a test user first
      cy.get('button[href="/users/create"]').click();
      cy.get('input[name="nama"]').type('Test User to Delete');
      cy.get('input[name="email"]').type(`delete-${Date.now()}@example.com`);
      cy.get('input[name="password"]').type('password123');
      cy.get('select[name="role"]').select('WARGA');
      cy.get('button[type="submit"]').click();
      cy.contains('Warga berhasil dibuat').should('be.visible');

      // Now delete the user
      cy.get('input[name="q"]').type('Test User to Delete');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Hapus/).click();
      });
      cy.get('button').contains('Hapus').click();
      cy.contains('Warga berhasil dihapus').should('be.visible');
    });
  });

  describe('Role-Based Access Control', () => {
    it('should not allow Warga to access users page', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/users');
      cy.url().should('include', '/dashboard');
    });

    it('should allow Super Admin to access users page', () => {
      cy.logout();
      cy.loginAsSuperAdmin();
      cy.visit('/users');
      cy.url().should('include', '/users');
    });
  });
});
