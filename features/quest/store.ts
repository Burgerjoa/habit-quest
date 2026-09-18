import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { experienceFromTotal } from "./experience";

interface QuestState {
    totalExp: number;
    level: number;
    currentExp: number;
    nextExp: number;
    hasLoaded: boolean;
    isLeveledUp: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    subscribeStats: (userId: string) => () => void;
    closeLevelUpModal: () => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
    totalExp: 0,
    level: 1,
    currentExp: 0,
    nextExp: 100,
    hasLoaded: false,
    isLeveledUp: false,
    error: null,
    fetchStats: async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            set({ totalExp: 0, level: 1, currentExp: 0, nextExp: 100, hasLoaded: false,
                isLeveledUp: false, error: authError?.message ?? "로그인이 필요합니다" });
            return;
        }
        const { data, error } = await supabase.from("profiles")
            .select("total_exp").eq("id", user.id).single();
        if (error || !data) {
            set({ error: error?.message ?? "프로필을 찾을 수 없습니다" });
            return;
        }
        const experience = experienceFromTotal(data.total_exp);
        const previous = get();
        set({
            ...experience,
            totalExp: data.total_exp,
            hasLoaded: true,
            isLeveledUp: previous.isLeveledUp || (previous.hasLoaded && experience.level > previous.level),
            error: null,
        });
    },
    subscribeStats: (userId) => {
        const channel = supabase.channel(`profile-${userId}`)
            .on("postgres_changes", {
                event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}`,
            }, () => { void get().fetchStats(); })
            .subscribe();
        return () => { void supabase.removeChannel(channel); };
    },
    closeLevelUpModal: () => set({ isLeveledUp: false }),
}));
