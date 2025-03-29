
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../module/admin/admin.controller';
import { AdminService } from '../module/admin/admin.service';
import { SetDiscountThresholdDto, GenerateDiscountDto } from '../module/admin/dto/admin.dto';
import { JwtGuard } from '../guard/jwt.guard'; 

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getSalesStats: jest.fn(),
            setDiscountThreshold: jest.fn(),
            generateDiscount: jest.fn(),
          },
        },
      ],
    });

    moduleBuilder.overrideGuard(JwtGuard).useValue({ canActivate: () => true });

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSalesStats', () => {
    it('should return sales stats from the service', async () => {
      const result: any = { 
        overallStats: { itemsCount: 10, totalAmount: 1000 }, 
        threshold: '5' 
      };
      jest.spyOn(service, 'getSalesStats').mockResolvedValue(result);

      const response = await controller.getSalesStats();
      expect(response).toBe(result);
      expect(service.getSalesStats).toHaveBeenCalled();
    });
  });

  describe('setDiscountThreshold', () => {
    it('should set discount threshold and return success message', async () => {
      const dto: SetDiscountThresholdDto = { nthOrder: 5 };
      const result = { message: 'Discount threshold updated' };
      jest.spyOn(service, 'setDiscountThreshold').mockResolvedValue(result);

      const response = await controller.setDiscountThreshold(dto);
      expect(response).toBe(result);
      expect(service.setDiscountThreshold).toHaveBeenCalledWith(dto);
    });
  });

  describe('generateDiscount', () => {
    it('should generate a discount code and return it', async () => {
      const dto: GenerateDiscountDto = { 
        userId: 1, 
        discountPercentage: 10, 
        validUntil: new Date() 
      };
      const result = { code: 'ABC123' };
      jest.spyOn(service, 'generateDiscount').mockResolvedValue(result);

      const response = await controller.generateDiscount(dto);
      expect(response).toBe(result);
      expect(service.generateDiscount).toHaveBeenCalledWith(dto);
    });
  });
});