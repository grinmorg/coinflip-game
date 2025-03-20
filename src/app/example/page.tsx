"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ConnectWallet } from "@/components/wagmi/connect-wallet";
import { CoinFlipABI } from "@/lib/constants/abi-coin-flip";
import { CONTRACT_COIN_FLIP_ADDRESS } from "@/lib/constants/contracts";
import { useState } from "react";
import {
  formatEther,
  parseEther,
} from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";

export default function Example() {
  const { address, isConnected } =
    useAccount();
  const {
    writeContractAsync,
    isPending: isTransactionPending,
  } = useWriteContract();

  // Состояния для UI
  const [activeTab, setActiveTab] =
    useState("create");
  const [betAmount, setBetAmount] =
    useState("0.01");
  const [choice, setChoice] =
    useState<bigint>(0n); // 0 - орёл, 1 - решка
  const [
    selectedGameId,
    setSelectedGameId,
  ] = useState<bigint | null>(null);

  // Получение активных игр
  const { data: activeGames = [] } =
    useReadContract({
      abi: CoinFlipABI,
      address:
        CONTRACT_COIN_FLIP_ADDRESS,
      functionName: "getActiveGames",
    });

  // Получение игр пользователя
  const {
    data: userGames = [],
    refetch: refetchUserGames,
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getUserGames",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  // Получение статистики платформы
  const { data: platformStats } =
    useReadContract({
      abi: CoinFlipABI,
      address:
        CONTRACT_COIN_FLIP_ADDRESS,
      functionName: "getPlatformStats",
    });

  // Получение лидерборда
  const {
    data: leaderboard = [[], []],
  } = useReadContract({
    abi: CoinFlipABI,
    address: CONTRACT_COIN_FLIP_ADDRESS,
    functionName: "getLeaderboardTop",
    args: [10n],
  });

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
      alert("Игра успешно создана!");
      setBetAmount("0.01");
      setChoice(0n);
    } catch (error) {
      console.error(
        "Ошибка при создании игры:",
        error
      );
      alert("Ошибка при создании игры");
    }
  };

  // Присоединение к игре
  const handleJoinGame = async () => {
    if (
      !isConnected ||
      !address ||
      selectedGameId === null
    )
      return;
    try {
      await writeContractAsync({
        abi: CoinFlipABI,
        address:
          CONTRACT_COIN_FLIP_ADDRESS,
        functionName: "joinGame",
        value: parseEther(betAmount),
        args: [selectedGameId, choice],
      });
      alert(
        "Вы успешно присоединились к игре!"
      );
      setSelectedGameId(null);
      setChoice(0n);
      refetchUserGames();
    } catch (error) {
      console.error(
        "Ошибка при присоединении к игре:",
        error
      );
      alert(
        "Ошибка при присоединении к игре"
      );
    }
  };

  // Форматирование адреса
  const formatAddress = (
    addr?: string
  ) =>
    addr
      ? `${addr.slice(
          0,
          6
        )}...${addr.slice(-4)}`
      : "";

  // Форматирование результата игры
  //   const formatGameResult = (
  //     result: number,
  //     resolved: boolean
  //   ) => {
  //     if (!resolved)
  //       return "Ожидание результата";
  //     return result === 0
  //       ? "Орёл"
  //       : "Решка";
  //   };

  return (
    <main className='min-h-screen '>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>
            Coin Flip
          </h1>
          <div>
            <ConnectWallet />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='create'>
              Создать игру
            </TabsTrigger>
            <TabsTrigger value='join'>
              Присоединиться
            </TabsTrigger>
            <TabsTrigger value='myGames'>
              Мои игры
            </TabsTrigger>
            <TabsTrigger value='leaderboard'>
              Лидерборд
            </TabsTrigger>
          </TabsList>

          {/* Создать игру */}
          <TabsContent value='create'>
            <Card>
              <CardHeader>
                <CardTitle>
                  Создать новую игру
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label>
                    Сумма ставки (ETH)
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
                  onValueChange={(
                    val
                  ) =>
                    setChoice(
                      BigInt(val)
                    )
                  }>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='0'
                      id='heads'
                    />
                    <Label htmlFor='heads'>
                      Орёл
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='1'
                      id='tails'
                    />
                    <Label htmlFor='tails'>
                      Решка
                    </Label>
                  </div>
                </RadioGroup>
                <Button
                  onClick={
                    handleCreateGame
                  }
                  disabled={
                    isTransactionPending
                  }>
                  {isTransactionPending
                    ? "Загрузка..."
                    : "Создать игру"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Присоединиться к игре */}
          <TabsContent value='join'>
            <Card>
              <CardHeader>
                <CardTitle>
                  Присоединиться к игре
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label>
                    Доступные игры
                  </Label>
                  {activeGames.length >
                  0 ? (
                    <ul className='space-y-2'>
                      {activeGames.map(
                        (gameId) => (
                          <li
                            key={gameId.toString()}
                            className='flex justify-between items-center'>
                            <span>
                              ID:{" "}
                              {gameId.toString()}
                            </span>
                            <Button
                              variant='outline'
                              onClick={() =>
                                setSelectedGameId(
                                  BigInt(
                                    gameId
                                  )
                                )
                              }>
                              Выбрать
                            </Button>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>
                      Нет активных игр
                    </p>
                  )}
                </div>
                {selectedGameId !==
                  null && (
                  <>
                    <RadioGroup
                      value={choice.toString()}
                      onValueChange={(
                        val
                      ) =>
                        setChoice(
                          BigInt(val)
                        )
                      }>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value='0'
                          id='join-heads'
                        />
                        <Label htmlFor='join-heads'>
                          Орёл
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value='1'
                          id='join-tails'
                        />
                        <Label htmlFor='join-tails'>
                          Решка
                        </Label>
                      </div>
                    </RadioGroup>
                    <Button
                      onClick={
                        handleJoinGame
                      }
                      disabled={
                        isTransactionPending
                      }>
                      {isTransactionPending
                        ? "Загрузка..."
                        : "Присоединиться"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Мои игры */}
          <TabsContent value='myGames'>
            <Card>
              <CardHeader>
                <CardTitle>
                  Мои игры
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userGames.length >
                0 ? (
                  <ul className='space-y-4'>
                    {userGames.map(
                      (gameId) => (
                        <li
                          key={gameId.toString()}
                          className='border p-4 rounded'>
                          <p>
                            ID:{" "}
                            {gameId.toString()}
                          </p>
                          <Button
                            variant='outline'
                            onClick={() =>
                              setSelectedGameId(
                                BigInt(
                                  gameId
                                )
                              )
                            }>
                            Обновить
                            детали
                          </Button>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>У вас нет игр</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Лидерборд */}
          <TabsContent value='leaderboard'>
            <Card>
              <CardHeader>
                <CardTitle>
                  Лидерборд
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard[0].length >
                0 ? (
                  <ul className='space-y-2'>
                    {leaderboard[0].map(
                      (addr, i) => (
                        <li
                          key={addr}
                          className='flex justify-between'>
                          <span>
                            {i + 1}.{" "}
                            {formatAddress(
                              addr
                            )}
                          </span>
                          <span>
                            Побед:{" "}
                            {leaderboard[1][
                              i
                            ].toString()}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>Лидерборд пуст</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Статистика платформы */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>
              Статистика платформы
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platformStats ? (
              <div className='grid grid-cols-3 gap-4'>
                <p>
                  Игр:{" "}
                  {platformStats[0].toString()}
                </p>
                <p>
                  Объём:{" "}
                  {formatEther(
                    platformStats[1]
                  )}{" "}
                  ETH
                </p>
                <p>
                  Комиссии:{" "}
                  {formatEther(
                    platformStats[2]
                  )}{" "}
                  ETH
                </p>
              </div>
            ) : (
              <p>
                Загрузка статистики...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
