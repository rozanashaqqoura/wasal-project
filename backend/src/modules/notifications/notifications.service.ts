// src/modules/notifications/notifications.service.ts

// وظيفته: كل منطق الإشعارات
// create        → يحفظ إشعار جديد بالـ DB
// findMyUnread  → يجيب الإشعارات غير المقروءة للـ user
// markAllRead   → يخلي كل إشعاراته مقروءة

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '@modules/notifications/schemas/notification.schema';
import { CreateNotificationDto } from '@modules/notifications/dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  // بنستدعيه من CouponsService تلقائياً
  // مش من الـ controller مباشرة
  async create(dto: CreateNotificationDto): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      user: new Types.ObjectId(dto.userId),
      message: dto.message,
    });
    return notification.save();
  }

  // الأسرة تفتح التطبيق — تشوف إشعاراتها الجديدة
  // بنجيب بس اللي isRead: false
  async findMyUnread(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({
        user: new Types.ObjectId(userId),
        isRead: false,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // الأسرة تضغط "قرأت كل الإشعارات"
  // بنغير كل إشعاراتها لـ isRead: true
  async markAllRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationModel.updateMany(
      { user: new Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );
    return { updated: result.modifiedCount };
  }
}
