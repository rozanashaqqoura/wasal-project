// src/modules/notifications/schemas/notification.schema.ts

// وظيفته: شكل الإشعار اللي بنحفظه بالـ DB
// كل إشعار مرتبط بـ user معين
// isRead بيتغير لما الأسرة تفتح الإشعار

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, versionKey: false })
export class Notification {
  // مين المستلم — ref للـ User
  // بنستخدم User مش Beneficiary عشان عنده الـ _id اللي بنحتاجه للـ JWT
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  // نص الإشعار
  @Prop({ required: true, trim: true })
  message!: string;

  // قراها الـ user؟ false = جديد، true = قرأها
  @Prop({ default: false })
  isRead!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Index على user + isRead — عشان نجيب الإشعارات غير المقروءة بسرعة
NotificationSchema.index({ user: 1, isRead: 1 });
