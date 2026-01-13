import { z } from 'zod';

const productDetailsSchema = z.object({
  price: z.number(),
  title: z.string(),
  id: z.string(),
  src: z.string(),
  deliveryDay: z.string(),
});

const orderProductItemSchema = z.object({
  product: productDetailsSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  addons: z.array(z.any()), // Replace z.any() with a stricter schema if available
  prod_id: z.string(),
});

const createOrderZodSchema = z.object({
  body: z.object({
    product: z.array(orderProductItemSchema).nonempty('At least one product is required'),
    user: z.string().nonempty('User ID is required'),
    email: z.string().email('Valid email is required'),
    payment_status: z.string().nonempty('Payment status is required'),
    amount: z.number(),
    total_items: z.number(),
    payment_method: z.string().nonempty('Payment method is required'),
    delivery_address: z.string().nonempty('Delivery address is required'),
    phone_no: z.string().nonempty('Phone number is required'),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
