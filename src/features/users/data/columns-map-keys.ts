import { User } from "./schema";

export const columnsMapKeys: Partial<
  Record<keyof User, string>
> = {
  id: "ID",
  email: "Email",
  balance: "Баланс",
  role: "Роль",
  createdAt: "Дата создания",
  updatedAt:
    "Дата последнего изменения",
};
