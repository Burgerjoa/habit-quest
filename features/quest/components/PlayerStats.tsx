"use client";
import { useQuestStore } from "../store";

export default function PlayerStats() {
    const { level, currentExp, nextExp, resetQuest } = useQuestStore();

    const expPercentage = Math.min((currentExp / nextExp) * 100, 100);

    return (
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-xl shadow-md bg-blue-100 text-blue-800">
                    마스터 루티너
                </span>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                    Lv.{level}
                </span>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                    <span>경험치 (EXP)</span>
                    <span>{currentExp} / {nextExp} ({expPercentage.toFixed(0)}%)</span>
                </div>
                <div className="overflow-hidden h-4 text-xs flex rounded bg-blue-100 dark:bg-zinc-800">
                    <div style={{ width: `${expPercentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                    ></div>
                </div>

            </div>

            <button
                onClick={resetQuest}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition text-right">
                캐릭터 초기화 (Reset)
            </button>

        </div>
    )
}