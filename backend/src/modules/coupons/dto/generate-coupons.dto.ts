// src/modules/coupons/dto/generate-coupons.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Matches } from 'class-validator';

export class GenerateCouponsDto {
  @ApiProperty({
    example: '2025-05',
    description: 'Month in YYYY-MM format',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Month must be in YYYY-MM format',
  })
  month!: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(1)
  value!: number;
}
