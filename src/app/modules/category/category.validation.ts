import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('Category name is required'),
    categoryImage: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
};
