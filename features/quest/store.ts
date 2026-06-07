import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuestStats } from "./types";


interface QuestState extends QuestStats {
    addExp: (exp: number) => void;
    resetQuest: () => void;
}

export const useQuestStore = create<QuestState>()(
    persist(
        (set) => ({
            level: 1,
            currentExp: 0,
            nextExp: 100,
            addExp: (amount) =>
                set((state) => {
                    const totalExp = state.currentExp + amount;
                    if (totalExp >= state.nextExp) {
                        return {
                            level: state.level + 1,
                            currentExp: totalExp - state.nextExp,
                            nextExp: state.nextExp + 50,
                        };
                    } else {
                        return {
                            currentExp: Math.max(0, totalExp),
                        };
                    }

                }),
            resetQuest: () =>
                set({
                    level: 1,
                    currentExp: 0,
                    nextExp: 100,
                }),
        }),
        {
            name: "quest-storage",
        }
    )
);