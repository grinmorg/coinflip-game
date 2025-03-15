import apiFetch from "@/lib/api/api-fetch";
import { User } from "../data/schema";
import { UserMutation } from "../data/schema-mutation";

export const userServices = {
  getAll: async (): Promise<User[]> => {
    const response = await apiFetch.get<
      User[]
    >("/account/all");

    return response.data;
  },
  create: async (
    data: UserMutation
  ): Promise<User> => {
    const response =
      await apiFetch.post<User>(
        `/account/create`,
        data
      );

    return response.data;
  },
  update: async (
    id: string,
    data: UserMutation
  ): Promise<User> => {
    const response =
      await apiFetch.patch<User>(
        `/account/${id}`,
        data
      );

    return response.data;
  },
  delete: async (
    id: string
  ): Promise<string> => {
    const response =
      await apiFetch.delete<string>(
        `/account/${id}`
      );

    return response.data;
  },
};
