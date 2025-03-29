import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GenerateDiscountDto, SetDiscountThresholdDto } from './dto/admin.dto';
import { JwtGuard } from '../../guard/jwt.guard';



@Controller('api/admin')
@UseGuards(JwtGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('sales-stats')
  async getSalesStats(
  ) {
    return this.adminService.getSalesStats();
  }

  @Post('set-discount-threshold')
  async setDiscountThreshold(@Body() dto: SetDiscountThresholdDto) {
    return this.adminService.setDiscountThreshold(dto);
  }

  @Post('generate-discount')
  async generateDiscount(@Body() dto: GenerateDiscountDto) {
    return this.adminService.generateDiscount(dto);
  }
}