import { z } from 'zod';

export const UserCreateSchema = z.object({
  firstName: z.string().min(3).max(25),
  lastName: z.string().min(3).max(25),
  emailAddress: z.string().email().array(),
  password: z.string().min(8).max(20),
});

export const UserLoginSchema = z.object({
  emailAddress: z.string().email().array(),
  password: z.string().min(8).max(20),
});

export const UserLogoutSchema = z.object({
  signInTokenId: z.string(),
});

export const RoleAssignSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'childcare_provider', 'parent', 'teacher']),
});

export const PasswordResetSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8).max(20),
});
