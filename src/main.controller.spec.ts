// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Configuration } from './entities/configuration.entity';
import { DiscountCode } from './entities/discountCode.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  // Mock repositories
  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: 1 })),
  };

  const mockConfigRepository = {
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        {
          provide: DataSource,
          useValue: {
            initialize: jest.fn().mockResolvedValue(null),
            getRepository: jest.fn((entity) => {
              if (entity === User) return mockUserRepository;
              if (entity === Configuration) return mockConfigRepository;
              return {};
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  describe('Database Connection', () => {
    it('should establish database connection', async () => {
      await expect(dataSource.initialize()).resolves.not.toThrow();
    });
  });

  describe('Entity Operations', () => {
    it('should create user record', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed-password',
      };

      await expect(mockUserRepository.save(newUser)).resolves.toEqual({
        ...newUser,
        id: expect.any(Number),
      });
    });

    it('should retrieve configuration entries', async () => {
      mockConfigRepository.findOne.mockResolvedValue({ key: 'test', value: 'config' });
      const config = await mockConfigRepository.findOne({ where: { key: 'test' } });
      expect(config).toHaveProperty('key', 'test');
    });
  });

  describe('Table Structure Validation', () => {
    it('should validate User entity columns', () => {
      const user = new User();
      user.username = 'test';
      user.email = 'test@test.com';
      user.password_hash = 'hash';
      
      expect(user).toHaveProperty('id', undefined);
      expect(user).toHaveProperty('username', 'test');
      expect(user).toHaveProperty('role', 'user');
    });

    it('should validate Order relationships', () => {
      const order = new Order();
      order.user = new User();
      order.order_items = [new OrderItem()];
      
      expect(order.user).toBeInstanceOf(User);
      expect(order.order_items[0]).toBeInstanceOf(OrderItem);
    });
  });
});