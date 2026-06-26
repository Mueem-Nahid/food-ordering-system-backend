import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string().email('A valid email is required'),
    password: z.string().nonempty('Password is required'),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Token is required'),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
