// src/modules/coupons/dto/redeem-coupon.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemCouponDto {
  @ApiProperty({ example: 'uuid-token-here' })
  @IsNotEmpty()
  @IsString()
  qrToken!: string;
}
