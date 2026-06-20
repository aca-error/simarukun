/**
 * Integration Tests for AduanController
 * 
 * @package SimaRukun
 * @subpackage Backend/Integration Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserRole } from '../../src/common/enums/user-role.enum';

// Mock database for integration tests
jest.mock('../../src/modules/aduan/aduan.service', () => ({
  AduanService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          judul: 'Aduan Kebersihan',
          deskripsi: 'Lingkungan RT 01 kotor',
          kategori: 'KEBERSIHAN',
          status: 'BARU',
          userId: '1',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }),
    findOne: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Aduan Kebersihan',
      deskripsi: 'Lingkungan RT 01 kotor',
      kategori: 'KEBERSIHAN',
      status: 'BARU',
      userId: '1',
    }),
    create: jest.fn().mockResolvedValue({
      id: '2',
      judul: 'Aduan Keamanan',
      deskripsi: 'Ada pencurian di RT 01',
      kategori: 'KEAMANAN',
      status: 'BARU',
      userId: '1',
      lampiran: null,
    }),
    update: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Aduan Kebersihan Updated',
      deskripsi: 'Lingkungan RT 01 sangat kotor',
      kategori: 'KEBERSIHAN',
      status: 'BARU',
      userId: '1',
    }),
    remove: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Aduan Kebersihan',
      deskripsi: 'Lingkungan RT 01 kotor',
      kategori: 'KEBERSIHAN',
      status: 'BARU',
      userId: '1',
    }),
    findByUser: jest.fn().mockResolvedValue([
      {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN',
        status: 'BARU',
        userId: '1',
      },
    ]),
    updateStatus: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Aduan Kebersihan',
      deskripsi: 'Lingkungan RT 01 kotor',
      kategori: 'KEBERSIHAN',
      status: 'DIPROSES',
      catatan: 'Sedang diproses',
      userId: '1',
    }),
    getStats: jest.fn().mockResolvedValue({
      total: 10,
      baru: 5,
      diproses: 3,
      selesai: 1,
      ditolak: 1,
      byKategori: {
        KEAMANAN: 2,
        KEBERSIHAN: 3,
        FASILITAS: 4,
        LAINNYA: 1,
      },
    }),
    search: jest.fn().mockResolvedValue([
      {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN',
        status: 'BARU',
        userId: '1',
      },
    ]),
    findRecent: jest.fn().mockResolvedValue([
      {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN',
        status: 'BARU',
        userId: '1',
      },
    ]),
  })),
}));

// Mock JWT auth guard
jest.mock('../../src/modules/auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

// Mock Roles guard
jest.mock('../../src/modules/auth/guards/roles.guard', () => ({
  RolesGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('AduanController (Integration Tests)', () => {
  let app: INestApplication;
  let superAdminToken: string;
  let adminToken: string;
  let wargaToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Mock tokens
    superAdminToken = 'superadmin-test-token';
    adminToken = 'admin-test-token';
    wargaToken = 'warga-test-token';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/aduan (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/aduan')
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN, SUPERVISOR, or ADMIN role', () => {
      return request(app.getHttpServer())
        .get('/aduan')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(403);
    });

    it('should return 200 with paginated aduan records if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/aduan?page=1&limit=10&status=BARU&kategori=KEBERSIHAN')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('page');
          expect(response.body).toHaveProperty('limit');
        });
    });

    it('should apply rate limiting (429 Too Many Requests)', () => {
      const requests = [];
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/aduan')
            .set('Authorization', `Bearer ${adminToken}`)
        );
      }

      return Promise.all(requests).then((responses) => {
        expect(responses[100].status).toBe(429);
      });
    });
  });

  describe('/aduan/:id (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/aduan/1')
        .expect(401);
    });

    it('should return 200 with aduan data if authenticated', () => {
      return request(app.getHttpServer())
        .get('/aduan/1')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('judul', 'Aduan Kebersihan');
          expect(response.body).toHaveProperty('kategori', 'KEBERSIHAN');
        });
    });
  });

  describe('/aduan (POST)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .post('/aduan')
        .send({
          judul: 'Aduan Keamanan',
          deskripsi: 'Ada pencurian di RT 01',
          kategori: 'KEAMANAN',
          lokasi: 'RT 01',
        })
        .expect(401);
    });

    it('should return 201 with created aduan if authenticated (Warga can create)', () => {
      return request(app.getHttpServer())
        .post('/aduan')
        .set('Authorization', `Bearer ${wargaToken}`)
        .send({
          judul: 'Aduan Keamanan',
          deskripsi: 'Ada pencurian di RT 01',
          kategori: 'KEAMANAN',
          lokasi: 'RT 01',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '2');
          expect(response.body).toHaveProperty('judul', 'Aduan Keamanan');
          expect(response.body).toHaveProperty('kategori', 'KEAMANAN');
        });
    });

    it('should apply rate limiting (429 Too Many Requests)', () => {
      const requests = [];
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/aduan')
            .set('Authorization', `Bearer ${wargaToken}`)
            .send({
              judul: `Aduan ${i}`,
              deskripsi: `Deskripsi ${i}`,
              kategori: 'LAINNYA',
            })
        );
      }

      return Promise.all(requests).then((responses) => {
        expect(responses[100].status).toBe(429);
      });
    });
  });

  describe('/aduan/:id (PUT)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .put('/aduan/1')
        .send({ judul: 'Updated Aduan' })
        .expect(401);
    });

    it('should return 403 if user does not have permission (Warga cannot update others)', () => {
      return request(app.getHttpServer())
        .put('/aduan/999')
        .set('Authorization', `Bearer ${wargaToken}`)
        .send({ judul: 'Updated Aduan' })
        .expect(403);
    });

    it('should return 200 with updated aduan if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .put('/aduan/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ judul: 'Aduan Kebersihan Updated', deskripsi: 'Lingkungan RT 01 sangat kotor' })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('judul', 'Aduan Kebersihan Updated');
        });
    });
  });

  describe('/aduan/:id (DELETE)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .delete('/aduan/1')
        .expect(401);
    });

    it('should return 403 if user is not SUPERADMIN or SUPERVISOR', () => {
      return request(app.getHttpServer())
        .delete('/aduan/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should return 200 with deleted aduan if user is SUPERADMIN or SUPERVISOR', () => {
      return request(app.getHttpServer())
        .delete('/aduan/1')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
        });
    });
  });

  describe('/aduan/user/:userId (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/aduan/user/1')
        .expect(401);
    });

    it('should return 200 with aduan by user if authenticated', () => {
      return request(app.getHttpServer())
        .get('/aduan/user/1')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body[0]).toHaveProperty('userId', '1');
        });
    });
  });

  describe('/aduan/:id/status (PUT)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .put('/aduan/1/status')
        .send({ status: 'DIPROSES' })
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN, SUPERVISOR, or ADMIN role', () => {
      return request(app.getHttpServer())
        .put('/aduan/1/status')
        .set('Authorization', `Bearer ${wargaToken}`)
        .send({ status: 'DIPROSES' })
        .expect(403);
    });

    it('should return 200 with updated aduan status if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .put('/aduan/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DIPROSES' })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('status', 'DIPROSES');
        });
    });
  });

  describe('/aduan/stats (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/aduan/stats')
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN, SUPERVISOR, or ADMIN role', () => {
      return request(app.getHttpServer())
        .get('/aduan/stats')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(403);
    });

    it('should return 200 with aduan statistics if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/aduan/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('baru');
          expect(response.body).toHaveProperty('diproses');
          expect(response.body).toHaveProperty('selesai');
          expect(response.body).toHaveProperty('ditolak');
          expect(response.body).toHaveProperty('byKategori');
        });
    });
  });
});
