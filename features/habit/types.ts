export type HabitCategory = 'health' | 'study' | 'hobby' | 'routine' | 'etc';

export interface Habit {
    id: string;
    title: string;
    description?: string;
    category: HabitCategory;
    expReward: number;
    createdAt: string;
    archivedAt: string | null;
}
