import { z } from 'zod';

const objectIdStringSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');

const productDetailsSchema = z.object({
  price: z.number().min(0),
  title: z.string(),
  id: z.string(),
  src: z.string(),
  deliveryDay: z.string(),
});

const orderAddonItemSchema = z.object({
  addon: objectIdStringSchema.optional(),
  name: z.string(),
  price: z.number().min(0),
  quantity: z.number().min(1),
});

const orderProductItemSchema = z.object({
  product: productDetailsSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  addons: z.array(orderAddonItemSchema).default([]),
  prod_id: objectIdStringSchema,
});

const createOrderZodSchema = z.object({
  body: z.object({
    product: z
      .array(orderProductItemSchema)
      .nonempty('At least one product is required'),
    payment_status: z.string().nonempty('Payment status is required'),
    amount: z.number().min(0, 'Amount must be non-negative'),
    total_items: z.number().min(1, 'Total items must be at least 1'),
    payment_method: z.string().nonempty('Payment method is required'),
    delivery_address: z.string().nonempty('Delivery address is required'),
    delivery_fee: z.number().min(0, 'Delivery fee must be non-negative'),
    phone_no: z.string().nonempty('Phone number is required'),
    couponCode: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
