// src/modules/coupons/coupons.module.ts

// بيستورد BeneficiariesModule عشان CouponsService بيحتاج BeneficiariesService
// BeneficiariesModule لازم يكون exports: [BeneficiariesService]

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsController } from '@modules/coupons/coupons.controller';
import { CouponsService } from '@modules/coupons/coupons.service';
import { Coupon, CouponSchema } from '@modules/coupons/schemas/coupon.schema';
import { UsersModule } from '@modules/users/users.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
