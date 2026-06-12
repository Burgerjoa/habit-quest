import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";



interface QuestState {
    level: number;
    currentExp: number;
    nextExp: number;
    isLoading: boolean;
    error: string | null;
    isLeveledUp: boolean;
    fetchStats: () => Promise<void>;
    addExp: (amount: number) => Promise<void>;
    resetQuest: () => Promise<void>;
    subscribeStats: (userId: string) => () => void;
    closeLevelUpModal: () => void;
}

export const useQuestStore = create<QuestState>(
    (set, get) => ({
        level: 1,
        currentExp: 0,
        nextExp: 100,
        isLoading: false,
        error: null,
        isLeveledUp: false,
        fetchStats: async () => {
            set({ isLoading: true, error: null })
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                set({ isLoading: false, error: "로그인이 필요합니다" });
                return;
            }
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            if (error) {
                set({ error: error.message, isLoading: false });
                return;
            }
            if (data) {
                set({
                    level: data.level,
                    currentExp: data.current_exp,
                    nextExp: data.next_exp,
                    isLoading: false,
                });
            }

        },
        addExp: async (amount: number) => {
            set({ isLoading: true });

            const { level, currentExp, nextExp } = get();

            let newLevel = level;
            let newExp = currentExp + amount;
            let newNextExp = nextExp;
            if (newExp >= newNextExp) {
                newLevel += 1;
                newExp -= newNextExp;
                newNextExp += 50;
            } else if (newExp < 0) {
                newExp = 0;
            }
            set({ level: newLevel, currentExp: newExp, nextExp: newNextExp });
            if (newLevel > level) {
                set({ isLeveledUp: true });
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from("profiles")
                    .update({
                        level: newLevel,
                        current_exp: newExp,
                        next_exp: newNextExp,
                    })
                    .eq("id", user.id);
                if (error) {
                    set({ error: error.message });
                }
            }
            set({ isLoading: false });
        },
        resetQuest: async () => {
            set({ isLoading: true });
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {

                const { error } = await supabase
                    .from("profiles")
                    .update({ level: 1, current_exp: 0, next_exp: 100 })
                    .eq("id", user.id);
                if (!error) {
                    set({ level: 1, currentExp: 0, nextExp: 100 });
                } else {
                    set({ error: error.message });
                }
            }
            set({ isLoading: false });
        },
        subscribeStats: (userId: string) => {
            const channel = supabase.channel(`profile-${userId}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`,

                },
                    (payload) => {
                        set({
                            level: payload.new.level,
                            currentExp: payload.new.current_exp,
                            nextExp: payload.new.next_exp,
                        });
                    })
                .subscribe()
            return () => {
                supabase.removeChannel(channel);
            };
        },

        closeLevelUpModal: () => {
            set({ isLeveledUp: false });
        },
    })
);