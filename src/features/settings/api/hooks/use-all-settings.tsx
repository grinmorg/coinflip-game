import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ResponseError } from "@/lib/types/errors";
import { queryKeys } from "@/lib/api/query-keys";
import { settingsServices } from "../services";
import { Setting } from "../../data/schema";

export const useAllSettings = () => {
  return useQuery<
    Setting[],
    AxiosError<ResponseError>
  >({
    queryKey: queryKeys.settings.all,
    queryFn: settingsServices.getAll,
    retry: 1, // Повторять запрос 1 раз при ошибке
  });
};
