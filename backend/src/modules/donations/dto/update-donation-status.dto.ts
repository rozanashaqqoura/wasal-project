// src/modules/donations/dto/update-donation-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { DonationStatus } from '@modules/donations/enums/donation-status.enum';

export class UpdateDonationStatusDto {
  @ApiProperty({
    enum: DonationStatus,
    example: DonationStatus.RECEIVED,
  })
  @IsEnum(DonationStatus)
  status!: DonationStatus;
}
