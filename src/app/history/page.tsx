"use client";

import { GameCard } from "@/components/game/game-card";
import { Heading } from "@/components/shared/heading";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import {
  useAccount,
  useReadContract,
} from "wagmi";
import {
  useState,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Константы пагинации
const PAGE_SIZE = 6; // Количество игр на странице

export default function HistoryPage() {
  const { address, isConnected } =
    useAccount();
  const [currentPage, setCurrentPage] =
    useState(0);
  const [totalGames, setTotalGames] =
    useState(0);

  // Получение пагинированных игр пользователя
  const {
    data: paginatedGames,
    isLoading,
    isError,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName:
      "getUserGamesPaginated",
    args: [
      address!,
      BigInt(currentPage * PAGE_SIZE),
      BigInt(PAGE_SIZE),
    ],
    query: {
      enabled: isConnected,
    },
  });

  useEffect(() => {
    if (paginatedGames !== undefined) {
      setTotalGames(
        Number(paginatedGames[1])
      );
    }
  }, [paginatedGames]);

  // Обработчики пагинации
  const nextPage = () =>
    setCurrentPage((prev) => prev + 1);
  const prevPage = () =>
    setCurrentPage((prev) =>
      Math.max(prev - 1, 0)
    );

  // Проверка доступности кнопок
  const hasNextPage =
    (currentPage + 1) * PAGE_SIZE <
    totalGames;
  const hasPrevPage = currentPage > 0;

  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-2 pb-10 pt-12'>
        <Heading
          level='h1'
          text='Your games'
          highlight='games'
        />

        {isLoading ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {Array.from({
              length: PAGE_SIZE,
            }).map((_, i) => (
              <Skeleton
                key={i}
                className='h-48 w-full rounded-lg'
              />
            ))}
          </div>
        ) : isError ? (
          <p className='text-2xl font-bold text-red-600'>
            Error loading games
          </p>
        ) : paginatedGames &&
          paginatedGames[0].length >
            0 ? (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {paginatedGames[0].map(
                (id: bigint) => (
                  <GameCard
                    key={id.toString()}
                    gameId={id}
                  />
                )
              )}
            </div>

            <div className='flex justify-between items-center mt-6'>
              <Button
                onClick={prevPage}
                disabled={!hasPrevPage}
                variant='outline'>
                Previous
              </Button>

              <span className='text-sm text-gray-600'>
                Page {currentPage + 1}{" "}
                of{" "}
                {Math.ceil(
                  totalGames / PAGE_SIZE
                )}
              </span>

              <Button
                onClick={nextPage}
                disabled={!hasNextPage}
                variant='outline'>
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className='text-2xl font-bold text-gray-600'>
            No games found
          </p>
        )}
      </div>
    </main>
  );
}
