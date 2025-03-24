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
import React, {
  useEffect,
} from "react";
import { toast } from "sonner";
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

export const GamesListSection: React.FC<
  Props
> = ({ className }) => {
  const { address } = useAccount();

  const [
    activeGamesList,
    setActiveGamesList,
  ] = React.useState<bigint[] | null>(
    null
  );

  const [
    currentUserActiveGames,
    setCurrentUserActiveGames,
  ] = React.useState<bigint[] | null>(
    null
  );

  const [
    winnersGames,
    setWinnersGames,
  ] = React.useState<bigint[] | null>(
    null
  );

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

  // Игра началась
  useWatchContractEvent({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    eventName: "GameJoined",
    onLogs(logs) {
      console.log("Game joined", logs);

      const gameId =
        logs[0].args.gameId;

      // Логика показа активной игры
      const findedGameId =
        activeGames.find(
          (item) => item === gameId
        );

      if (findedGameId) {
        // Фильтруем игры
        setActiveGamesList((prev) => {
          if (!prev) return null; // Если prev === null, возвращаем null
          return prev.filter(
            (item) => item !== gameId
          ); // Фильтруем массив
        });

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
    },
  });

  // Победитель определён
  useWatchContractEvent({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    eventName: "GameResolved",
    onLogs(logs) {
      console.log("GameResolved", logs);
      const gameId =
        logs[0].args.gameId;
      const winner =
        logs[0].args.winner;
      // const result =
      //   logs[0].args.result;
      // const amount =
      //   logs[0].args.amount;

      if (winner === address) {
        toast.success("You win!");
      }

      // Пытаемся найти данную игру
      let findedGameId =
        activeGames.find(
          (item) => item === gameId
        );

      if (!findedGameId) {
        findedGameId =
          currentUserActiveGames?.find(
            (item) => item === gameId
          );
      }

      if (findedGameId) {
        // Фильтруем игры
        setActiveGamesList((prev) => {
          if (!prev) return null; // Если prev === null, возвращаем null
          return prev.filter(
            (item) =>
              item !== findedGameId
          );
        });

        setCurrentUserActiveGames(
          (prev) => {
            if (!prev) return null; // Если prev === null, возвращаем null
            return prev.filter(
              (item) =>
                item !== findedGameId
            );
          }
        );

        // После удаления из основых - пушим в выигрышные
        setWinnersGames((prev) => {
          const newSet = new Set(
            prev || []
          );
          newSet.add(findedGameId);
          return Array.from(newSet);
        });

        // Через 10 сек удаляем
        setTimeout(() => {
          setWinnersGames((prev) => {
            if (!prev) return null; // Если prev === null, возвращаем null
            return prev.filter(
              (item) =>
                item !== findedGameId
            );
          });
        }, 10000);
      }
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
    <div
      className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-center ${className}`}>
      {winnersGames?.map((gameId) => (
        <GameCard
          key={gameId}
          gameId={gameId}
          isActiveGame
        />
      ))}

      {currentUserActiveGames?.map(
        (gameId) => (
          <GameCard
            key={gameId}
            gameId={gameId}
            isActiveGame
          />
        )
      )}

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

  console.log(
    "game: ",
    game,
    isActiveGame
  );

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
  if (isLoading)
    return <SkeletonGameCard />;
  if (error)
    return (
      <div>
        Error loading game details, try
        later
      </div>
    );
  if (!game)
    return (
      <div>No game data found.</div>
    );

  const playerOneAdddress = game[0][0];
  const playerTwoAdddress = game[0][1];
  const betAmount = game[2];
  const gameResolved = game[3];
  const gameWinner = game[4];

  // Определение текущего пользователя
  const isCurrentUserGame =
    address === playerOneAdddress ||
    address === playerTwoAdddress;

  // Отображение имени игрока
  const getPlayerName = (
    playerAddress: string
  ) => {
    return playerAddress === address
      ? "You"
      : shortenAddress(playerAddress);
  };

  // Определение сторон игроков
  const getPlayerSide = (
    playerAddress: string,
    choice: bigint
  ): string => {
    if (playerAddress === EMPTY_ADDRESS)
      return "Empty";
    return choice === PlayerSide.HEADS
      ? "HEADS"
      : "TAILS";
  };

  const playerOneSide = getPlayerSide(
    playerOneAdddress,
    game[1][0]
  );
  const playerTwoSide = getPlayerSide(
    playerTwoAdddress,
    game[1][1]
  );

  const getSidePlayer = (
    side: string
  ): string => {
    if (playerOneSide === side)
      return getPlayerName(
        playerOneAdddress
      );
    if (playerTwoSide === side)
      return getPlayerName(
        playerTwoAdddress
      );
    return "";
  };

  const headsPlayer =
    getSidePlayer("HEADS");
  const tailsPlayer =
    getSidePlayer("TAILS");

  return (
    <Card
      className={cn(
        "w-full max-w-xl relative",
        isActiveGame &&
          "shadow-amber-300 shadow animate-pulse duration-[5000ms]"
      )}>
      <CardContent>
        <div className='flex items-start gap-x-2'>
          {/* Сторона TAILS */}
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "text-xl font-medium rounded border-2 border-orange-500 p-2 uppercase",
                tailsPlayer &&
                  "bg-orange-500 text-white"
              )}>
              tails
            </p>
            <UserCard
              className={cn(
                !tailsPlayer &&
                  !isCurrentUserGame &&
                  "cursor-pointer",
                isTransactionPending &&
                  !tailsPlayer &&
                  "pointer-events-none cursor-not-allowed opacity-30"
              )}
              username={tailsPlayer}
              isWin={
                gameResolved &&
                gameWinner ==
                  PlayerSide.TAILS
              }
              isLoading={!gameResolved}
              isNotSelected={
                !tailsPlayer
              }
              onClick={() =>
                !tailsPlayer &&
                !isCurrentUserGame &&
                handleJoinGame({
                  betAmount,
                  choice:
                    PlayerSide.TAILS,
                })
              }
            />
          </div>

          {/* Анимация подбрасывания монеты */}
          <div className='max-w-[200px] sm:max-w-[400px] sm:max-h-[400px] overflow-hidden'>
            <CoinFlip
              triggerFlip={true}
            />
          </div>

          {/* Сторона HEADS */}
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "text-xl font-medium rounded border-2 border-teal-500 p-2 uppercase",
                headsPlayer &&
                  "bg-teal-500 text-white"
              )}>
              heads
            </p>
            <UserCard
              className={cn(
                !headsPlayer &&
                  !isCurrentUserGame &&
                  "cursor-pointer",
                isTransactionPending &&
                  !headsPlayer &&
                  "pointer-events-none opacity-30"
              )}
              username={headsPlayer}
              isWin={
                gameResolved &&
                gameWinner ==
                  PlayerSide.HEADS
              }
              isLoading={!gameResolved}
              isNotSelected={
                !headsPlayer
              }
              onClick={() =>
                !headsPlayer &&
                !isCurrentUserGame &&
                handleJoinGame({
                  betAmount,
                  choice:
                    PlayerSide.HEADS,
                })
              }
            />
          </div>
        </div>

        {/* Бейдж "Your game" */}
        {playerOneAdddress ===
          address && (
          <div className='absolute top-0 right-1/2 translate-x-1/2 bg-accent text-white font-bold px-2 py-1 rounded-b-xl'>
            Your game
          </div>
        )}

        {/* Отображение суммы ставки */}
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
