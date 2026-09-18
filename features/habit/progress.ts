export type Completion = { habitId: string; completedOn: string };
export type TrackedHabit = { id: string; createdAt: string; archivedAt?: string | null };

export function koreaDateKey(date: Date): string {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(date);
    const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
    return `${part("year")}-${part("month")}-${part("day")}`;
}

export function shiftDateKey(dateKey: string, days: number): string {
    const date = new Date(`${dateKey}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

export function hasCompletion(completions: Completion[], habitId: string, dateKey: string): boolean {
    return completions.some((entry) => entry.habitId === habitId && entry.completedOn === dateKey);
}

export function streakForHabit(completions: Completion[], habitId: string, today: string): number {
    const days = new Set(completions.filter((entry) => entry.habitId === habitId).map((entry) => entry.completedOn));
    let cursor = days.has(today) ? today : shiftDateKey(today, -1);
    let streak = 0;
    while (days.has(cursor)) {
        streak += 1;
        cursor = shiftDateKey(cursor, -1);
    }
    return streak;
}

export function weeklyProgress(habits: TrackedHabit[], completions: Completion[], today: string) {
    return Array.from({ length: 7 }, (_, index) => {
        const date = shiftDateKey(today, index - 6);
        const eligible = habits.filter((habit) =>
            koreaDateKey(new Date(habit.createdAt)) <= date &&
            (!habit.archivedAt || koreaDateKey(new Date(habit.archivedAt)) >= date)
        );
        const completed = eligible.filter((habit) => hasCompletion(completions, habit.id, date)).length;
        return {
            date,
            completed,
            eligible: eligible.length,
            rate: eligible.length === 0 ? 0 : Math.round((completed / eligible.length) * 100),
        };
    });
}
