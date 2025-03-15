import { z } from "zod";

// Схема для объекта keyword
export const settingSchema = z.object({
  id: z.string().uuid(), // UUID
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),

  createdAt: z.string().datetime(), // Дата создания в формате ISO
  updatedAt: z.string().datetime(), // Дата обновления в формате ISO
});

export type Setting = z.infer<
  typeof settingSchema
>;
