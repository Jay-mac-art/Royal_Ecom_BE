// src/checkout/dto/checkout.dto.ts
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CheckoutDto {
  @IsArray()
  cart: CartItemDto[];

  @IsString()
  @IsOptional()
  couponCode: string;
}