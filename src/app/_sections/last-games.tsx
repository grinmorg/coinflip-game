"use client";

import React from "react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GameCard } from "@/components/game/game-card";
import { Heading } from "@/components/shared/heading";
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  className?: string;
}

export const LastGamesSection: React.FC<
  Props
> = ({ className }) => {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  // Получаем список активных игр
  const {
    data: gamesList = [],
    // isLoading: isGamesLoading,
    // error: gamesError,
    queryKey: gamesListQueryKey,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    args: [0n, 10n], // offset, limit
    functionName:
      "getCompletedGamesPaginated",
  });

  // победитель определился
  useWatchContractEvent({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    eventName: "GameResolved",
    onLogs(logs) {
      // ревалидация списка игр
      queryClient.invalidateQueries({
        queryKey: gamesListQueryKey,
      });

      // отображаем юзеру сообщение о победе
      const winner =
        logs[0].args.winner;

      if (winner === address) {
        toast.success("You win!");
      }
    },
  });

  if (gamesList.length <= 0) {
    return null;
  }

  return (
    <section className={className}>
      <Heading
        level='h1'
        text='Last games'
        highlight='games'
      />

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1.3,
          },
          768: {
            slidesPerView: 2.4,
          },
          1024: {
            slidesPerView: 3.5,
          },
        }}
        className='w-full'>
        {gamesList.map((game) => (
          <SwiperSlide
            key={game}
            className='py-1 ml-0.5'>
            <GameCard
              gameId={game}
              isActiveGame
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
