export type HabitCategory = 'health' | 'study' | 'hobby' | 'routine' | 'etc';

export interface Habit {
    id: string;
    title: string;
    description?: string;
    category: HabitCategory;
    isCompleted: boolean;
    streak: number;
    expReward: number;
    createdAt: string;
}
