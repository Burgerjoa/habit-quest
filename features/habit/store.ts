import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Habit, HabitCategory } from "./types";
import { useQuestStore } from "../quest/store";

interface HabitState {
    habits: Habit[];
    addHabit: (title: string, description: string, category: HabitCategory, expReward: number) => void;
    toggleHabit: (id: string) => void;
    deleteHabit: (id: string) => void;

}

export const useHabitStore = create<HabitState>()(
    persist(
        (set) => ({
            habits: [],
            addHabit: (title, description, category, expReward) =>
                set((state) => {
                    const newHabit: Habit = {
                        id: crypto.randomUUID(),
                        title,
                        description,
                        category,
                        isCompleted: false,
                        streak: 0,
                        expReward,
                        createdAt: new Date().toISOString(),
                    };
                    return { habits: [...state.habits, newHabit] };
                }),
            // 🔄 토글 함수 수정
            toggleHabit: (id) =>
                set((state) => {
                    // 2. 현재 토글하려는 습관을 배열에서 찾습니다.
                    const targetHabit = state.habits.find((h) => h.id === id);
                    if (!targetHabit) return {}; // 예외 처리
                    // 3. 다음으로 바뀔 완료 상태 (현재 완료 상태의 반대)
                    const nextCompletedState = !targetHabit.isCompleted;
                    // 4. 퀘스트 스토어의 addExp 함수를 가져옵니다.
                    const addExp = useQuestStore.getState().addExp;
                    // 🎯 [미션] 다음 완료 상태(nextCompletedState)가 참(True)이면 경험치를 더하고,
                    // 거짓(False)이면 경험치를 빼는 조건문 분기를 작성해 보세요!
                    if (nextCompletedState) {
                        // 완료됨: 경험치 획득!
                        addExp(targetHabit.expReward);
                    } else {
                        // 힌트: 완료 해제됨: 획득했던 경험치 차감!
                        // expReward 만큼 마이너스 값을 전달해야 합니다.
                        addExp(-targetHabit.expReward);
                    }
                    // 5. 변경된 완료 상태로 습관 배열을 업데이트하여 리턴합니다.
                    return {
                        habits: state.habits.map((habit) =>
                            habit.id === id
                                ? { ...habit, isCompleted: nextCompletedState }
                                : habit
                        ),
                    };
                }),
            deleteHabit: (id) =>
                set((state) => ({
                    habits: state.habits.filter((habit) => habit.id !== id),
                })),
        }),
        { name: "habit-quest-storage" }
    )
);