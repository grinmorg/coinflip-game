"use client";
import { Heading } from "@/components/shared/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import React, { useState } from "react";
import { toast } from "sonner";
import { parseEther } from "viem";
import {
  useAccount,
  useWriteContract,
} from "wagmi";

interface Props {
  className?: string;
}

export const CreateGameSection: React.FC<
  Props
> = ({ className }) => {
  const { address, isConnected } =
    useAccount();

  const {
    writeContractAsync,
    isPending: isTransactionPending,
  } = useWriteContract();

  const [betAmount, setBetAmount] =
    useState("0.01");
  const [choice, setChoice] =
    useState<bigint>(0n); // 0 - орёл, 1 - решка

  // Создание игры
  const handleCreateGame = async () => {
    if (!isConnected || !address)
      return;
    try {
      await writeContractAsync({
        abi: CoinFlipABI,
        address:
          CONTRACT_COIN_FLIP_ADDRESS,
        functionName: "createGame",
        value: parseEther(betAmount),
        args: [choice],
      });
      setBetAmount("0.01");
      setChoice(0n);
    } catch (error) {
      console.error(
        "Ошибка при создании игры:",
        error
      );
      toast.error(
        "Error on create game"
      );
    }
  };

  return (
    <section className={className}>
      <Card>
        <CardContent className='flex md:flex-row flex-col items-center justify-between gap-y-4 md:gap-x-2'>
          <Heading
            level='h3'
            text='Create new game'
            highlight='Create'
            className='mb-0'
          />
          <div className='flex md:flex-row flex-col items-center gap-y-3 md:gap-x-2'>
            <div className='flex items-center gap-x-2'>
              <Label className='text-nowrap'>
                Bet amount ETH:
              </Label>
              <Input
                type='number'
                value={betAmount}
                onChange={(e) =>
                  setBetAmount(
                    e.target.value
                  )
                }
                step='0.01'
                min='0.01'
              />
            </div>
            <RadioGroup
              value={choice.toString()}
              onValueChange={(val) =>
                setChoice(BigInt(val))
              }
              className='flex items-center gap-x-2'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='0'
                  id='heads'
                />
                <Label htmlFor='heads'>
                  Heads
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='1'
                  id='tails'
                />
                <Label htmlFor='tails'>
                  Tails
                </Label>
              </div>
            </RadioGroup>
            <Button
              onClick={handleCreateGame}
              disabled={
                isTransactionPending ||
                !isConnected
              }>
              {isTransactionPending
                ? "Loading..."
                : "Create game"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
