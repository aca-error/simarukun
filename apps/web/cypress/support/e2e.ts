// For TypeScript support in Cypress
// This file is required for Cypress to work with TypeScript

import './commands';

// Add global types for Cypress
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
