"use client";

import { Heading } from "@/components/shared/heading";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { shortenAddress } from "@/lib/utils";
import { CrownIcon } from "lucide-react";
import { useReadContract } from "wagmi";

export default function LeaderboardSection() {
  // Получение лидерборда
  const {
    data: leaderboard = [[], []],
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getLeaderboardTop",
    args: [10n],
  });

  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-2 pb-10 pt-12'>
        <Heading
          level='h1'
          text='Top 10 players'
          highlight='Top'
        />

        {leaderboard[0].length > 0 ? (
          <div className='space-y-2'>
            {leaderboard[0].map(
              (addr, i) => (
                <Card key={addr}>
                  <CardContent className='flex justify-between'>
                    <div className='flex items-center gap-x-2'>
                      {i + 1 == 1 && (
                        <CrownIcon className='text-orange-500' />
                      )}
                      <span>
                        {i + 1}.{" "}
                        {shortenAddress(
                          addr
                        )}
                      </span>
                    </div>
                    <span>
                      Побед:{" "}
                      {leaderboard[1][
                        i
                      ].toString()}
                    </span>
                  </CardContent>
                </Card>
              )
            )}
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
