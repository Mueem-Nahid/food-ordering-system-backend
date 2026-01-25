import { Model } from 'mongoose';

export type ICoupon = {
  code: string;
  isActive?: boolean;
  discountType: "percent" | "flat";
  discountValue: number;
  expiresAt: Date;
  usageLimit?: number | null;
  usedCount?: number;
  minOrderValue?: number | null;
};

export type CouponModel = Model<ICoupon, Record<string, unknown>>;
