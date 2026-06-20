/// <reference types="cypress" />

describe('Aduan Management E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsWarga();
    cy.visit('/aduan');
  });

  describe('Aduan List Page (Warga View)', () => {
    it('should display aduan list for Warga', () => {
      cy.get('h1').should('contain', 'Aduan Saya');
      cy.get('table').should('be.visible');
      cy.get('th').should('contain', 'Judul');
      cy.get('th').should('contain', 'Kategori');
      cy.get('th').should('contain', 'Status');
      cy.get('th').should('contain', 'Tanggal');
    });

    it('should display pagination controls', () => {
      cy.get('.pagination').should('be.visible');
    });

    it('should filter aduan by status', () => {
      cy.get('select[name="status"]').select('BARU');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).get('td:nth-child(3)').should('contain', 'Baru');
      });
    });

    it('should filter aduan by kategori', () => {
      cy.get('select[name="kategori"]').select('KEBERSIHAN');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).get('td:nth-child(2)').should('contain', 'Kebersihan');
      });
    });
  });

  describe('Aduan List Page (Admin View)', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginAsAdmin();
      cy.visit('/aduan');
    });

    it('should display all aduan for Admin', () => {
      cy.get('h1').should('contain', 'Manajemen Aduan');
    });

    it('should show action buttons for Admin', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains('Edit').should('be.visible');
        cy.get('button').contains('Hapus').should('be.visible');
      });
    });
  });

  describe('Create Aduan', () => {
    it('should display create aduan form', () => {
      cy.get('button[href="/aduan/create"]').click();
      cy.url().should('include', '/aduan/create');
      cy.get('h1').should('contain', 'Buat Aduan');
      cy.get('input[name="judul"]').should('be.visible');
      cy.get('textarea[name="deskripsi"]').should('be.visible');
      cy.get('select[name="kategori"]').should('be.visible');
      cy.get('input[name="lokasi"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('button[href="/aduan/create"]').click();
      cy.get('button[type="submit"]').click();
      cy.contains('Judul wajib diisi').should('be.visible');
      cy.contains('Deskripsi wajib diisi').should('be.visible');
    });

    it('should show validation error for short judul', () => {
      cy.get('button[href="/aduan/create"]').click();
      cy.get('input[name="judul"]').type('Ab');
      cy.get('textarea[name="deskripsi"]').type('Deskripsi aduan');
      cy.get('button[type="submit"]').click();
      cy.contains('Judul minimal 3 karakter').should('be.visible');
    });

    it('should show validation error for short deskripsi', () => {
      cy.get('button[href="/aduan/create"]').click();
      cy.get('input[name="judul"]').type('Aduan Test');
      cy.get('textarea[name="deskripsi"]').type('Short');
      cy.get('button[type="submit"]').click();
      cy.contains('Deskripsi minimal 10 karakter').should('be.visible');
    });

    it('should create new aduan successfully', () => {
      cy.get('button[href="/aduan/create"]').click();
      cy.get('input[name="judul"]').type(`Aduan Test ${Date.now()}`);
      cy.get('textarea[name="deskripsi"]').type('Deskripsi aduan test dengan panjang yang cukup');
      cy.get('select[name="kategori"]').select('KEBERSIHAN');
      cy.get('input[name="lokasi"]').type('RT 01');
      cy.get('button[type="submit"]').click();
      cy.contains('Aduan berhasil dibuat').should('be.visible');
      cy.url().should('include', '/aduan');
    });
  });

  describe('View Aduan Detail', () => {
    it('should display aduan detail page', () => {
      cy.get('table tbody tr:first a[href*="/aduan/"]').first().click();
      cy.url().should('match', /\/aduan\/.*/);
      cy.get('h1').should('contain', 'Detail Aduan');
      cy.get('dd').should('contain', 'Judul:');
      cy.get('dd').should('contain', 'Deskripsi:');
      cy.get('dd').should('contain', 'Kategori:');
      cy.get('dd').should('contain', 'Status:');
      cy.get('dd').should('contain', 'Lokasi:');
    });
  });

  describe('Update Aduan (Admin Only)', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginAsAdmin();
      cy.visit('/aduan');
    });

    it('should update aduan successfully', () => {
      cy.get('table tbody tr:first a[href*="/aduan/"]').first().click();
      cy.get('button[href*="edit"]').click();
      cy.url().should('match', /\/aduan\/.*\/edit/);
      cy.get('input[name="judul"]').clear().type('Updated Aduan');
      cy.get('textarea[name="deskripsi"]').clear().type('Deskripsi aduan yang diperbarui');
      cy.get('button[type="submit"]').click();
      cy.contains('Aduan berhasil diperbarui').should('be.visible');
      cy.url().should('match', /\/aduan\/.*/);
    });
  });

  describe('Update Aduan Status (Admin Only)', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginAsAdmin();
      cy.visit('/aduan');
    });

    it('should update aduan status to DIPROSES', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('select[name="status"]').select('DIPROSES');
        cy.get('textarea[name="catatan"]').type('Sedang diproses');
        cy.get('button').contains('Simpan Status').click();
      });
      cy.contains('Status aduan berhasil diperbarui').should('be.visible');
    });

    it('should update aduan status to SELESAI', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('select[name="status"]').select('SELESAI');
        cy.get('textarea[name="catatan"]').type('Sudah selesai');
        cy.get('button').contains('Simpan Status').click();
      });
      cy.contains('Status aduan berhasil diperbarui').should('be.visible');
    });
  });

  describe('Delete Aduan (Admin/Supervisor Only)', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginAsAdmin();
      cy.visit('/aduan');
    });

    it('should show confirmation before delete', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Hapus/).click();
      });
      cy.get('.dialog').should('be.visible');
      cy.get('button').contains('Batal').click();
      cy.get('.dialog').should('not.be.visible');
    });

    it('should delete aduan successfully', () => {
      // Create a test aduan first
      cy.get('button[href="/aduan/create"]').click();
      cy.get('input[name="judul"]').type(`Aduan to Delete ${Date.now()}`);
      cy.get('textarea[name="deskripsi"]').type('Deskripsi aduan to delete');
      cy.get('select[name="kategori"]').select('LAINNYA');
      cy.get('button[type="submit"]').click();
      cy.contains('Aduan berhasil dibuat').should('be.visible');

      // Now delete the aduan
      cy.get('input[name="q"]').type(`Aduan to Delete ${Date.now()}`);
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Hapus/).click();
      });
      cy.get('button').contains('Hapus').click();
      cy.contains('Aduan berhasil dihapus').should('be.visible');
    });
  });

  describe('Aduan Statistics (Admin View)', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginAsAdmin();
      cy.visit('/aduan');
    });

    it('should display aduan statistics', () => {
      cy.get('button[href="/aduan/stats"]').click();
      cy.url().should('include', '/aduan/stats');
      cy.get('h1').should('contain', 'Statistik Aduan');
      cy.get('.card').should('contain', 'Total:');
      cy.get('.card').should('contain', 'Baru:');
      cy.get('.card').should('contain', 'Diproses:');
      cy.get('.card').should('contain', 'Selesai:');
      cy.get('.card').should('contain', 'Ditolak:');
    });

    it('should display statistics by kategori', () => {
      cy.get('button[href="/aduan/stats"]').click();
      cy.get('.chart').should('be.visible');
    });
  });

  describe('Warga Aduan Access', () => {
    it('should allow Warga to create aduan', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/aduan/create');
      cy.url().should('include', '/aduan/create');
    });

    it('should not allow Warga to update aduan status', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/aduan');
      cy.get('table tbody tr:first').within(() => {
        cy.get('select').should('not.exist');
      });
    });

    it('should not allow Warga to delete aduan', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/aduan');
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains('Hapus').should('not.exist');
      });
    });
  });

  describe('Super Admin Aduan Access', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginAsSuperAdmin();
      cy.visit('/aduan');
    });

    it('should allow Super Admin to access all aduan', () => {
      cy.get('h1').should('contain', 'Manajemen Aduan');
    });

    it('should allow Super Admin to update aduan status', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('select[name="status"]').should('be.visible');
      });
    });

    it('should allow Super Admin to delete aduan', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains('Hapus').should('be.visible');
      });
    });
  });
});
