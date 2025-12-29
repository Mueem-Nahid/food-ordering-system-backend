import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: 'Post is required',
    }),
    user: z.string({
      required_error: 'user id is required',
    }),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
};
