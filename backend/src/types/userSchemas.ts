import { z } from 'zod';
import { Acronyms } from '../generated/prisma/enums';

export const AcronymsEnum = z.enum(Acronyms);

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  currencyInLabel: AcronymsEnum,
  currencyInValue: z.number().positive("Desired currency value needs to be positive"),
  currencyOutLabel: AcronymsEnum,
  currencyOutValue: z.number().positive("Base currency value needs to be positive"),
  minIntervalSend: z.number().int().min(1, "Minimum interval must be at least 1 day"),
  toSell: z.boolean().default(true),
});

export const UpdateUserSchema = z.object({
  currencyInLabel: AcronymsEnum.optional(),
  currencyInValue: z.number().positive("Desired currency value needs to be positive").optional(),
  currencyOutLabel: AcronymsEnum.optional(),
  currencyOutValue: z.number().positive("Base currency value needs to be positive").optional(),
  minIntervalSend: z.number().int().min(1, "Minimum interval must be at least 1 day").optional(),
  toSell: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
