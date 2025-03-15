import { Setting } from "./schema";

export const columnsMapKeys: Partial<
  Record<keyof Setting, string>
> = {
  description: "Описание",
  key: "Ключ",
  value: "Значение",
  createdAt: "Дата создания",
  updatedAt:
    "Дата последнего изменения",
};
