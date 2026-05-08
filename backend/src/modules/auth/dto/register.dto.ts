// src/modules/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Raed ' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'raed@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'raed6112000' })
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: '0599123456' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  // بيانات الأسرة — اختياري عند التسجيل
  // لأن الـ Admin ما بيحتاجها
  @ApiProperty({ example: 'shakoura Familt', required: false })
  @IsOptional()
  @IsString()
  familyName?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  familySize?: number;

  @ApiProperty({ example: 'North - Gaza', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
