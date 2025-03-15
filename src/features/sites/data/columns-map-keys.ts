import { Keyword } from "./schema";

export const columnsMapKeys: Partial<
  Record<keyof Keyword, string>
> = {
  id: "ID",
  siteId: "ID Сайта",
  text: "Ключевые слова",
  region: "Регион продвижения",
  maxClicks: "Колличество кликов",
  maxOnDayClicks:
    "Максимум кликов в день",
  leftClicks:
    "Осталось кликов до конца периода",
  todayClicks: "Кликов сегодня",
  createdAt: "Дата создания",
  updatedAt:
    "Дата последнего изменения",
};
