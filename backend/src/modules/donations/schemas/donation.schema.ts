// src/modules/donations/schemas/donation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { DonationStatus } from '@modules/donations/enums/donation-status.enum';

export type DonationDocument = Donation & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Donation {
  @Prop({
    required: true,
    trim: true,
  })
  donorName!: string;

  @Prop({
    required: true,
    trim: true,
  })
  donorPhone!: string;

  @Prop({
    required: true,
    min: 1,
  })
  amount!: number;

  @Prop({
    trim: true,
  })
  notes?: string;

  @Prop({
    type: String,
    enum: DonationStatus,
    default: DonationStatus.PENDING,
  })
  status!: DonationStatus;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
