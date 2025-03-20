"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { shortenAddress } from "@/lib/utils";
import React from "react";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";

interface Props {
  className?: string;
}

export const PlayersListSection: React.FC<
  Props
> = ({ className }) => {
  // Получаем список активных игр
  const {
    data: activeGames = [],
    isLoading: isGamesLoading,
    error: gamesError,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getActiveGames",
    query: {
      refetchInterval: 60 * 1000, // Автоматическое обновление каждую минуту
    },
  });

  // Отображаем загрузку или ошибку для списка игр
  if (isGamesLoading) {
    return <div>Loading games...</div>;
  }

  if (gamesError) {
    return (
      <div>
        Error loading games:{" "}
        {gamesError.message}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 items-center ${className}`}>
      <p className='text-2xl font-semibold'>
        Games list:
      </p>
      {activeGames.map((gameId) => (
        <GameCard
          key={gameId}
          gameId={gameId}
        />
      ))}
    </div>
  );
};

// Компонент для отображения карточки игры
const GameCard: React.FC<{
  gameId: bigint;
}> = ({ gameId }) => {
  // Получаем детали игры по её ID
  const {
    data: game,
    isLoading,
    error,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getGameDetails",
    args: [gameId],
  });

  // Отображаем загрузку или ошибку для деталей игры
  if (isLoading) {
    return (
      <div>Loading game details...</div>
    );
  }

  if (error) {
    return (
      <div>
        Error loading game details:{" "}
        {error.message}
      </div>
    );
  }

  if (!game) {
    return (
      <div>No game data found.</div>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-center gap-x-4'>
          <CardTitle className='text-sm font-medium rounded border-2 border-orange-500 p-2'>
            Tails
          </CardTitle>
          <CardTitle className='text-sm font-medium rounded border-2 border-teal-500 p-2'>
            Heads
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-semibold'>
              Player 1:{" "}
              {shortenAddress(
                game[0][0]
              )}
            </p>
            <p className='text-sm text-muted-foreground'>
              Bet:{" "}
              {formatEther(game[2])} ETH
            </p>
            <p className='text-sm text-muted-foreground'>
              Choice:{" "}
              {/* TODO: Тут надо убедиться что 0 - это Heads */}
              {game[1][0] === 0n
                ? "Heads"
                : "Tails"}
            </p>
          </div>
          <Button size='sm'>
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
