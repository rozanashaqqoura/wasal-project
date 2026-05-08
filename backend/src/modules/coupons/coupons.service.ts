// src/modules/coupons/coupons.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Coupon, CouponDocument } from '@modules/coupons/schemas/coupon.schema';
import { GenerateCouponsDto } from '@modules/coupons/dto/generate-coupons.dto';
import { RedeemCouponDto } from '@modules/coupons/dto/redeem-coupon.dto';
import { CouponStatus } from '@modules/coupons/enums/coupon-status.enum';
import { CouponMessages } from '@modules/coupons/enums/coupon-messages.enum';
import { UsersService } from '@modules/users/users.service';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { NotificationMessages } from '@modules/notifications/enums/notification-messages.enum';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,

    // بدل BeneficiariesService — هلق بنستخدم UsersService مباشرة
    private readonly usersService: UsersService,

    // عشان نبعت إشعار لكل أسرة لما يتولد كوبونها
    private readonly notificationsService: NotificationsService,
  ) {}

  // Admin يضغط "ولّد كوبونات هالشهر"
  // بيجيب كل الـ Users بـ role: beneficiary
  // بيولّد كوبون لكل أسرة ما عندها كوبون بهالشهر
  // بيبعت إشعار لكل أسرة اتولدلها كوبون
  async generateMonthlyCoupons(
    dto: GenerateCouponsDto,
  ): Promise<{ generated: number; skipped: number }> {
    const beneficiaries = await this.usersService.findAllBeneficiaries();

    let generated = 0;
    let skipped = 0;

    for (const beneficiary of beneficiaries) {
      // شيك إذا الأسرة عندها كوبون بهالشهر
      const exists = await this.couponModel.exists({
        user: beneficiary._id,
        month: dto.month,
      });

      if (exists) {
        skipped++;
        continue;
      }

      // ولّد كوبون جديد — user بدل beneficiary
      await this.couponModel.create({
        user: beneficiary._id,
        month: dto.month,
        qrToken: uuidv4(),
        value: dto.value,
        status: CouponStatus.ISSUED,
        redeemedAt: null,
      });

      // بعت إشعار للأسرة
      await this.notificationsService.create({
        userId: beneficiary._id.toString(),
        message: NotificationMessages.COUPON_ISSUED,
      });

      generated++;
    }

    return { generated, skipped };
  }

  // الأسرة تسكن الـ QR عند الاستلام
  // بنشيك: موجود؟ ما استخدم؟ ما انتهى؟
  // بعدين نغير الحالة لـ REDEEMED ونسجل وقت الاستلام
  // وبنبعت إشعار تأكيد للأسرة
  async redeemCoupon(dto: RedeemCouponDto): Promise<CouponDocument> {
    const coupon = await this.couponModel
      .findOne({ qrToken: dto.qrToken })
      .exec();

    if (!coupon) throw new NotFoundException(CouponMessages.NOT_FOUND);
    if (coupon.status === CouponStatus.REDEEMED)
      throw new ConflictException(CouponMessages.ALREADY_REDEEMED);
    if (coupon.status === CouponStatus.EXPIRED)
      throw new BadRequestException(CouponMessages.EXPIRED);

    coupon.status = CouponStatus.REDEEMED;
    coupon.redeemedAt = new Date();
    await coupon.save();

    // بعت إشعار تأكيد للأسرة
    await this.notificationsService.create({
      userId: coupon.user.toString(),
      message: NotificationMessages.COUPON_REDEEMED,
    });

    return coupon;
  }

  // الأسرة تشوف كوبوناتها — بنستخدم userId من الـ JWT مباشرة
  async findByUser(userId: string): Promise<CouponDocument[]> {
    return this.couponModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Admin يشوف كل الكوبونات — ممكن يفلتر بالشهر
  async findAll(month?: string): Promise<CouponDocument[]> {
    const filter = month ? { month } : {};
    return this.couponModel
      .find(filter)
      .populate('user', 'name phone familyName address')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Stats للـ Admin Dashboard
  async getStats(month: string): Promise<{
    total: number;
    issued: number;
    redeemed: number;
    expired: number;
  }> {
    const result = await this.couponModel.aggregate([
      { $match: { month } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const stats = { total: 0, issued: 0, redeemed: 0, expired: 0 };

    result.forEach((item: { _id: CouponStatus; count: number }) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });

    return stats;
  }
}
