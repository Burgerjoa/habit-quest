import HabitManager from "@/features/habit/components/HabitManager";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Habit Quest</h1>
        <p className="text-xl text-gray-600 dark:text-zinc-400">레벨업 준비 완료 🎮</p>
      </div>

      {/* 🚀 우리가 만든 조각(컴포넌트)을 여기에 조립합니다! */}
      <HabitManager />
    </main>
  );
}
