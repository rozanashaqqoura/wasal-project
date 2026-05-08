// src/modules/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@wasal.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email!: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}
