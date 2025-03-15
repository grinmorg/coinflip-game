import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

interface Player {
  id: string;
  nickname: string;
  amount: number;
  position: "Heads" | "Tails";
}

interface Props {
  className?: string;
  players: Player[];
}

export const PlayersListSection: React.FC<
  Props
> = ({ className, players }) => {
  return (
    <div
      className={`flex flex-col gap-4 items-center ${className}`}>
      <p className='text-2xl font-semibold'>
        Games list:
      </p>
      {players.map((player, index) => (
        <Card
          key={player.id}
          className='w-full max-w-md'>
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
              {/* Варианты расположения в зависимости от индекса */}
              {index % 3 === 0 ? (
                // Ник слева, кнопка справа
                <>
                  <div>
                    <p className='font-semibold'>
                      {player.nickname}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      $
                      {player.amount.toLocaleString()}
                    </p>
                  </div>
                  <Button size='sm'>
                    Join
                  </Button>
                </>
              ) : index % 3 === 1 ? (
                // Ник с обеих сторон
                <>
                  <p className='font-semibold'>
                    {player.nickname}
                  </p>
                  <div className='text-right'>
                    <p className='font-semibold'>
                      {player.nickname}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      $
                      {player.amount.toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                // Ник справа
                <>
                  <Button size='sm'>
                    Join
                  </Button>
                  <div className='text-right'>
                    <p className='font-semibold'>
                      {player.nickname}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      $
                      {player.amount.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
