"use client";

import { CoinFlip } from "@/components/animations/coin-flip";
import { UserCard } from "@/components/game/user-card";
import { COINS } from "@/components/shared/svg/coins";
import { GamesNotFoundImage } from "@/components/shared/svg/games-not-found";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import {
  CONTRACT_COIN_FLIP_ADDRESS,
  EMPTY_ADDRESS,
} from "@/lib/constants/contracts";
import useCalcPrice from "@/lib/hooks/use-calc-price";
import { PlayerSide } from "@/lib/types";
import {
  cn,
  shortenAddress,
} from "@/lib/utils";
import React from "react";
import { formatEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

interface Props {
  className?: string;
}

export const PlayersListSection: React.FC<
  Props
> = ({ className }) => {
  const { address } = useAccount();

  const [
    currentUserActiveGames,
    setCurrentUserActiveGames,
  ] = React.useState<bigint[] | null>(
    null
  );

  // Получаем список активных игр
  let {
    data: activeGames = [],
    // eslint-disable-next-line prefer-const
    isLoading: isGamesLoading,
    // eslint-disable-next-line prefer-const
    error: gamesError,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getActiveGames",
    query: {
      refetchInterval: 60 * 1000, // Автоматическое обновление каждую минуту
    },
  });

  // Игра началась
  useWatchContractEvent({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    eventName: "GameJoined",
    onLogs(logs) {
      console.log("Game joined", logs);

      const playerSecond =
        logs[0].args.player2;

      const gameId =
        logs[0].args.gameId;

      // TODO: Так же надо проверить и первого игрока
      if (playerSecond == address) {
        // Если текущий игрок это второй участник то надо показать в начале списка игр
        const findedGameId =
          activeGames.find(
            (item) => item === gameId
          );

        if (findedGameId) {
          // Фильтруем игры
          activeGames =
            activeGames.filter(
              (item) => item !== gameId
            );

          // Показываем активную
          setCurrentUserActiveGames(
            (prev) => {
              const newSet = new Set(
                prev || []
              );
              newSet.add(findedGameId);
              return Array.from(newSet);
            }
          );
        }
      }
      console.log(playerSecond);
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

  return (
    <div
      className={`grid grid-cols-3 gap-x-4 gap-y-2 items-center ${className}`}>
      {activeGames.length > 0 ? (
        <>
          {currentUserActiveGames?.map(
            (gameId) => (
              <GameCard
                key={gameId}
                gameId={gameId}
                isActiveGame
              />
            )
          )}

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
  isActiveGame?: boolean;
}> = ({
  gameId,
  isActiveGame = false,
}) => {
  const { address, isConnected } =
    useAccount();

  const { calcPriceInUSD } =
    useCalcPrice();

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

  console.log(game, isActiveGame);

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
    }
  };

  // Отображаем загрузку или ошибку для деталей игры
  if (isLoading) {
    return <SkeletonGameCard />;
  }

  if (error) {
    return (
      <div>
        Error loading game details, try
        later
      </div>
    );
  }

  if (!game) {
    return (
      <div>No game data found.</div>
    );
  }

  const playerOneAdddress = game[0][0];
  const playerTwoAdddress = game[0][1];
  const betAmount = game[2];

  const getShortenedAddressFirstPlayer =
    () => {
      console.log(playerOneAdddress);

      if (
        playerOneAdddress !=
        EMPTY_ADDRESS
      ) {
        return (
          game[1][1] ===
            PlayerSide.TAILS &&
          shortenAddress(
            playerOneAdddress
          )
        );
      }

      return (
        game[1][0] ===
          PlayerSide.TAILS &&
        shortenAddress(
          playerTwoAdddress
        )
      );
    };

  const getShortenedAddressSecondPlayer =
    () => {
      if (
        playerTwoAdddress !=
        EMPTY_ADDRESS
      ) {
        return (
          game[1][1] ===
            PlayerSide.HEADS &&
          shortenAddress(
            playerTwoAdddress
          )
        );
      }

      return shortenAddress(
        playerOneAdddress
      );
    };

  return (
    <Card
      className={cn(
        "w-full max-w-xl relative",
        isActiveGame &&
          "shadow-amber-300 shadow animate-pulse duration-[5000ms]"
      )}>
      <CardContent>
        <div className='flex items-center gap-x-2'>
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "text-xl font-medium rounded border-2 border-orange-500 p-2 uppercase",
                // getWinnderSide() ===
                //   "tails" &&
                // TODO: Убрать потом false и считать так же как и isNotSelected ниже по коду
                false &&
                  "bg-orange-500 text-white"
              )}>
              tails
            </p>
            <UserCard
              className={cn(
                !getShortenedAddressFirstPlayer() &&
                  "cursor-pointer",
                isTransactionPending &&
                  !getShortenedAddressFirstPlayer() &&
                  "pointer-events-none cursor-not-allowed opacity-30"
              )}
              username={getShortenedAddressFirstPlayer()}
              isWin={
                false
                // sideToLandOn ===
                //   "tails" && !isPlaying
              }
              isLoading={
                true
                // isPlaying
              }
              isNotSelected={
                !getShortenedAddressFirstPlayer()
              }
              onClick={() =>
                !getShortenedAddressFirstPlayer() &&
                handleJoinGame({
                  betAmount,
                  choice:
                    game[1][0] ===
                    PlayerSide.HEADS
                      ? PlayerSide.TAILS
                      : PlayerSide.HEADS,
                })
              }
            />
          </div>

          <div className='max-w-[200px] sm:max-w-[400px] sm:max-h-[400px] overflow-hidden'>
            <CoinFlip
              triggerFlip={
                true
                // flipTrigger
              }
              // onComplete={
              //   handleComplete
              // }
            />
          </div>
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "text-xl font-medium rounded border-2 border-teal-500 p-2 uppercase",
                // getWinnderSide() ===
                //   "heads" &&
                // TODO: Убрать потом false и считать так же как и isNotSelected ниже по коду
                false &&
                  "bg-teal-500 text-white"
              )}>
              heads
            </p>
            <UserCard
              className={cn(
                !getShortenedAddressSecondPlayer() &&
                  "cursor-pointer",
                isTransactionPending &&
                  !getShortenedAddressSecondPlayer() &&
                  "pointer-events-none opacity-30"
              )}
              username={getShortenedAddressSecondPlayer()}
              isWin={
                false
                // sideToLandOn ===
                //   "heads" && !isPlaying
              }
              isLoading={true}
              isNotSelected={
                !getShortenedAddressSecondPlayer()
              }
              onClick={() =>
                !getShortenedAddressSecondPlayer() &&
                handleJoinGame({
                  betAmount,
                  choice:
                    game[1][0] ===
                    PlayerSide.HEADS
                      ? PlayerSide.TAILS
                      : PlayerSide.HEADS,
                })
              }
            />
          </div>
        </div>
        {playerOneAdddress ===
          address && (
          <div className='absolute top-0 right-1/2 translate-x-1/2 bg-purple-500 text-white font-bold px-2 py-1 rounded-b-xl'>
            Your game
          </div>
        )}

        {betAmount && (
          <div className='absolute bottom-0 right-1/2 translate-x-1/2 bg-accent text-white font-bold px-2 py-1 rounded-t-xl'>
            BET:{" "}
            {formatEther(betAmount)}{" "}
            <span className='inline-block w-2.5 h-4 -mb-0.5'>
              <COINS.ETH />
            </span>
            <span>
              {" "}
              ~{" "}
              {calcPriceInUSD(
                formatEther(betAmount)
              )}
              $
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function SkeletonGameCard() {
  return (
    <Card className='flex flex-col max-w-xl w-full min-h-[180px] gap-y-2'>
      <CardContent>
        <div className='flex justify-between gap-x-8 mb-8'>
          <Skeleton className='h-8 w-12' />
          <Skeleton className='h-8 w-12' />
        </div>
        <div className='flex justify-between gap-x-8'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-12' />
        </div>
      </CardContent>
    </Card>
  );
}
