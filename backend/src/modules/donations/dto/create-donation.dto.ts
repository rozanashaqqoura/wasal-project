// src/modules/donations/dto/create-donation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({ example: 'Yousif sh' })
  @IsNotEmpty()
  @IsString()
  donorName!: string;

  @ApiProperty({ example: '0595111153' })
  @IsNotEmpty()
  @IsString()
  donorPhone!: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({
    required: false,
    example: 'Ramadan donation',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
