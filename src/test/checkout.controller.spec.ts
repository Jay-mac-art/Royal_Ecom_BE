import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from '../module/checkout/checkout.controller';
import { CheckoutService } from '../module/checkout/checkout.service';
import { CheckoutDto } from '../module/checkout/dto/checkout.dto';
import { JwtGuard } from '../guard/jwt.guard';

describe('CheckoutController', () => {
  let controller: CheckoutController;
  let service: CheckoutService;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [
        {
          provide: CheckoutService,
          useValue: {
            checkout: jest.fn(),
            checkCouponEligibility: jest.fn(),
          },
        },
      ],
    });

    moduleBuilder.overrideGuard(JwtGuard).useValue({ canActivate: () => true });

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<CheckoutController>(CheckoutController);
    service = module.get<CheckoutService>(CheckoutService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkout', () => {
    it('should perform checkout and return order details', async () => {
      const user = { userId: 1 };
      const checkoutDt: CheckoutDto = {
        cart: [{ productId: '1', name: 'Item', description: 'Test', price: 50, quantity: 2 }],
        couponCode: 'ABC123',
      };
      const result = { success: true, orderId: 1, total_amount: 90, discount_amount: 10 };
      jest.spyOn(service, 'checkout').mockResolvedValue(result);

      // Pass user directly instead of request
      const response = await controller.checkout(checkoutDt, user);
      expect(response).toBe(result);
      expect(service.checkout).toHaveBeenCalledWith(user.userId, checkoutDt);
    });
  });

  describe('checkCoupon', () => {
    it('should check coupon eligibility and return result', async () => {
      const user = { userId: 1 };
      const result = { applicable: true, coupon: { code: 'ABC123', discountPercentage: 10 } };
      jest.spyOn(service, 'checkCouponEligibility').mockResolvedValue(result);

      // Pass user directly instead of request
      const response = await controller.checkCoupon(user);
      expect(response).toBe(result);
      expect(service.checkCouponEligibility).toHaveBeenCalledWith(user.userId);
    });
  });
});