/**
 * Integration Tests for IuranController
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
jest.mock('../../src/modules/iuran/iuran.service', () => ({
  IuranService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          judul: 'Iuran Bulanan',
          deskripsi: 'Iuran bulanan RT 01',
          jumlah: 100000,
          tanggalJatuhTempo: new Date(),
          status: 'BELUM_BAYAR',
          userId: '1',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }),
    findOne: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Iuran Bulanan',
      deskripsi: 'Iuran bulanan RT 01',
      jumlah: 100000,
      tanggalJatuhTempo: new Date(),
      status: 'BELUM_BAYAR',
      userId: '1',
    }),
    create: jest.fn().mockResolvedValue({
      id: '2',
      judul: 'Iuran Kebersihan',
      deskripsi: 'Iuran kebersihan RT 01',
      jumlah: 50000,
      tanggalJatuhTempo: new Date(),
      status: 'BELUM_BAYAR',
      userId: '1',
    }),
    update: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Iuran Bulanan Updated',
      deskripsi: 'Iuran bulanan RT 01',
      jumlah: 150000,
      tanggalJatuhTempo: new Date(),
      status: 'BELUM_BAYAR',
      userId: '1',
    }),
    remove: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Iuran Bulanan',
      deskripsi: 'Iuran bulanan RT 01',
      jumlah: 100000,
      tanggalJatuhTempo: new Date(),
      status: 'BELUM_BAYAR',
      userId: '1',
    }),
    findByUser: jest.fn().mockResolvedValue([
      {
        id: '1',
        judul: 'Iuran Bulanan',
        deskripsi: 'Iuran bulanan RT 01',
        jumlah: 100000,
        tanggalJatuhTempo: new Date(),
        status: 'BELUM_BAYAR',
        userId: '1',
      },
    ]),
    getReport: jest.fn().mockResolvedValue({
      totalIuran: 1,
      totalDibayar: 0,
      totalBelumDibayar: 1,
      totalTelat: 0,
      totalJumlah: 100000,
      totalJumlahDibayar: 0,
      totalJumlahBelumDibayar: 100000,
    }),
    updateStatus: jest.fn().mockResolvedValue({
      id: '1',
      judul: 'Iuran Bulanan',
      deskripsi: 'Iuran bulanan RT 01',
      jumlah: 100000,
      tanggalJatuhTempo: new Date(),
      status: 'SUDAH_BAYAR',
      tanggalPembayaran: new Date(),
      userId: '1',
    }),
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

describe('IuranController (Integration Tests)', () => {
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

  describe('/iuran (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/iuran')
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN, SUPERVISOR, or ADMIN role', () => {
      return request(app.getHttpServer())
        .get('/iuran')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(403);
    });

    it('should return 200 with paginated iuran records if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/iuran?page=1&limit=10&status=BELUM_BAYAR')
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
            .get('/iuran')
            .set('Authorization', `Bearer ${adminToken}`)
        );
      }

      return Promise.all(requests).then((responses) => {
        expect(responses[100].status).toBe(429);
      });
    });
  });

  describe('/iuran/:id (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/iuran/1')
        .expect(401);
    });

    it('should return 200 with iuran data if authenticated', () => {
      return request(app.getHttpServer())
        .get('/iuran/1')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('judul', 'Iuran Bulanan');
          expect(response.body).toHaveProperty('jumlah', 100000);
        });
    });
  });

  describe('/iuran (POST)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .post('/iuran')
        .send({
          judul: 'Iuran Kebersihan',
          deskripsi: 'Iuran kebersihan RT 01',
          jumlah: 50000,
          tanggalJatuhTempo: '2026-07-01',
        })
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN, SUPERVISOR, or ADMIN role', () => {
      return request(app.getHttpServer())
        .post('/iuran')
        .set('Authorization', `Bearer ${wargaToken}`)
        .send({
          judul: 'Iuran Kebersihan',
          deskripsi: 'Iuran kebersihan RT 01',
          jumlah: 50000,
          tanggalJatuhTempo: '2026-07-01',
        })
        .expect(403);
    });

    it('should return 201 with created iuran if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .post('/iuran')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          judul: 'Iuran Kebersihan',
          deskripsi: 'Iuran kebersihan RT 01',
          jumlah: 50000,
          tanggalJatuhTempo: '2026-07-01',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '2');
          expect(response.body).toHaveProperty('judul', 'Iuran Kebersihan');
          expect(response.body).toHaveProperty('jumlah', 50000);
        });
    });
  });

  describe('/iuran/:id (PUT)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .put('/iuran/1')
        .send({ judul: 'Updated Iuran' })
        .expect(401);
    });

    it('should return 403 if user does not have permission', () => {
      return request(app.getHttpServer())
        .put('/iuran/999')
        .set('Authorization', `Bearer ${wargaToken}`)
        .send({ judul: 'Updated Iuran' })
        .expect(403);
    });

    it('should return 200 with updated iuran if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .put('/iuran/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ judul: 'Iuran Bulanan Updated', jumlah: 150000 })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('judul', 'Iuran Bulanan Updated');
          expect(response.body).toHaveProperty('jumlah', 150000);
        });
    });
  });

  describe('/iuran/:id (DELETE)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .delete('/iuran/1')
        .expect(401);
    });

    it('should return 403 if user is not SUPERADMIN or SUPERVISOR', () => {
      return request(app.getHttpServer())
        .delete('/iuran/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should return 200 with deleted iuran if user is SUPERADMIN or SUPERVISOR', () => {
      return request(app.getHttpServer())
        .delete('/iuran/1')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
        });
    });
  });

  describe('/iuran/user/:userId (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/iuran/user/1')
        .expect(401);
    });

    it('should return 200 with iuran by user if authenticated', () => {
      return request(app.getHttpServer())
        .get('/iuran/user/1')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body[0]).toHaveProperty('userId', '1');
        });
    });
  });

  describe('/iuran/report (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/iuran/report')
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN, SUPERVISOR, or ADMIN role', () => {
      return request(app.getHttpServer())
        .get('/iuran/report')
        .set('Authorization', `Bearer ${wargaToken}`)
        .expect(403);
    });

    it('should return 200 with iuran report if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/iuran/report?tahun=2026&bulan=6')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('totalIuran');
          expect(response.body).toHaveProperty('totalDibayar');
          expect(response.body).toHaveProperty('totalBelumDibayar');
          expect(response.body).toHaveProperty('totalJumlah');
        });
    });
  });
});
