"use client";
import { RetroCard } from "@/components/ui/card";
import { useQuestStore } from "../store";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import LevelUpModal from "./LevelUpModal";



export default function PlayerStats() {
    const { level, currentExp, nextExp, totalExp, error, subscribeStats, fetchStats } = useQuestStore();
    const expPercentage = Math.min((currentExp / nextExp) * 100, 100);
    useEffect(() => {
        fetchStats();
        let unsubscribe: (() => void) | undefined;
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                unsubscribe = subscribeStats(user.id);
            }
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [fetchStats, subscribeStats])

    return (
        <RetroCard className="w-full bg-retro-bg border-4 border-black p-6 space-y-4">
            <div className="flex justify-between items-center border-b-4 border-dashed border-black pb-3">
                <span className="font-press text-xs bg-retro-yellow text-black px-2 py-1 border-2 border-black">
                    히어로 스탯
                </span>
                <span className="font-press text-sm text-retro-yellow">
                    LV.{level}
                </span>
            </div>
            <p className="text-xs text-zinc-400">누적 경험치 {totalExp} XP</p>
            {error && <p role="alert" className="text-sm text-retro-red">{error}</p>}

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
            <LevelUpModal />
        </RetroCard>
    );
}
