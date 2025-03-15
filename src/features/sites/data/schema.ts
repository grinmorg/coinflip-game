import { z } from "zod";

// Схема для объекта keyword
export const keywordSchema = z.object({
  id: z.string().uuid(), // UUID
  siteId: z.string().uuid(), // UUID
  text: z.string(), // Текст ключевого слова
  region: z.string(), // Регион
  maxClicks: z.string(),
  resetDays: z.string().regex(/^\d+d$/), // Строка в формате "Xd" (например, "7d")
  todayClicks: z
    .number()
    .int()
    .nonnegative(), // Клики за сегодня (неотрицательное целое число)
  leftClicks: z
    .number()
    .int()
    .nonnegative(), // Оставшиеся клики (неотрицательное целое число)
  maxOnDayClicks: z
    .number()
    .int()
    .nonnegative(), // Максимальное количество кликов в день (неотрицательное целое число)
  createdAt: z.string().datetime(), // Дата создания в формате ISO
  updatedAt: z.string().datetime(), // Дата обновления в формате ISO
});

export type Keyword = z.infer<
  typeof keywordSchema
>;

// Схема для основного ответа
export const siteSchema = z.object({
  id: z.string().uuid(), // UUID
  userId: z.string().uuid(), // UUID
  url: z.string().url(), // URL
  createdAt: z.string().datetime(), // Дата создания в формате ISO
  updatedAt: z.string().datetime(), // Дата обновления в формате ISO
  keywords: z.array(keywordSchema), // Массив объектов keyword
});

export type Site = z.infer<
  typeof siteSchema
>;
