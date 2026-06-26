import { z } from 'zod';

const objectIdStringSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');

const couponBaseSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  isActive: z.boolean().optional(),
  discountType: z.enum(['percent', 'flat']),
  discountValue: z.number().min(0, 'Discount value must be non-negative'),
  maxDiscountAmount: z.number().min(0).nullable().optional(),
  expiresAt: z.string().refine(val => !isNaN(Date.parse(val)) && Date.parse(val) > Date.now(), {
    message: 'expiresAt must be a valid future date string',
  }),
  usageLimit: z.number().int().positive().nullable().optional(),
  usedCount: z.number().int().min(0).nullable().optional(),
  minOrderValue: z.number().min(0).nullable().optional(),
  applicableCategories: z.array(objectIdStringSchema).nullable().optional(),
  applicableProducts: z.array(objectIdStringSchema).nullable().optional(),
});

const createCouponZodSchema = z.object({
  body: couponBaseSchema.refine(
    data => data.discountType !== 'percent' || data.discountValue <= 100,
    {
      message: 'Percent discount value cannot exceed 100',
      path: ['discountValue'],
    },
  ),
});

const updateCouponZodSchema = z.object({
  body: couponBaseSchema
    .partial()
    .refine(
      data =>
        data.discountType !== 'percent' ||
        data.discountValue === undefined ||
        data.discountValue <= 100,
      {
        message: 'Percent discount value cannot exceed 100',
        path: ['discountValue'],
      },
    ),
});

const applyCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    orderAmount: z.number().min(0, 'Order amount must be non-negative'),
    productIds: z.array(objectIdStringSchema).optional(),
    categoryIds: z.array(objectIdStringSchema).optional(),
  }),
});

export const CouponValidation = {
  createCouponZodSchema,
  updateCouponZodSchema,
  applyCouponZodSchema,
};
