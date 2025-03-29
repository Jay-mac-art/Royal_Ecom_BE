import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../module/auth/auth.controller';
import { AuthService } from '../module/auth/auth.service';
import { RegisterDto, LoginDto } from '../module/auth/dto/auth.dto';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  // Mock AuthService with jest functions
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  // Setup the testing module before all tests
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    authService = module.get<AuthService>(AuthService);
  });

  // Cleanup after all tests
  afterAll(async () => {
    await app.close();
  });

  // Test suite for POST /auth/register
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock successful registration response
      mockAuthService.register.mockResolvedValue({ message: 'User registered successfully' });

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual({ message: 'User registered successfully' });
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return 409 if email already exists', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Mock registration failure due to duplicate email
      mockAuthService.register.mockRejectedValue(
        new ConflictException({
          statusCode: 409,
          message: 'A user with the provided email already exists.',
        }),
      );

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.message).toBe('A user with the provided email already exists.');
    });
  });

  // Test suite for POST /auth/login
  describe('POST /api/auth/login', () => {
    it('should login successfully and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock successful login response
      const mockToken = 'jwt.token.here';
      mockAuthService.login.mockResolvedValue({
        token: mockToken,
        userId: 1,
        role: 'user',
      });

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        token: mockToken,
        userId: 1,
        role: 'user',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      // Mock login failure due to invalid credentials
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});