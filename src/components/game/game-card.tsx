import React from "react";
import {
  Card,
  CardContent,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatEther } from "viem";
import { COINS } from "../shared/svg/coins";
import { PlayerSide } from "@/lib/types";
import {
  cn,
  shortenAddress,
} from "@/lib/utils";
import { UserCard } from "./user-card";
import { CoinFlip } from "../animations/coin-flip";
import {
  CONTRACT_COIN_FLIP_ADDRESS,
  EMPTY_ADDRESS,
} from "@/lib/constants/contracts";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import useCalcPrice from "@/lib/hooks/use-calc-price";

interface Props {
  gameId: bigint;
  isActiveGame?: boolean;
}

export const GameCard: React.FC<
  Props
> = ({
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

  const showLoadingState =
    !gameResolved &&
    playerOneAdddress !==
      EMPTY_ADDRESS &&
    playerTwoAdddress !== EMPTY_ADDRESS;

  const isWinnerTails =
    gameResolved &&
    gameWinner == PlayerSide.TAILS;

  const isWinnerHeads =
    gameResolved &&
    gameWinner == PlayerSide.HEADS;

  return (
    <Card
      className={cn(
        "w-full max-w-xl relative",
        isActiveGame &&
          "shadow-amber-300 shadow"
      )}>
      <CardContent>
        <div className='flex items-start gap-x-2'>
          {/* Сторона TAILS */}
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "lg:text-xl font-medium rounded border-2 border-dashed border-orange-500 p-2 uppercase",
                tailsPlayer &&
                  "bg-orange-500 text-white border-solid"
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
              isWin={isWinnerTails}
              isLoading={
                showLoadingState
              }
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
          <div className='max-w-[200px] lg:max-w-[400px] lg:max-h-[400px] overflow-hidden'>
            <CoinFlip
              triggerFlip={true}
            />
          </div>

          {/* Сторона HEADS */}
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "lg:text-xl font-medium rounded border-2 border-dashed border-teal-500 p-2 uppercase",
                headsPlayer &&
                  "bg-teal-500 text-white border-solid"
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
              isWin={isWinnerHeads}
              isLoading={
                showLoadingState
              }
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
