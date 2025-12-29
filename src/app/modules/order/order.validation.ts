import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    product: z.array(z.string()).nonempty('At least one product is required'),
    user: z.string().nonempty('User ID is required'),
    email: z.string().email('Valid email is required'),
    paymentStatus: z.string().nonempty('Payment status is required'),
    amount: z.string().nonempty('Amount is required'),
    totalItems: z.string().nonempty('Total items is required'),
    payment_method: z.string().nonempty('Payment method is required'),
    delivery_address: z.string().nonempty('Delivery address is required'),
    phone_no: z.string().nonempty('Phone number is required'),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
