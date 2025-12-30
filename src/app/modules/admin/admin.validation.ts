import { z } from 'zod';
import { role } from './admin.constant';

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string().nonempty('Password is required'),
    name: z.object({
      firstName: z.string().nonempty('First name is required'),
      lastName: z.string().nonempty('Last name is required'),
    }),
    phoneNumber: z.string().nonempty('Phone number is required'),
    address: z.string().nonempty('Address is required'),
    role: z.enum([...role] as [string, ...string[]]),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
};
