// req validation
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long');

const createUserZodSchema = z.object({
  body: z
    .object({
      password: passwordSchema.nonempty('password is required'),
      name: z.string().nonempty('name is required'),
      email: z.string().email('A valid email is required'),
    })
    .strict(),
});

const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Name cannot be empty').optional(),
      address: z.string().optional(),
      phoneNumber: z.string().optional(),
    })
    .strict(),
});

const googleAuthZodSchema = z.object({
  body: z
    .object({
      idToken: z.string().nonempty('Google ID token is required'),
    })
    .strict(),
});

const updateMyProfileZodSchema = z.object({
  body: z
    .object({
      name: z
        .object({
          firstName: z
            .string()
            .nonempty({ message: 'First name cannot be empty' })
            .optional(),
          lastName: z
            .string()
            .nonempty({ message: 'Last name cannot be empty' })
            .optional(),
        })
        .optional(),
      phoneNumber: z
        .string()
        .nonempty({ message: 'Phone number cannot be empty' })
        .optional(),
      address: z
        .string()
        .nonempty({ message: 'Address cannot be empty' })
        .optional(),
    })
    .strict(),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateMyProfileZodSchema,
  googleAuthZodSchema,
};
