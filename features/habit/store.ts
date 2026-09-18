import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { useQuestStore } from "@/features/quest/store";
import type { Tables } from "@/lib/supabase/database.types";
import type { Completion } from "./progress";
import type { Habit, HabitCategory } from "./types";

type HabitRow = Tables<"habits">;
type CompletionRow = Tables<"habit_completions">;

interface HabitState {
    habits: Habit[];
    completions: Completion[];
    isLoading: boolean;
    isMutating: boolean;
    hasLoaded: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
    addHabit: (title: string, category: HabitCategory) => Promise<boolean>;
    editHabit: (id: string, title: string, category: HabitCategory) => Promise<boolean>;
    archiveHabit: (id: string) => Promise<boolean>;
    toggleHabit: (id: string, dateKey: string) => Promise<boolean | null>;
    subscribeData: (userId: string) => () => void;
}

const toHabit = (row: HabitRow): Habit => ({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category as HabitCategory,
    expReward: row.exp_reward,
    createdAt: row.created_at,
    archivedAt: row.archived_at,
});

const toCompletion = (row: CompletionRow): Completion => ({
    habitId: row.habit_id,
    completedOn: row.completed_on,
});

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: [],
    completions: [],
    isLoading: false,
    isMutating: false,
    hasLoaded: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            set({ habits: [], completions: [], error: authError?.message ?? "로그인이 필요합니다", isLoading: false });
            return;
        }
        const { data: habitRows, error: habitError } = await supabase.from("habits")
            .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (habitError) {
            set({ error: habitError.message, isLoading: false });
            return;
        }

        // Supabase limits a single response; page through history so long streaks stay accurate.
        const completionRows: CompletionRow[] = [];
        for (let offset = 0; ; offset += 1000) {
            const { data, error } = await supabase.from("habit_completions")
                .select("*").eq("user_id", user.id)
                .order("completed_on", { ascending: false })
                .order("habit_id", { ascending: true })
                .range(offset, offset + 999);
            if (error) {
                set({ error: error.message, isLoading: false });
                return;
            }
            completionRows.push(...(data ?? []));
            if (!data || data.length < 1000) break;
        }
        set({ habits: (habitRows ?? []).map(toHabit), completions: completionRows.map(toCompletion), isLoading: false, hasLoaded: true });
    },

    addHabit: async (title, category) => {
        const trimmed = title.trim();
        if (!trimmed || get().isMutating) return false;
        set({ isMutating: true, error: null });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            set({ error: "로그인이 필요합니다", isMutating: false });
            return false;
        }
        const { error } = await supabase.from("habits").insert({
            user_id: user.id, title: trimmed, category,
        });
        if (error) {
            set({ error: error.message, isMutating: false });
            return false;
        }
        await get().fetchData();
        set({ isMutating: false });
        return !get().error;
    },

    editHabit: async (id, title, category) => {
        const trimmed = title.trim();
        if (!trimmed || get().isMutating) return false;
        set({ isMutating: true, error: null });
        const { error } = await supabase.from("habits")
            .update({ title: trimmed, category }).eq("id", id);
        if (error) {
            set({ error: error.message, isMutating: false });
            return false;
        }
        await get().fetchData();
        set({ isMutating: false });
        return !get().error;
    },

    archiveHabit: async (id) => {
        if (get().isMutating) return false;
        set({ isMutating: true, error: null });
        const { error } = await supabase.from("habits")
            .update({ archived_at: new Date().toISOString() }).eq("id", id);
        if (error) {
            set({ error: error.message, isMutating: false });
            return false;
        }
        await get().fetchData();
        set({ isMutating: false });
        return !get().error;
    },

    toggleHabit: async (id, dateKey) => {
        if (get().isMutating) return null;
        set({ isMutating: true, error: null });
        const { data, error } = await supabase.rpc("toggle_habit_completion", {
            p_habit_id: id, p_completed_on: dateKey,
        });
        if (error) {
            set({ error: error.message, isMutating: false });
            return null;
        }
        await Promise.all([get().fetchData(), useQuestStore.getState().fetchStats()]);
        set({ isMutating: false });
        return get().error ? null : data;
    },

    subscribeData: (userId) => {
        const refresh = () => { void get().fetchData(); };
        const channel = supabase.channel(`habit-${userId}`)
            .on("postgres_changes", {
                event: "*", schema: "public", table: "habits", filter: `user_id=eq.${userId}`,
            }, refresh)
            .on("postgres_changes", {
                event: "*", schema: "public", table: "habit_completions", filter: `user_id=eq.${userId}`,
            }, refresh)
            .subscribe();
        return () => { void supabase.removeChannel(channel); };
    },
}));
