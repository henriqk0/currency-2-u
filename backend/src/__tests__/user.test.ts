import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';
import { Acronyms } from '../generated/prisma/enums';

vi.mock('../services/userService');

describe('User Endpoints', () => {

  const originalJWT = process.env.JWT_SECRET;
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    vi.clearAllMocks();
  });
  afterEach(() => {
    process.env.JWT_SECRET = originalJWT;
  });

  const validPostUserData = {
    email: 'test@example.com',
    password: 'password123',
    currencyInLabel: 'USD' as Acronyms,
    currencyInValue: 10,
    currencyOutLabel: 'BRL' as Acronyms, 
    currencyOutValue: 50,
    minIntervalSend: 1,
    lastSend: null,
    toSell: true,
  };
  type ValidPostData = typeof validPostUserData;
  const fieldsCreating : (keyof ValidPostData)[] = [
    "email", "password", "currencyInLabel", "currencyOutLabel", "currencyOutValue", "currencyInValue", "minIntervalSend"
  ] // to sell has a default value, than never be missing

  const validUpdateUserData = {
    email: 'test@example.com',
    currencyInLabel: 'USD' as Acronyms,
    currencyInValue: 10,
    currencyOutLabel: 'BRL' as Acronyms,
    currencyOutValue: 50,
    minIntervalSend: 1,
    lastSend: null,
    toSell: true,
  };
  type ValidUpdateData = typeof validUpdateUserData;
  const fieldsUpdating : (keyof ValidUpdateData)[] = [
    "currencyInLabel", "currencyOutLabel", "currencyOutValue", "currencyInValue", "minIntervalSend", "toSell"
  ]

  const createTestToken = (id: string) => {
    return jwt.sign({ id }, "test-secret");
  };

  describe('POST /api/users/', () => {
    it('should create a user successfully', async () => {
      vi.mocked(UserService.prototype.createUser).mockResolvedValue({ id: 'new-id', ...validPostUserData });

      const response = await request(app)
        .post('/api/users/')
        .send(validPostUserData);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('new-id');
    });

    fieldsCreating.forEach((field) => {
      it(`should return 400 for missing ${field} (Zod validation)`, async () => {
        const { [field]: _, ...incompleteData } = validPostUserData;

        const response = await request(app)
          .post('/api/users/')
          .send(incompleteData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    fieldsCreating.forEach((field) => {
      it(`should return 400 for invalid ${field} (Zod validation)`, async () => {
        const invalidData = { ...validPostUserData, [field]: -10 };
        const response = await request(app)
          .post('/api/users/')
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    it(`should return 400 for invalid toSell (Zod validation)`, async () => {
      const invalidData = { ...validPostUserData, toSell: -10 };
      const response = await request(app)
        .post('/api/users/')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user data for authorized owner', async () => {
      const userId = 'user-123';
      const token = createTestToken(userId);
      vi.mocked(UserService.prototype.getUserById).mockResolvedValue({ id: userId, ...validPostUserData });

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
    });

    it('should return 403 for access by non-owner', async () => {
      const ownerId = 'user-123';
      const strangerId = 'user-456';
      const strangerToken = createTestToken(strangerId);

      const response = await request(app)
        .get(`/api/users/${ownerId}`)
        .set('Authorization', `Bearer ${strangerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden: You can only see your own account.');
    });

    it('should return 401 for unauthorized access (no token)', async () => {
      const response = await request(app).get('/api/users/user-123');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update user successfully', async () => {
      const userId = 'user-123';
      const token = createTestToken(userId);
      const updateData = { currencyInValue: 20 };
      vi.mocked(UserService.prototype.updateUser).mockResolvedValue({ id: userId, ...validUpdateUserData, ...updateData });

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.currencyInValue).toBe(20);
    });

    fieldsUpdating.forEach((field) => {
      it(`should return 400 for invalid ${field} (Zod validation)`, async () => {
        const userId = 'user-123';
        const token = createTestToken(userId);
        const invalidData = {[ field ] : -10 }; // no field accepts negative values.

        const response = await request(app)
          .patch(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    })

    it('should return 403 for update attempt by non-owner', async () => {
      const ownerId = 'user-123';
      const strangerId = 'user-456';
      const strangerToken = createTestToken(strangerId);
      const updateData = { currencyInValue: 20 };
      vi.mocked(UserService.prototype.updateUser).mockResolvedValue({ id: ownerId, ...validUpdateUserData, ...updateData });

      const response = await request(app)
        .patch(`/api/users/${ownerId}`)
        .set('Authorization', `Bearer ${strangerToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });

    it('should return 401 for unauthorized access (no token)', async () => {
      const updateData = { currencyInValue: 20 };
      vi.mocked(UserService.prototype.updateUser).mockResolvedValue({ id: 'user-123', ...validUpdateUserData, ...updateData });

      const response = await request(app).patch('/api/users/user-123').send(updateData);
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const userId = 'user-123';
      const token = createTestToken(userId);
      vi.mocked(UserService.prototype.deleteUser).mockResolvedValue();

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('should return 403 for deletion attempt by non-owner', async () => {
      const ownerId = 'user-123';
      const strangerId = 'user-456';
      const strangerToken = createTestToken(strangerId);

      const response = await request(app)
        .delete(`/api/users/${ownerId}`)
        .set('Authorization', `Bearer ${strangerToken}`);

      expect(response.status).toBe(403);
    });
    
    it('should return 401 for unauthorized access (no token)', async () => {
      const response = await request(app).delete('/api/users/user-123');
      expect(response.status).toBe(401);
    });
  });
});
