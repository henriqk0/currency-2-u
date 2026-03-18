import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { AuthService } from '../services/authService';

vi.mock('../services/authService');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and a token for valid credentials', async () => {
      const mockUser = { id: 'user-id' };
      const mockToken = 'mock-token';
      
      vi.mocked(AuthService.prototype.login).mockResolvedValue({
        token: mockToken,
        user: mockUser,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should return 401 for invalid credentials', async () => {
      vi.mocked(AuthService.prototype.login).mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 400 for missing fields (Zod validation)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          // password missing
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid email type (Zod validation)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
