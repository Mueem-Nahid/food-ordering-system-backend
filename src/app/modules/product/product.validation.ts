import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('Product name is required'),
    desc: z.string().nonempty('Product description is required'),
    price: z.number(),
    categoryId: z.string().nonempty('Category ID is required'),
    productImage: z.string().nonempty('Product image is required'),
    availability: z.array(z.string()).optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
};
