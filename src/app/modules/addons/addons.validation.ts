import { z } from 'zod';

const createAddonsZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('Addon name is required'),
    price: z.number(),
    addonImage: z.string().optional(),
  }),
});

export const AddonsValidation = {
  createAddonsZodSchema,
};
