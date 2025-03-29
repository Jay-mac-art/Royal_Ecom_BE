
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GenerateDiscountDto {
  @IsNumber()
  @Min(0)
  discountPercentage: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  validUntil?: Date;
}

export class SetDiscountThresholdDto {
  @IsNumber()
  @Min(1)
  nthOrder: number;
}