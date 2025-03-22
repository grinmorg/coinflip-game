"use client";
import { CoinFlip } from "@/components/animations/coin-flip";
import { UserCard } from "@/components/game/user-card";
import {
  cn,
  shortenAddress,
} from "@/lib/utils";
import React, { useState } from "react";

interface Props {
  className?: string;
}

export const CoinFlipGameSection: React.FC<
  Props
> = ({ className }) => {
  const [flipTrigger, setFlipTrigger] =
    useState<boolean>(false);
  const [
    sideToLandOn,
    setSideToLandOn,
  ] = useState<"heads" | "tails">(
    "tails"
  );
  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  const handlePlayClick = () => {
    if (isPlaying) return;

    setFlipTrigger(true);
    setIsPlaying(true);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setFlipTrigger(false); // Сбрасываем триггер после завершения

    // Орёл или решка ставим только после анимации
    const side =
      Math.random() > 0.5
        ? "heads"
        : "tails";
    setSideToLandOn(side);
  };

  const getWinnderSide = () => {
    if (isPlaying) return false;
    if (sideToLandOn === "heads") {
      return "heads";
    } else {
      return "tails";
    }
  };

  return (
    <div className={className}>
      <div className='flex flex-col items-center justify-center gap-y-2 border rounded-xl max-w-xl mx-auto px-4'>
        <div className='flex items-center gap-x-2 px-2'>
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "text-xl font-medium rounded border-2 border-orange-500 p-2 uppercase",
                getWinnderSide() ===
                  "tails" &&
                  // TODO: Убрать потом false и считать так же как и isNotSelected ниже по коду
                  false &&
                  "bg-orange-500 text-white"
              )}>
              tails
            </p>
            <UserCard
              username={shortenAddress(
                "0xD3a431a9530E9167F6994842C4Eb1962edC0855c"
              )}
              isWin={
                sideToLandOn ===
                  "tails" && !isPlaying
              }
              isLoading={isPlaying}
              isNotSelected
            />
          </div>
          <button
            onClick={handlePlayClick}
            disabled={isPlaying}>
            <div className='max-w-[200px] sm:max-w-[400px] sm:max-h-[400px] overflow-hidden'>
              <CoinFlip
                triggerFlip={
                  flipTrigger
                }
                onComplete={
                  handleComplete
                }
              />
            </div>
          </button>
          <div className='flex flex-col items-center gap-y-2'>
            <p
              className={cn(
                "text-xl font-medium rounded border-2 border-teal-500 p-2 uppercase",
                getWinnderSide() ===
                  "heads" &&
                  // TODO: Убрать потом false и считать так же как и isNotSelected ниже по коду
                  false &&
                  "bg-teal-500 text-white"
              )}>
              heads
            </p>
            <UserCard
              username='You'
              isWin={
                sideToLandOn ===
                  "heads" && !isPlaying
              }
              isLoading={isPlaying}
              isNotSelected
            />
          </div>
        </div>
      </div>
    </div>
  );
};
