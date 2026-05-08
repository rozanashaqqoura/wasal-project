// src/modules/notifications/notifications.controller.ts

// وظيفته: استقبال الـ requests من الـ Frontend
// GET  /notifications/my       → الأسرة تجيب إشعاراتها غير المقروءة
// PATCH /notifications/read-all → الأسرة تخلي كلها مقروءة
// مافي endpoints للـ Admin — اتفقنا إنه ما يحتاج يشوف

import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { UserRole } from '@modules/users/enums/user-role.enum';
import type { UserDocument } from '@modules/users/schemas/user.schema';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // الأسرة تفتح صفحة الإشعارات
  // بنجيب الـ userId من الـ JWT مباشرة بدون ما تبعت أي بيانات
  @Get('my')
  @Roles(UserRole.BENEFICIARY)
  @ApiOperation({ summary: 'Get my unread notifications' })
  getMyNotifications(@CurrentUser() user: UserDocument) {
    return this.notificationsService.findMyUnread(user._id.toString());
  }

  // الأسرة تضغط "مسح الإشعارات"
  // بنغير كل إشعاراتها لـ isRead: true
  @Patch('read-all')
  @Roles(UserRole.BENEFICIARY)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: UserDocument) {
    return this.notificationsService.markAllRead(user._id.toString());
  }
}
