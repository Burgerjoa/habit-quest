import HabitManager from "@/features/habit/components/HabitManager";
import PlayerStats from "@/features/quest/components/PlayerStats";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#12121a] px-3 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-4xl border-4 border-retro-yellow bg-zinc-900 p-4 shadow-retro-lg space-y-8 sm:border-8 sm:p-8">
        <LogoutButton />

        <div className="text-center space-y-4 border-b-4 border-black pb-6">
          <h1 className="text-3xl md:text-4xl font-press text-retro-yellow animate-pulse tracking-wider">
            HABIT QUEST
          </h1>
          <p className="font-pixel text-retro-green text-sm">
            오늘의 습관을 기록하고, 쌓인 변화를 확인하세요.
          </p>
        </div>

        <div className="space-y-6">
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
