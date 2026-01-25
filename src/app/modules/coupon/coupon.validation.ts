import { z } from "zod";

const createCouponZodSchema = z.object({
  body: z.object({
    code: z.string().nonempty("Coupon code is required"),
    isActive: z.boolean().optional(),
    discountType: z.enum(["percent", "flat"]),
    discountValue: z.number().min(0, "Discount value must be non-negative"),
    expiresAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "expiresAt must be a valid date string",
    }),
    usageLimit: z.number().int().positive().nullable().optional(),
    usedCount: z.number().int().min(0).optional(),
    minOrderValue: z.number().min(0).optional(),
  }),
});

const updateCouponZodSchema = z.object({
  body: z.object({
    code: z.string().optional(),
    isActive: z.boolean().optional(),
    discountType: z.enum(["percent", "flat"]).optional(),
    discountValue: z.number().min(0).optional(),
    expiresAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "expiresAt must be a valid date string",
    }).optional(),
    usageLimit: z.number().int().positive().nullable().optional(),
    usedCount: z.number().int().min(0).optional(),
    minOrderValue: z.number().min(0).optional(),
  }),
});

export const CouponValidation = {
  createCouponZodSchema,
  updateCouponZodSchema,
};
