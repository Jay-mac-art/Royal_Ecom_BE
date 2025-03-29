import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { DiscountCode } from './entities/discountCode.entity';
import { Configuration } from './entities/configuration.entity';
import { CheckoutModule } from './module/checkout/checkout.module';
import { AdminModule } from './module/admin/admin.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME, 
      password:  process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,  
      entities: [User, Order, OrderItem, DiscountCode, Configuration],
      synchronize: true, 
    }),
    CheckoutModule,
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {}