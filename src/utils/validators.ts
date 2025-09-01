import { z } from 'zod';

/**
 * Zod validation schemas for forms and data validation
 */

// Common validation patterns
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must be less than 50 characters');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Group schemas
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .min(2, 'Group name must be at least 2 characters long')
    .max(100, 'Group name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

export const addMemberSchema = z.object({
  email: emailSchema,
});

// Type exports for form handling
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type AddMemberFormData = z.infer<typeof addMemberSchema>;
