/**
 * Integration Tests for UsersController
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
jest.mock('../../src/modules/users/users.service', () => ({
  UsersService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          nama: 'User 1',
          email: 'user1@example.com',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }),
    findOne: jest.fn().mockResolvedValue({
      id: '1',
      nama: 'User 1',
      email: 'user1@example.com',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    create: jest.fn().mockResolvedValue({
      id: '2',
      nama: 'New User',
      email: 'new@example.com',
      role: UserRole.WARGA,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: jest.fn().mockResolvedValue({
      id: '1',
      nama: 'Updated User',
      email: 'user1@example.com',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    remove: jest.fn().mockResolvedValue({
      id: '1',
      nama: 'User 1',
      email: 'user1@example.com',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    toggleActive: jest.fn().mockResolvedValue({
      id: '1',
      nama: 'User 1',
      email: 'user1@example.com',
      role: UserRole.ADMIN,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    search: jest.fn().mockResolvedValue([
      {
        id: '1',
        nama: 'User 1',
        email: 'user1@example.com',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  })),
}));

// Mock JWT auth guard for integration tests
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

describe('UsersController (Integration Tests)', () => {
  let app: INestApplication;
  let superAdminToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get tokens for testing (mocked in actual implementation)
    superAdminToken = 'superadmin-test-token';
    adminToken = 'admin-test-token';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN or SUPERVISOR role', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should return 200 with paginated users if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/users?page=1&limit=10')
        .set('Authorization', `Bearer ${superAdminToken}`)
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
            .get('/users')
            .set('Authorization', `Bearer ${superAdminToken}`)
        );
      }

      return Promise.all(requests).then((responses) => {
        // The 101st request should be rate limited (medium tier: 100/menit)
        expect(responses[100].status).toBe(429);
      });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(401);
    });

    it('should return 403 if user does not have permission', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should return 200 with user data if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('nama');
          expect(response.body).toHaveProperty('email');
          expect(response.body).toHaveProperty('role');
        });
    });
  });

  describe('/users (POST)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          nama: 'New User',
          email: 'new@example.com',
          password: 'password123',
          role: UserRole.WARGA,
        })
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN or SUPERVISOR role', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nama: 'New User',
          email: 'new@example.com',
          password: 'password123',
          role: UserRole.WARGA,
        })
        .expect(403);
    });

    it('should return 201 with created user if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nama: 'New User',
          email: 'new@example.com',
          password: 'password123',
          role: UserRole.WARGA,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('nama', 'New User');
          expect(response.body).toHaveProperty('email', 'new@example.com');
          expect(response.body).toHaveProperty('role', UserRole.WARGA);
        });
    });

    it('should apply rate limiting (429 Too Many Requests)', () => {
      const requests = [];
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${superAdminToken}`)
            .send({
              nama: `User ${i}`,
              email: `user${i}@example.com`,
              password: 'password123',
              role: UserRole.WARGA,
            })
        );
      }

      return Promise.all(requests).then((responses) => {
        expect(responses[100].status).toBe(429);
      });
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .put('/users/1')
        .send({ nama: 'Updated User' })
        .expect(401);
    });

    it('should return 403 if user does not have permission', () => {
      return request(app.getHttpServer())
        .put('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nama: 'Updated User' })
        .expect(403);
    });

    it('should return 200 with updated user if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .put('/users/1')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ nama: 'Updated User' })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('nama', 'Updated User');
        });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .delete('/users/1')
        .expect(401);
    });

    it('should return 403 if user is not SUPERADMIN', () => {
      return request(app.getHttpServer())
        .delete('/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should return 200 with deleted user if user is SUPERADMIN', () => {
      return request(app.getHttpServer())
        .delete('/users/1')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
        });
    });
  });

  describe('/users/search (GET)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/users/search?q=test')
        .expect(401);
    });

    it('should return 200 with search results if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .get('/users/search?q=test')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('/users/:id/toggle-active (PUT)', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .put('/users/1/toggle-active')
        .expect(401);
    });

    it('should return 403 if user does not have SUPERADMIN or SUPERVISOR role', () => {
      return request(app.getHttpServer())
        .put('/users/1/toggle-active')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should return 200 with updated user if authenticated and authorized', () => {
      return request(app.getHttpServer())
        .put('/users/1/toggle-active')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', '1');
          expect(response.body).toHaveProperty('isActive', false);
        });
    });
  });
});
