import { useQuery } from "@tanstack/react-query";
import { Site } from "../../data/schema";
import { AxiosError } from "axios";
import { ResponseError } from "@/lib/types/errors";
import { queryKeys } from "@/lib/api/query-keys";
import { siteServices } from "../services";

export const useAllSites = () => {
  return useQuery<
    Site[],
    AxiosError<ResponseError>
  >({
    queryKey: queryKeys.sites.all,
    queryFn: siteServices.getAll,
    retry: 1, // Повторять запрос 1 раз при ошибке
    refetchInterval: 1000 * 30, // Перезапрашивать каждые 30 секунд
  });
};
