/// <reference types="cypress" />

describe('Iuran Management E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/iuran');
  });

  describe('Iuran List Page', () => {
    it('should display iuran list for Admin', () => {
      cy.get('h1').should('contain', 'Manajemen Iuran');
      cy.get('table').should('be.visible');
      cy.get('th').should('contain', 'Judul');
      cy.get('th').should('contain', 'Jumlah');
      cy.get('th').should('contain', 'Tanggal Jatuh Tempo');
      cy.get('th').should('contain', 'Status');
    });

    it('should display pagination controls', () => {
      cy.get('.pagination').should('be.visible');
    });

    it('should filter iuran by status', () => {
      cy.get('select[name="status"]').select('BELUM_BAYAR');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).get('td:nth-child(4)').should('contain', 'Belum Bayar');
      });
    });

    it('should filter iuran by tahun', () => {
      cy.get('input[name="tahun"]').type('2026');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').should('have.length.gt', 0);
    });

    it('should filter iuran by bulan', () => {
      cy.get('input[name="tahun"]').type('2026');
      cy.get('input[name="bulan"]').type('6');
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr').should('have.length.gt', 0);
    });
  });

  describe('Create Iuran', () => {
    it('should display create iuran form', () => {
      cy.get('button[href="/iuran/create"]').click();
      cy.url().should('include', '/iuran/create');
      cy.get('h1').should('contain', 'Tambah Iuran');
      cy.get('input[name="judul"]').should('be.visible');
      cy.get('textarea[name="deskripsi"]').should('be.visible');
      cy.get('input[name="jumlah"]').should('be.visible');
      cy.get('input[name="tanggalJatuhTempo"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('button[href="/iuran/create"]').click();
      cy.get('button[type="submit"]').click();
      cy.contains('Judul wajib diisi').should('be.visible');
      cy.contains('Jumlah wajib diisi').should('be.visible');
      cy.contains('Tanggal jatuh tempo wajib diisi').should('be.visible');
    });

    it('should show validation error for invalid jumlah', () => {
      cy.get('button[href="/iuran/create"]').click();
      cy.get('input[name="judul"]').type('Test Iuran');
      cy.get('input[name="jumlah"]').type('0');
      cy.get('input[name="tanggalJatuhTempo"]').type('2026-07-01');
      cy.get('button[type="submit"]').click();
      cy.contains('Jumlah harus lebih dari 0').should('be.visible');
    });

    it('should show validation error for invalid tanggal format', () => {
      cy.get('button[href="/iuran/create"]').click();
      cy.get('input[name="judul"]').type('Test Iuran');
      cy.get('input[name="jumlah"]').type('100000');
      cy.get('input[name="tanggalJatuhTempo"]').type('invalid-date');
      cy.get('button[type="submit"]').click();
      cy.contains('Format tanggal harus YYYY-MM-DD').should('be.visible');
    });

    it('should create new iuran successfully', () => {
      cy.get('button[href="/iuran/create"]').click();
      cy.get('input[name="judul"]').type(`Iuran Test ${Date.now()}`);
      cy.get('textarea[name="deskripsi"]').type('Deskripsi iuran test');
      cy.get('input[name="jumlah"]').type('100000');
      cy.get('input[name="tanggalJatuhTempo"]').type('2026-07-01');
      cy.get('button[type="submit"]').click();
      cy.contains('Iuran berhasil dibuat').should('be.visible');
      cy.url().should('include', '/iuran');
    });
  });

  describe('View Iuran Detail', () => {
    it('should display iuran detail page', () => {
      cy.get('table tbody tr:first a[href*="/iuran/"]').first().click();
      cy.url().should('match', /\/iuran\/.*/);
      cy.get('h1').should('contain', 'Detail Iuran');
      cy.get('dd').should('contain', 'Judul:');
      cy.get('dd').should('contain', 'Deskripsi:');
      cy.get('dd').should('contain', 'Jumlah:');
      cy.get('dd').should('contain', 'Tanggal Jatuh Tempo:');
      cy.get('dd').should('contain', 'Status:');
    });
  });

  describe('Update Iuran', () => {
    it('should update iuran successfully', () => {
      cy.get('table tbody tr:first a[href*="/iuran/"]').first().click();
      cy.get('button[href*="edit"]').click();
      cy.url().should('match', /\/iuran\/.*\/edit/);
      cy.get('input[name="judul"]').clear().type('Updated Iuran');
      cy.get('input[name="jumlah"]').clear().type('150000');
      cy.get('button[type="submit"]').click();
      cy.contains('Iuran berhasil diperbarui').should('be.visible');
      cy.url().should('match', /\/iuran\/.*/);
    });
  });

  describe('Update Iuran Status', () => {
    it('should update iuran status to SUDAH_BAYAR', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('select[name="status"]').select('SUDAH_BAYAR');
        cy.get('button').contains('Simpan Status').click();
      });
      cy.contains('Status iuran berhasil diperbarui').should('be.visible');
    });
  });

  describe('Delete Iuran', () => {
    it('should show confirmation before delete', () => {
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Hapus/).click();
      });
      cy.get('.dialog').should('be.visible');
      cy.get('button').contains('Batal').click();
      cy.get('.dialog').should('not.be.visible');
    });

    it('should delete iuran successfully', () => {
      // Create a test iuran first
      cy.get('button[href="/iuran/create"]').click();
      cy.get('input[name="judul"]').type(`Iuran to Delete ${Date.now()}`);
      cy.get('textarea[name="deskripsi"]').type('Deskripsi iuran to delete');
      cy.get('input[name="jumlah"]').type('50000');
      cy.get('input[name="tanggalJatuhTempo"]').type('2026-08-01');
      cy.get('button[type="submit"]').click();
      cy.contains('Iuran berhasil dibuat').should('be.visible');

      // Now delete the iuran
      cy.get('input[name="q"]').type(`Iuran to Delete ${Date.now()}`);
      cy.get('button[type="submit"]').click();
      cy.get('table tbody tr:first').within(() => {
        cy.get('button').contains(/Hapus/).click();
      });
      cy.get('button').contains('Hapus').click();
      cy.contains('Iuran berhasil dihapus').should('be.visible');
    });
  });

  describe('Iuran Report', () => {
    it('should display iuran report', () => {
      cy.get('button[href="/iuran/report"]').click();
      cy.url().should('include', '/iuran/report');
      cy.get('h1').should('contain', 'Laporan Iuran');
      cy.get('.card').should('contain', 'Total Iuran:');
      cy.get('.card').should('contain', 'Total Dibayar:');
      cy.get('.card').should('contain', 'Total Belum Dibayar:');
      cy.get('.card').should('contain', 'Total Telat:');
    });

    it('should filter report by tahun', () => {
      cy.get('button[href="/iuran/report"]').click();
      cy.get('input[name="tahun"]').type('2026');
      cy.get('button[type="submit"]').click();
      cy.get('.card').should('be.visible');
    });

    it('should filter report by bulan', () => {
      cy.get('button[href="/iuran/report"]').click();
      cy.get('input[name="tahun"]').type('2026');
      cy.get('input[name="bulan"]').type('6');
      cy.get('button[type="submit"]').click();
      cy.get('.card').should('be.visible');
    });
  });

  describe('Warga Iuran Access', () => {
    it('should allow Warga to view their own iuran', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/iuran');
      cy.url().should('include', '/iuran');
      cy.get('h1').should('contain', 'Iuran Saya');
    });

    it('should not allow Warga to create iuran', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/iuran/create');
      cy.url().should('include', '/dashboard');
    });

    it('should not allow Warga to update iuran status', () => {
      cy.logout();
      cy.loginAsWarga();
      cy.visit('/iuran');
      cy.get('table tbody tr:first').within(() => {
        cy.get('select').should('not.exist');
      });
    });
  });
});
