
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DiscountCode } from '../../entities/discountCode.entity';
import { Configuration } from '../../entities/configuration.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/orderItem.entity';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountCode, Configuration, Order, OrderItem, User]),
  ],
  controllers: [AdminController],
  providers: [AdminService , JwtService],
})
export class AdminModule {}