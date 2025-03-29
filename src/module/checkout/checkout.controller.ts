// src/checkout/checkout.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, Get } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtGuard } from '../../guard/jwt.guard';
import { User } from '../../decorator/user.decorator';

@Controller('api')
@UseGuards(JwtGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('checkout')
  @UsePipes(new ValidationPipe())
  async checkout(@Body() checkoutDto: CheckoutDto, @User() user: { userId: number }) {
    return this.checkoutService.checkout(user.userId, checkoutDto);
  }

  @Get('check-coupon')
  async checkCoupon(@User() user: { userId: number }) {
    return this.checkoutService.checkCouponEligibility(user.userId);
  }
}