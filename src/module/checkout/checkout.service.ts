import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/orderItem.entity';
import { User } from '../../entities/user.entity';
import { CheckoutDto } from './dto/checkout.dto';
import * as crypto from 'crypto';
import { DiscountCode } from '../..//entities/discountCode.entity';
import { Configuration } from '../..//entities/configuration.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DiscountCode)
    private readonly discountCodeRepository: Repository<DiscountCode>,
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) { }

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    try {
      const { cart } = checkoutDto;

      // Fetch the user
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const couponExists = checkoutDto?.couponCode && await this.discountCodeRepository.findOneBy({ code: checkoutDto?.couponCode, used: false });

      if (checkoutDto?.couponCode && !couponExists) {
        throw new BadRequestException('Invalid coupon code.');
      }
      // Calculate total amount
      let total = 0;
      for (const item of cart) {
        total += item.price * item.quantity;
      }

      const discount_amount = couponExists
        ? total * (Number(couponExists.discount_percentage) / 100)
        : 0;
      // Create the order
      const order = this.orderRepository.create({
        user,
        total_amount: total - discount_amount,
        created_at: new Date(),
        discount_amount: discount_amount,
        order_items: cart.map(item => {
          const orderItem = new OrderItem();
          orderItem.productId = item.productId;
          orderItem.name = item.name;
          orderItem.description = item.description;
          orderItem.price = item.price;
          orderItem.quantity = item.quantity;
          return orderItem;
        }),
      });

      // Save the order
      await this.orderRepository.save(order);

      await this.discountCodeRepository.update({ code: checkoutDto?.couponCode }, { used: true });

      return {
        success: true,
        orderId: order.id,
        total_amount: total - discount_amount,
        discount_amount
      };
    } catch (error) {
      throw error;
    }
  }


  async checkCouponEligibility(userId: number) {

    try {

      //User Check
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      //Past Order
      const pastOrdersCount = await this.orderRepository.findAndCount({
        where: { user: { id: userId } },
        order: { id: 'DESC' },
      });

      //Check Already Exist Coupons 
      const alreadyHaveDiscountCoupon = await this.discountCodeRepository.findOne({
        where: { used: false },
        order: { id: 'DESC' },
      });

      if (alreadyHaveDiscountCoupon) {
        return {
          applicable: true,
          coupon: {
            code: alreadyHaveDiscountCoupon?.code,
            discountPercentage: alreadyHaveDiscountCoupon?.discount_percentage
          }
        };
      }

      //Check Coupon Threshold
      const threshold: any = await this.configurationRepository.findOneBy({ id: 1 });

      if ((pastOrdersCount?.[1] + 1) % Number(threshold?.value) === 0) {

        const couponCode = crypto.randomBytes(8).toString('hex').toUpperCase();

        const discount_percentage = Number(process.env.DISCOUNT_PERCENTAGE) || 10;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);

        //Generate Coupn 
        const newCoupon = this.discountCodeRepository.create({
          code: couponCode,
          discount_percentage,
          valid_until: validUntil,
          user,
          generated_by_order: pastOrdersCount?.[0][0],
          used: false,
        });

        await this.discountCodeRepository.save(newCoupon);
        return {
          applicable: true,
          coupon: {
            code: couponCode,
            discountPercentage: discount_percentage
          }
        };
      }

      return {
        applicable: false
      };
    } catch (error) {
      throw error;
    }
  }
}