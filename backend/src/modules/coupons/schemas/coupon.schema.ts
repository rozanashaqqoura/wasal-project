// src/modules/coupons/schemas/coupon.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CouponStatus } from '@modules/coupons/enums/coupon-status.enum';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true, versionKey: false })
export class Coupon {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  month!: string;

  @Prop({ required: true, unique: true, trim: true })
  qrToken!: string;

  @Prop({ required: true, min: 1 })
  value!: number;

  @Prop({
    type: String,
    enum: CouponStatus,
    default: CouponStatus.ISSUED,
  })
  status!: CouponStatus;

  @Prop({ type: Date, default: null })
  redeemedAt!: Date | null;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.index({ user: 1, month: 1 }, { unique: true });