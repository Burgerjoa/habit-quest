// app/page.tsx 뼈대 가이드
import HabitManager from "@/features/habit/components/HabitManager";
import PlayerStats from "@/features/quest/components/PlayerStats";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#12121a]">
      <div className="w-full max-w-2xl border-8 border-double border-retro-yellow bg-zinc-900 p-8 shadow-retro-lg space-y-8">

        <div className="text-center space-y-4 border-b-4 border-black pb-6">
          <h1 className="text-3xl md:text-4xl font-press text-retro-yellow animate-pulse tracking-wider">
            HABIT QUEST
          </h1>
          <p className="font-pixel text-retro-green text-sm">
            INSERT COIN & LOG YOUR HABITS! 🎮
          </p>
        </div>

        <div className="grid grid-cols-1  gap-6 items-start">
          <PlayerStats />
          <HabitManager />
        </div>

        <div className="text-center font-press text-[8px] text-zinc-500 pt-4 border-t-4 border-black">
          © 2026 HABIT QUEST. ALL RIGHTS RESERVED.
        </div>
      </div>
    </main>
  );
}
