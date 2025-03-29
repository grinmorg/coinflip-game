"use client";
import { Heading } from "@/components/shared/heading";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { cn } from "@/lib/utils";
import React from "react";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";

interface Props {
  className?: string;
}

export const GameStatsSection: React.FC<
  Props
> = ({ className }) => {
  // Получение статистики платформы
  const { data: platformStats } =
    useReadContract({
      abi: CoinFlipABI,
      address:
        CONTRACT_COIN_FLIP_ADDRESS,
      functionName: "getPlatformStats",
    });

  if (!platformStats) return null;

  return (
    <section
      className={cn(
        "grid sm:grid-cols-2 gap-4",
        className
      )}>
      <Card>
        <CardContent>
          <Heading
            level='h2'
            text={`Games played: ${platformStats[0].toString()}`}
            highlight={platformStats[0].toString()}
            className='mb-0'
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Heading
            level='h2'
            text={`Volumes: ${formatEther(
              platformStats[1]
            )} ETH`}
            highlight={formatEther(
              platformStats[1]
            )}
            className='mb-0'
          />
        </CardContent>
      </Card>
    </section>
  );
};
