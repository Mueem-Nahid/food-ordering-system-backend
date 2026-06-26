import { model, Schema } from 'mongoose';
import { CouponModel, ICoupon } from './coupon.interface';

export const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discountType: {
      type: String,
      enum: ['percent', 'flat'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

// Allow the same code to be reused after deactivation.
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ isActive: 1, expiresAt: 1 });

export const Coupon: CouponModel = model<ICoupon, CouponModel>(
  'Coupon',
  couponSchema,
);
