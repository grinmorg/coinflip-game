"use client";

import { GameCard } from "@/components/game/game-card";
import { Heading } from "@/components/shared/heading";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import {
  useAccount,
  useReadContract,
} from "wagmi";

export default function HistoryPage() {
  const { address, isConnected } =
    useAccount();
  // Получение игр пользователя
  const { data: userGames = [] } =
    useReadContract({
      abi: CoinFlipABI,
      address:
        CONTRACT_COIN_FLIP_ADDRESS,
      functionName: "getUserGames",
      args: [address!],
      query: {
        enabled: isConnected,
      },
    });

  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-2 pb-10 pt-12'>
        <Heading
          level='h1'
          text='Your games'
          highlight='games'
        />

        {userGames.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {userGames.map((id) => (
              <GameCard
                key={id}
                gameId={id}
              />
            ))}
          </div>
        ) : (
          <p className='text-2xl font-bold text-gray-600'>
            Empty...
          </p>
        )}
      </div>
    </main>
  );
}
