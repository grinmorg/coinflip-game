import apiFetch from "@/lib/api/api-fetch";
import { Setting } from "../data/schema";

export const settingsServices = {
  getAll: async (): Promise<
    Setting[]
  > => {
    const response = await apiFetch.get<
      Setting[]
    >("/setting/all");

    return response.data;
  },
  update: async (
    id: string,
    data: {
      value: string;
      description?: string;
    }
  ): Promise<Setting> => {
    const response =
      await apiFetch.patch<Setting>(
        `/setting/${id}`,
        data
      );

    return response.data;
  },
};
