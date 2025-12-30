import { z } from 'zod';

const createPostZodSchema = z.object({
  body: z.object({
    post: z.string().nonempty('Post is required'),
    user: z.string().nonempty('user id is required'),
  }),
});

export const PostValidation = {
  createPostZodSchema,
};
