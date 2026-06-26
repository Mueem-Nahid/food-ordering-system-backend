import { Model, Types } from 'mongoose';

export type ICoupon = {
  _id?: Types.ObjectId;
  code: string;
  isActive?: boolean;
  discountType: 'percent' | 'flat';
  discountValue: number;
  maxDiscountAmount?: number | null;
  expiresAt: Date;
  usageLimit?: number | null;
  usedCount?: number;
  minOrderValue?: number | null;
  applicableCategories?: Types.ObjectId[] | null;
  applicableProducts?: Types.ObjectId[] | null;
};

export type CouponModel = Model<ICoupon, Record<string, unknown>>;
