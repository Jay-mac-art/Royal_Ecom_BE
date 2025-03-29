import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountCode } from '../../entities/discountCode.entity';
import { Configuration } from '../../entities/configuration.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/orderItem.entity';
import { User } from '../../entities/user.entity';
import { GenerateDiscountDto, SetDiscountThresholdDto } from './dto/admin.dto';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(DiscountCode)
    private discountCodeRepository: Repository<DiscountCode>,
    @InjectRepository(Configuration)
    private configRepository: Repository<Configuration>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) { }

  async generateDiscount(dto: GenerateDiscountDto) {
    try {
      let user: any;
      if (dto.userId) {
        user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
          throw new BadRequestException('User not found');
        }
      }

      const pastOrdersCount = await this.orderRepository.findAndCount({
        where: { user: { id: dto.userId } },
        order: { id: 'DESC' },
      });

      const discountCode = this.discountCodeRepository.create({
        code: crypto.randomBytes(8).toString('hex').toUpperCase(),
        discount_percentage: dto.discountPercentage,
        user,
        valid_until: dto.validUntil,
        generated_by_order: pastOrdersCount?.[0][0],
      });

      await this.discountCodeRepository.save(discountCode);
      return { code: discountCode.code };
    } catch (error) {
      throw error;
    }

  }

  //set Configration what nth order coupon generation should be
  async setDiscountThreshold(dto: SetDiscountThresholdDto) {
    try {
      let config = await this.configRepository.findOne({ where: { key: 'discount_threshold' } });
      if (!config) {
        config = this.configRepository.create({
          key: 'discount_threshold',
          value: dto.nthOrder.toString(),
        });
      } else {
        config.value = dto.nthOrder.toString();
      }
      await this.configRepository.save(config);
      return { message: 'Discount threshold updated' };

    } catch (error) {
      throw error;
    }
  }

  //Get Admin Statics
  async getSalesStats() {
    // Overall statistics
    try {
      const overallStats = {
        itemsCount: await this.orderItemRepository
          .createQueryBuilder('orderItem')
          .select('SUM(orderItem.quantity)', 'sum')
          .getRawOne()
          .then(result => parseInt(result.sum) || 0),

        totalAmount: await this.orderRepository
          .createQueryBuilder('order')
          .select('SUM(order.total_amount)', 'sum')
          .getRawOne()
          .then(result => parseFloat(result.sum) || 0),

        totalDiscount: await this.orderRepository
          .createQueryBuilder('order')
          .select('SUM(order.discount_amount)', 'sum')
          .getRawOne()
          .then(result => parseFloat(result.sum) || 0),

        discountCodes: (await this.discountCodeRepository
          .createQueryBuilder('discountCode')
          .select([
            'discountCode.code',
            'discountCode.used',
            'discountCode.discount_percentage',
            'discountCode.valid_until',
            'discountCode.createdAt'
          ])
          .getMany()).map(dc => ({
            code: dc.code,
            used: dc.used,
            percentage: dc.discount_percentage,
            validUntil: dc.valid_until,
            createdAt: dc.createdAt
          })),
        // All-time coupon metrics
        couponsUsed: await this.discountCodeRepository
          .createQueryBuilder('discountCode')
          .select('COUNT(discountCode.id)', 'count')
          .where('discountCode.used = :used', { used: true })
          .getRawOne()
          .then(result => parseInt(result.count) || 0),

        couponsGenerated: await this.discountCodeRepository
          .createQueryBuilder('discountCode')
          .select('COUNT(discountCode.id)', 'count')
          .getRawOne()
          .then(result => parseInt(result.count) || 0)
      };

      const threshold = await this.configurationRepository.findOneBy({ id: 1 });

      return {
        overallStats,
        threshold: threshold?.value
      };

    } catch (error) {
      throw error;
    }
  }
}