import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/orderItem.entity';
import { DiscountCode } from '../../entities/discountCode.entity';
import { Configuration } from '../../entities/configuration.entity';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Order, OrderItem, DiscountCode, Configuration , User]),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService , JwtService],
})
export class CheckoutModule {}