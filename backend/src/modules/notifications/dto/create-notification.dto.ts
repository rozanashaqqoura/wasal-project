// src/modules/notifications/dto/create-notification.dto.ts

// وظيفته: شكل البيانات اللي بتيجي لما نعمل إشعار جديد
// بنستخدمه داخلياً من الـ CouponsService
// مش public endpoint — الـ user ما بيعمل إشعار لحاله

import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  // مين رح يستلم الإشعار
  @IsMongoId()
  userId!: string;

  // نص الإشعار
  @IsNotEmpty()
  @IsString()
  message!: string;
}
