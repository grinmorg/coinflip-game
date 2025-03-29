"use client";

import { GameCard } from "@/components/game/game-card";
import { Heading } from "@/components/shared/heading";
import { GamesNotFoundImage } from "@/components/shared/svg/games-not-found";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  useEffect,
} from "react";
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

  const [
    activeGamesList,
    setActiveGamesList,
  ] = React.useState<bigint[] | null>(
    null
  );

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

  useEffect(() => {
    if (
      activeGames &&
      activeGames.length
    ) {
      setActiveGamesList(
        Array.from(activeGames)
      );
    }
  }, [activeGames]);

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

  // TODO: Перенести в last-games.tsx
  // Победитель определён
  // useWatchContractEvent({
  //   abi: CoinFlipABI,
  //   address: CONTRACT_COIN_FLIP_ADDRESS,
  //   eventName: "GameResolved",
  //   onLogs(logs) {
  //     console.log("GameResolved", logs);
  //     const gameId =
  //       logs[0].args.gameId;
  //     const winner =
  //       logs[0].args.winner;
  //     // const result =
  //     //   logs[0].args.result;
  //     // const amount =
  //     //   logs[0].args.amount;

  //     if (winner === address) {
  //       toast.success("You win!");
  //     }

  //     // Пытаемся найти данную игру
  //     let findedGameId =
  //       activeGames.find(
  //         (item) => item === gameId
  //       );

  //     if (!findedGameId) {
  //       findedGameId =
  //         currentUserActiveGames?.find(
  //           (item) => item === gameId
  //         );
  //     }

  //     if (findedGameId) {
  //       // Фильтруем игры
  //       setActiveGamesList((prev) => {
  //         if (!prev) return null; // Если prev === null, возвращаем null
  //         return prev.filter(
  //           (item) =>
  //             item !== findedGameId
  //         );
  //       });

  //       setCurrentUserActiveGames(
  //         (prev) => {
  //           if (!prev) return null; // Если prev === null, возвращаем null
  //           return prev.filter(
  //             (item) =>
  //               item !== findedGameId
  //           );
  //         }
  //       );

  //       // После удаления из основых - пушим в выигрышные
  //       setWinnersGames((prev) => {
  //         const newSet = new Set(
  //           prev || []
  //         );
  //         newSet.add(findedGameId);
  //         return Array.from(newSet);
  //       });

  //       // Через 10 сек удаляем
  //       setTimeout(() => {
  //         setWinnersGames((prev) => {
  //           if (!prev) return null; // Если prev === null, возвращаем null
  //           return prev.filter(
  //             (item) =>
  //               item !== findedGameId
  //           );
  //         });
  //       }, 10000);
  //     }
  //   },
  // });

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
    <div
      className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-center ${className}`}>
      {/* {currentUserActiveGames?.map(
        (gameId) => (
          <GameCard
            key={gameId}
            gameId={gameId}
            isActiveGame
          />
        )
      )} */}
      <Heading
        level='h2'
        text='Active games'
        highlight='Active'
      />

      {activeGamesList?.map(
        (gameId) => (
          <GameCard
            key={gameId}
            gameId={gameId}
          />
        )
      )}
    </div>
  );
};
