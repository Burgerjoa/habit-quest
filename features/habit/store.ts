import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Habit, HabitCategory } from "./types";

interface HabitState {
    habits: Habit[];
    addHabit: (title: string, description: string, category: HabitCategory, expReward: number) => void;
    toggleHabit: (id: string) => void;
    deleteHabit: (id: string) => void;

}

export const useHabitStore = create<HabitState>()(
    persist(
        ((set) => ({
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
            toggleHabit: (id) =>
                set((state) => ({
                    habits: state.habits.map((habit) =>
                        // 1. 순회중인 습관의 ID가 인자로 들어온 ID와 같으면?
                        habit.id === id
                            ? { ...habit, isCompleted: !habit.isCompleted } // 완료 상태를 반대로 뒤집은 새 객체 리턴
                            : habit // 다르면 수정하지 않고 기존 습관 객체 그대로 리턴
                    ),
                })),
            deleteHabit: (id) =>
                set((state) => ({
                    habits: state.habits.filter((habit) => habit.id !== id),
                }))
        })),
        {
            name: "habit-quest-storage",
        }
    )
);
