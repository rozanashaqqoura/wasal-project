// src/modules/coupons/enums/coupon-status.enum.ts
export enum CouponStatus {
  ISSUED = 'issued', // Admin ولّده — لسا ما استلمته الأسرة
  REDEEMED = 'redeemed', // الأسرة سكنته — استلمت مساعدتها
  EXPIRED = 'expired', // انتهى الشهر وما استلمته
}
