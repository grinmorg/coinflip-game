"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

// Тип для контекста
type ActualPriceContextType = {
  ethPrice: number | null;
  isLoading: boolean;
  error: Error | null;
};

const ETH_PRICE_KEY = "ethPrice";

// Создаем контекст
const ActualPriceContext =
  createContext<ActualPriceContextType>(
    {
      ethPrice: null,
      isLoading: false,
      error: null,
    }
  );

// Функция для получения данных из localStorage
const getCachedPrice = () => {
  if (typeof window === "undefined")
    return null;

  const cachedData =
    localStorage.getItem(ETH_PRICE_KEY);
  if (cachedData) {
    const { price, timestamp } =
      JSON.parse(cachedData);
    const now = Date.now();
    // Если данные свежие (меньше 1 минуты), возвращаем их
    if (now - timestamp < 60 * 1000) {
      return price;
    }
  }
  return null;
};

// Хук для получения курса ETH
const fetchEthPrice =
  async (): Promise<number> => {
    const cachedPrice =
      getCachedPrice();
    if (cachedPrice !== null) {
      return cachedPrice; // Возвращаем кэшированные данные, если они свежие
    }

    // Если данные устарели, делаем запрос на сервер
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();
    return data.ethereum.usd;
  };

// Провайдер контекста
export const ActualPriceContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [ethPrice, setEthPrice] =
    useState<number | null>(null);

  // Используем TanStack Query для получения данных
  const { data, isLoading, error } =
    useQuery({
      queryKey: [ETH_PRICE_KEY],
      queryFn: fetchEthPrice,
      staleTime: 60 * 1000, // Данные считаются устаревшими через 1 минуту
      refetchInterval: 60 * 1000, // Автоматическое обновление каждую минуту
    });

  // Сохраняем данные в контекст и localStorage
  useEffect(() => {
    if (data !== undefined) {
      const newData = {
        price: data,
        timestamp: Date.now(), // Сохраняем текущее время
      };
      setEthPrice(data);
      localStorage.setItem(
        ETH_PRICE_KEY,
        JSON.stringify(newData)
      );
    }
  }, [data]);

  // Восстанавливаем данные из localStorage при монтировании
  useEffect(() => {
    const cachedPrice =
      getCachedPrice();
    if (cachedPrice !== null) {
      setEthPrice(cachedPrice);
    }
  }, []);
  return (
    <ActualPriceContext.Provider
      value={{
        ethPrice,
        isLoading,
        error,
      }}>
      {children}
    </ActualPriceContext.Provider>
  );
};

// Хук для использования контекста
export function useActualPrice(): ActualPriceContextType {
  const context = useContext(
    ActualPriceContext
  );
  if (!context) {
    throw new Error(
      "useActualPrice must be used within an ActualPriceContextProvider"
    );
  }
  return context;
}
