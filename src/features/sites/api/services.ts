import apiFetch from "@/lib/api/api-fetch";
import {
  Keyword,
  Site,
} from "../data/schema";
import { AxiosResponse } from "axios";

export const siteServices = {
  getAll: async (): Promise<Site[]> => {
    const response = await apiFetch.get<
      Site[]
    >("/site/all");

    return response.data;
  },

  createSite: async (postData: {
    url: string;
    keywords?: {
      text: string;
      region: string;
      maxClicks: string;
      resetDays: string;
    }[];
  }): Promise<AxiosResponse<Site>> => {
    const response =
      await apiFetch.post<Site>(
        "/site",
        postData
      );

    return response;
  },

  updateSite: async (
    id: string,
    postData: {
      url: string;
      keywords?: {
        text: string;
        region: string;
        maxClicks: string;
        resetDays: string;
      }[];
    }
  ): Promise<AxiosResponse<Site>> => {
    const response =
      await apiFetch.patch<Site>(
        `/site/${id}`,
        postData
      );

    return response;
  },

  deleteSite: async (
    id: string
  ): Promise<
    AxiosResponse<Keyword>
  > => {
    const response =
      await apiFetch.delete<Keyword>(
        `/site/${id}`
      );

    return response;
  },

  updateKeyword: async (
    id: string,
    data: {
      text: string;
      region: string;
      maxClicks: string;
      resetDays: string;
    }
  ): Promise<
    AxiosResponse<Keyword>
  > => {
    const response =
      await apiFetch.put<Keyword>(
        `/site/keyword/${id}`,
        data
      );

    return response;
  },

  deleteKeyword: async (
    id: string
  ): Promise<
    AxiosResponse<Keyword>
  > => {
    const response =
      await apiFetch.delete<Keyword>(
        `/site/keyword/${id}`
      );

    return response;
  },
};
