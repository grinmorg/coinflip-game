import { siteSchema } from "@/features/sites/data/schema";
import { z } from "zod";

// Enum для ролей
export const userRoleEnumSchema =
  z.enum(["ADMIN", "USER"]);
export type UserRole = z.infer<
  typeof userRoleEnumSchema
>;

// Схема для объекта keyword
export const userSchema = z.object({
  id: z.string().uuid(), // UUID
  email: z.string().email(), // Электронная почта
  balance: z.string(), // Баланс
  sites: z.array(siteSchema),
  role: userRoleEnumSchema,

  createdAt: z.string().datetime(), // Дата создания в формате ISO
  updatedAt: z.string().datetime(), // Дата обновления в формате ISO
});

export type User = z.infer<
  typeof userSchema
>;
