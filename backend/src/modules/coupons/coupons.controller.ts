// src/modules/coupons/coupons.controller.ts

// مين يستخدم كل endpoint؟
// POST /coupons/generate     → Admin فقط — يولّد كوبونات الشهر
// POST /coupons/redeem       → Beneficiary فقط — تسكن QR عند الاستلام
// GET  /coupons              → Admin فقط — يشوف كل الكوبونات
// GET  /coupons/stats/:month → Admin فقط — إحصائيات شهر معين
// GET  /coupons/my           → Beneficiary فقط — كوبوناتها

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CouponsService } from '@modules/coupons/coupons.service';
import { GenerateCouponsDto } from '@modules/coupons/dto/generate-coupons.dto';
import { RedeemCouponDto } from '@modules/coupons/dto/redeem-coupon.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { UserRole } from '@modules/users/enums/user-role.enum';
import type { UserDocument } from '@modules/users/schemas/user.schema';

@ApiTags('coupons')
@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // Admin يولّد كوبونات لكل الأسر بشهر معين
  @Post('generate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Generate monthly coupons for all active families' })
  generate(@Body() dto: GenerateCouponsDto) {
    return this.couponsService.generateMonthlyCoupons(dto);
  }

  // الأسرة تسكن الـ QR عند الاستلام
  @Post('redeem')
  @Roles(UserRole.ADMIN, UserRole.BENEFICIARY)
  @ApiOperation({ summary: 'Redeem a coupon by QR token' })
  redeem(@Body() dto: RedeemCouponDto) {
    return this.couponsService.redeemCoupon(dto);
  }

  // Admin يشوف كل الكوبونات — ممكن يفلتر بالشهر
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiQuery({ name: 'month', required: false, example: '2025-05' })
  findAll(@Query('month') month?: string) {
    return this.couponsService.findAll(month);
  }

  // Admin يشوف إحصائيات شهر معين
  @Get('stats/:month')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get coupon stats for a specific month' })
  getStats(@Param('month') month: string) {
    return this.couponsService.getStats(month);
  }

  // GET /coupons/my
  @Get('my')
  @Roles(UserRole.BENEFICIARY)
  @ApiOperation({ summary: 'Get my coupons' })
  getMyCoupons(@CurrentUser() user: UserDocument) {
    return this.couponsService.findByUser(user._id.toString());
  }
}
