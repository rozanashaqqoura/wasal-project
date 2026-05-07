// src/modules/donations/donations.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DonationsController } from '@modules/donations/donations.controller';
import { DonationsService } from '@modules/donations/donations.service';
import {
  Donation,
  DonationSchema,
} from '@modules/donations/schemas/donation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donation.name,
        schema: DonationSchema,
      },
    ]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule {}
