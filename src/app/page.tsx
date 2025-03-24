import { CoinFlipGameSection } from "./_sections/coin-flip-game";
import { GamesListSection } from "./_sections/games-list";

export default function Home() {
  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-2 pb-10'>
        <CoinFlipGameSection className='mb-4 hidden' />
        <GamesListSection />
      </div>
    </main>
  );
}
