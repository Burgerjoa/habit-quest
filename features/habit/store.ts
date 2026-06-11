import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Habit, HabitCategory } from "./types";
import { useQuestStore } from "../quest/store";
import { supabase } from "@/lib/supabase/client";

interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;

    fetchHabits: () => Promise<void>;
    addHabit: (title: string, description: string, category: HabitCategory, expReward: number) => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    subscribeHabits: (userId: string) => () => void;

}

export const useHabitStore = create<HabitState>((set, get) => ({

    habits: [],
    isLoading: false,
    error: null,


    fetchHabits: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase.from('habits').select('*')
        if (error) {
            set({ error: error.message, isLoading: false });
            return
        }
        if (data) {
            const formatted = data.map((habit) => ({
                id: habit.id,
                title: habit.title,
                description: habit.description || undefined,
                category: habit.category as HabitCategory,
                isCompleted: habit.is_completed,
                expReward: habit.exp_reward,
                streak: habit.streak,
                createdAt: habit.created_at,
            }))
            set({ habits: formatted, isLoading: false })
        }
    },

    addHabit: async (title: string, description: string, category: HabitCategory, expReward: number) => {
        set({ isLoading: true });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            set({ error: '로그인이 필요합니다.', isLoading: false });
            return
        }
        const { error } =
            await supabase.from('habits').insert({
                title,
                description,
                category,
                exp_reward: expReward,
                user_id: user.id,
            });

        if (error) {
            set({ error: error.message, isLoading: false });
            return
        }
        await get().fetchHabits();

    },

    toggleHabit: async (id: string) => {
        set({ isLoading: true });
        const targetHabit = get().habits.find((h) => h.id === id);
        if (!targetHabit) return;
        const nextCompletedState = !targetHabit.isCompleted;

        const { error } = await supabase.from('habits').update({
            is_completed: nextCompletedState,
        })
            .eq('id', id);
        if (error) {
            set({ error: error.message, isLoading: false })
            return
        }
        await get().fetchHabits();

    },

    deleteHabit: async (id) => {
        set({ isLoading: true });

        const { error } =
            await supabase
                .from('habits')
                .delete()
                .eq('id', id);
        if (error) {
            set({ error: error.message, isLoading: false });
            return;
        }
        await get().fetchHabits();
    },
    subscribeHabits: (userId: string) => {
        const channel = supabase.channel(`habit-${userId}`)
            .on('postgres_changes', {
                event: '*',
                schema: "public",
                table: "habits",
                filter: `user_id=eq.${userId}`,
            },
                (payload) => {
                    const { eventType, new: newRecord, old: oldRecord } = payload;
                    if (eventType === 'INSERT') {
                        const formattedHabit: Habit = {
                            id: newRecord.id,
                            title: newRecord.title,
                            description: newRecord.description,
                            category: newRecord.category as HabitCategory,
                            isCompleted: newRecord.is_completed,
                            expReward: newRecord.exp_reward,
                            streak: newRecord.streak,
                            createdAt: newRecord.created_at,
                        }
                        set((state) => ({
                            habits: [...state.habits, formattedHabit],
                            isLoading: false
                        }));
                    }
                    else if (eventType === 'UPDATE') {
                        const formattedHabit: Habit = {
                            id: newRecord.id,
                            title: newRecord.title,
                            description: newRecord.description,
                            category: newRecord.category as HabitCategory,
                            isCompleted: newRecord.is_completed,
                            expReward: newRecord.exp_reward,
                            streak: newRecord.streak,
                            createdAt: newRecord.created_at,
                        };
                        set((state) => ({
                            habits: state.habits.map((habit) =>
                                habit.id === formattedHabit.id ? formattedHabit : habit
                            ),
                            isLoading: false
                        }));

                    }
                    else if (eventType === 'DELETE') {
                        set((state) => ({
                            habits: state.habits.filter((habit) => habit.id !== oldRecord.id),
                            isLoading: false
                        }));
                    }




                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);



        }
    }
}))




// export const useHabitStore = create<HabitState>()(
//     persist(
//         (set) => ({
//             habits: [],
//             addHabit: (title, description, category, expReward) =>
//                 set((state) => {
//                     const newHabit: Habit = {
//                         id: crypto.randomUUID(),
//                         title,
//                         description,
//                         category,
//                         isCompleted: false,
//                         streak: 0,
//                         expReward,
//                         createdAt: new Date().toISOString(),
//                     };
//                     return { habits: [...state.habits, newHabit] };
//                 }),
//             // 🔄 토글 함수 수정
//             toggleHabit: (id) =>
//                 set((state) => {
//                     // 2. 현재 토글하려는 습관을 배열에서 찾습니다.
//                     const targetHabit = state.habits.find((h) => h.id === id);
//                     if (!targetHabit) return {}; // 예외 처리
//                     // 3. 다음으로 바뀔 완료 상태 (현재 완료 상태의 반대)
//                     const nextCompletedState = !targetHabit.isCompleted;
//                     // 4. 퀘스트 스토어의 addExp 함수를 가져옵니다.
//                     const addExp = useQuestStore.getState().addExp;
//                     // 🎯 [미션] 다음 완료 상태(nextCompletedState)가 참(True)이면 경험치를 더하고,
//                     // 거짓(False)이면 경험치를 빼는 조건문 분기를 작성해 보세요!
//                     if (nextCompletedState) {
//                         // 완료됨: 경험치 획득!
//                         addExp(targetHabit.expReward);
//                     } else {
//                         // 힌트: 완료 해제됨: 획득했던 경험치 차감!
//                         // expReward 만큼 마이너스 값을 전달해야 합니다.
//                         addExp(-targetHabit.expReward);
//                     }
//                     // 5. 변경된 완료 상태로 습관 배열을 업데이트하여 리턴합니다.
//                     return {
//                         habits: state.habits.map((habit) =>
//                             habit.id === id
//                                 ? { ...habit, isCompleted: nextCompletedState }
//                                 : habit
//                         ),
//                     };
//                 }),
//             deleteHabit: (id) =>
//                 set((state) => ({
//                     habits: state.habits.filter((habit) => habit.id !== id),
//                 })),
//         }),
//         { name: "habit-quest-storage" }
//     )
// );