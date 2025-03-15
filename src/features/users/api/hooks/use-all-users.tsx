import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ResponseError } from "@/lib/types/errors";
import { queryKeys } from "@/lib/api/query-keys";
import { User } from "../../data/schema";
import { userServices } from "../services";

export const useAllUsers = () => {
  return useQuery<
    User[],
    AxiosError<ResponseError>
  >({
    queryKey: queryKeys.users.all,
    queryFn: userServices.getAll,
    retry: 1, // Повторять запрос 1 раз при ошибке
  });
};
