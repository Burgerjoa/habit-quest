// features/quest/components/PlayerStats.tsx 뼈대 가이드
"use client";
import { RetroCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuestStore } from "../store";

export default function PlayerStats() {
    const { level, currentExp, nextExp, resetQuest } = useQuestStore();
    const expPercentage = Math.min((currentExp / nextExp) * 100, 100);

    return (
        <RetroCard className="w-full max-w-md mx-auto bg-retro-bg border-4 border-black p-6 space-y-4">
            <div className="flex justify-between items-center border-b-4 border-dashed border-black pb-3">
                <span className="font-press text-xs bg-retro-yellow text-black px-2 py-1 border-2 border-black">
                    히어로 스탯
                </span>
                <span className="font-press text-sm text-retro-yellow">
                    LV.{level}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-press">
                    <span>EXP</span>
                    <span>{currentExp}/{nextExp}</span>
                </div>
                <div className="h-6 w-full border-4 border-black bg-zinc-800 p-0.5">
                    <div
                        style={{ width: `${expPercentage}%` }}
                        className="h-full bg-retro-green transition-all duration-300"
                    />
                </div>
            </div>

            <Button
                variant="retro"
                onClick={resetQuest}
                className="w-full text-[10px] py-1 h-auto"
            >
                캐릭터 초기화
            </Button>
        </RetroCard>
    );
}
