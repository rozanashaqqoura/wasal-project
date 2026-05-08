// src/modules/notifications/notifications.module.ts

// وظيفته: يربط كل ملفات الـ notifications مع بعض
// exports: [NotificationsService] مهم جداً
// عشان CouponsService يقدر يستخدمه لما يولّد كوبون

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from '@modules/notifications/notifications.controller';
import { NotificationsService } from '@modules/notifications/notifications.service';
import {
  Notification,
  NotificationSchema,
} from '@modules/notifications/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], // ← مهم عشان CouponsModule يستخدمه
})
export class NotificationsModule {}
