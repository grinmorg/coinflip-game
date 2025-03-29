import { CreateGameSection } from "./_sections/create-game";
import { GamesListSection } from "./_sections/games-list";
import { LastGamesSection } from "./_sections/last-games";

export default function Home() {
  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-2 pb-10 pt-12'>
        <div className='relative mb-20'>
          <LastGamesSection className='mb-8' />
          <CreateGameSection />
        </div>
        <GamesListSection />
      </div>
    </main>
  );
}
