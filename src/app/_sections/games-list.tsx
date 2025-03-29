"use client";

import { GameCard } from "@/components/game/game-card";
import { Heading } from "@/components/shared/heading";
import { GamesNotFoundImage } from "@/components/shared/svg/games-not-found";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import {
  useReadContract,
  useWatchContractEvent,
} from "wagmi";

interface Props {
  className?: string;
}

export const GamesListSection: React.FC<
  Props
> = ({ className }) => {
  const queryClient = useQueryClient();

  // Получаем список активных игр
  const {
    data: activeGames = [],
    isLoading: isGamesLoading,
    error: gamesError,
    queryKey: activeGamesQueryKey,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getActiveGames",
  });

  // создали новую игру
  useWatchContractEvent({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    eventName: "GameCreated",
    onLogs() {
      // ревалидация списка игр
      queryClient.invalidateQueries({
        queryKey: activeGamesQueryKey,
      });

      // toast
      toast.success("Game created!");
    },
  });

  // Игра началась
  useWatchContractEvent({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    eventName: "GameJoined",
    onLogs() {
      // ревалидация списка игр
      queryClient.invalidateQueries({
        queryKey: activeGamesQueryKey,
        refetchType: "all",
      });
    },
  });

  // Отображаем загрузку или ошибку для списка игр
  if (isGamesLoading) {
    return (
      <div className='flex flex-col items-center'>
        <GamesNotFoundImage className='h-[150px]' />
        <p className='bg-accent px-2 py-1 rounded uppercase font-bold -mt-4'>
          Loading games...
        </p>
      </div>
    );
  }

  if (gamesError) {
    return (
      <div>
        Error loading games:{" "}
        {gamesError.message}
      </div>
    );
  }

  if (activeGames.length <= 0) {
    return (
      <div className='flex flex-col items-center'>
        <GamesNotFoundImage className='h-[150px]' />
        <p className='bg-accent px-2 py-1 rounded uppercase font-bold -mt-4'>
          No active games found...
        </p>
      </div>
    );
  }

  return (
    <section>
      <Heading
        level='h2'
        text='Active games'
        highlight='Active'
      />
      <div
        className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-center ${className}`}>
        {activeGames?.map((gameId) => (
          <GameCard
            key={gameId}
            gameId={gameId}
          />
        ))}
      </div>
    </section>
  );
};
