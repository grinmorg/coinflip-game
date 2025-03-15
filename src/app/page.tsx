import { CoinFlipGameSection } from "./_sections/coin-flip-game";
import { PlayersListSection } from "./_sections/players-list";

export default function Home() {
  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-2 pb-10'>
        <CoinFlipGameSection />
        <PlayersListSection
          players={[
            {
              id: "1",
              nickname: "PlayerOne",
              amount: 1000,
              position: "Heads",
            },
            {
              id: "2",
              nickname: "CryptoKing",
              amount: 2500,
              position: "Tails",
            },
            {
              id: "3",
              nickname: "GameMaster",
              amount: 500,
              position: "Heads",
            },
          ]}
        />
      </div>
    </main>
  );
}
