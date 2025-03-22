"use client";

import { GamesNotFoundImage } from "@/components/shared/svg/games-not-found";
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
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";

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
      {activeGames.length > 0 ? (
        <>
          {activeGames.map((gameId) => (
            <GameCard
              key={gameId}
              gameId={gameId}
            />
          ))}
        </>
      ) : (
        <div className='flex flex-col items-center'>
          <GamesNotFoundImage className='h-[150px]' />
          <p className='bg-accent px-2 py-1 rounded uppercase font-bold -mt-4'>
            No active games found...
          </p>
        </div>
      )}
    </div>
  );
};

// Компонент для отображения карточки игры
const GameCard: React.FC<{
  gameId: bigint;
}> = ({ gameId }) => {
  const { address, isConnected } =
    useAccount();

  const {
    writeContractAsync,
    isPending: isTransactionPending,
  } = useWriteContract();

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

  // Присоединение к игре
  const handleJoinGame = async ({
    betAmount,
    choice,
  }: {
    betAmount: bigint;
    choice: bigint;
  }) => {
    if (!isConnected || !address)
      return;
    try {
      await writeContractAsync({
        abi: CoinFlipABI,
        address:
          CONTRACT_COIN_FLIP_ADDRESS,
        functionName: "joinGame",
        value: betAmount,
        args: [gameId, choice],
      });
    } catch (error) {
      console.error(
        "Ошибка при присоединении к игре:",
        error
      );
      alert(
        "Ошибка при присоединении к игре"
      );
    }
  };

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

  const playerOneAdddress = game[0][0];

  return (
    <Card className='w-full max-w-md relative'>
      {playerOneAdddress ===
        address && (
        <div className='absolute top-0 right-1/2 translate-x-1/2 bg-purple-500 text-white font-bold px-2 py-1 rounded-b-xl'>
          Your game
        </div>
      )}
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
                playerOneAdddress
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
          {isConnected && (
            <Button
              disabled={
                isTransactionPending ||
                playerOneAdddress ===
                  address
              }
              onClick={() =>
                handleJoinGame({
                  betAmount: game[2],
                  choice:
                    game[1][0] === 0n
                      ? 1n
                      : 0n,
                })
              }
              size='sm'>
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
