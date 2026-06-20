/**
 * Integration Tests for AuthController
 * 
 * @package SimaRukun
 * @subpackage Backend/Integration Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

// Mock database connection for integration tests
jest.mock('../../src/modules/users/users.service', () => ({
  UsersService: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashed-password',
      nama: 'Test User',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    findById: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      nama: 'Test User',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    create: jest.fn().mockResolvedValue({
      id: '1',
      email: 'new@example.com',
      nama: 'New User',
      role: 'warga',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    updateRefreshToken: jest.fn().mockResolvedValue(undefined),
    clearRefreshToken: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Mock argon2 for integration tests
jest.mock('@node-rs/argon2', () => ({
  verify: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

// Mock JWT service
jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    sign: jest.fn().mockReturnValue('test-token'),
  })),
}));

describe('AuthController (Integration Tests)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return 401 if credentials are invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrong' })
        .expect(401);
    });

    it('should return 200 with tokens if credentials are valid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body).toHaveProperty('refreshToken');
          expect(response.body).toHaveProperty('user');
          expect(response.body.user).toHaveProperty('email', 'test@example.com');
        });
    });

    it('should apply rate limiting (429 Too Many Requests)', () => {
      // Send 6 requests in a short time
      const requests = [];
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' })
        );
      }

      return Promise.all(requests).then((responses) => {
        // The last request should be rate limited
        expect(responses[5].status).toBe(429);
      });
    });
  });

  describe('/auth/register (POST)', () => {
    it('should return 409 if email already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ 
          nama: 'Existing User', 
          email: 'test@example.com', 
          password: 'password123' 
        })
        .expect(409);
    });

    it('should return 201 with tokens if registration successful', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ 
          nama: 'New User', 
          email: 'new@example.com', 
          password: 'password123' 
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body).toHaveProperty('refreshToken');
          expect(response.body).toHaveProperty('user');
        });
    });

    it('should apply rate limiting (429 Too Many Requests)', () => {
      const requests = [];
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/auth/register')
            .send({ 
              nama: `User ${i}`, 
              email: `user${i}@example.com`, 
              password: 'password123' 
            })
        );
      }

      return Promise.all(requests).then((responses) => {
        expect(responses[5].status).toBe(429);
      });
    });
  });
});
