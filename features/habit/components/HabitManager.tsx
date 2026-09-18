"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import { useHabitStore } from "../store";
import type { Habit, HabitCategory } from "../types";
import { hasCompletion, koreaDateKey, shiftDateKey, streakForHabit, weeklyProgress } from "../progress";
import { RetroCard } from "@/components/ui/card";
import PixelConfetti from "./PixelConfetti";

const categories: { value: HabitCategory; label: string }[] = [
    { value: "routine", label: "루틴" },
    { value: "health", label: "건강" },
    { value: "study", label: "학습" },
    { value: "hobby", label: "취미" },
    { value: "etc", label: "기타" },
];

function categoryLabel(category: HabitCategory) {
    return categories.find((item) => item.value === category)?.label ?? "기타";
}

function HabitRow({ habit, today, disabled, onComplete }: {
    habit: Habit;
    today: string;
    disabled: boolean;
    onComplete: () => void;
}) {
    const completions = useHabitStore((state) => state.completions);
    const editHabit = useHabitStore((state) => state.editHabit);
    const archiveHabit = useHabitStore((state) => state.archiveHabit);
    const toggleHabit = useHabitStore((state) => state.toggleHabit);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(habit.title);
    const [category, setCategory] = useState(habit.category);
    const completed = hasCompletion(completions, habit.id, today);
    const streak = streakForHabit(completions, habit.id, today);

    const save = async (event: FormEvent) => {
        event.preventDefault();
        if (await editHabit(habit.id, title, category)) setEditing(false);
    };

    return (
        <li className="border-2 border-zinc-700 bg-zinc-900 p-4 space-y-3">
            {editing ? (
                <form onSubmit={save} className="flex flex-wrap gap-2">
                    <input aria-label="습관 이름 수정" value={title} onChange={(event) => setTitle(event.target.value)}
                        maxLength={80} required className="min-w-0 grow border-2 border-zinc-600 bg-zinc-800 px-2 py-1 text-white" />
                    <select aria-label="카테고리 수정" value={category}
                        onChange={(event) => setCategory(event.target.value as HabitCategory)}
                        className="border-2 border-zinc-600 bg-zinc-800 px-2 py-1 text-white">
                        {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <button type="submit" disabled={disabled} className="border-2 border-black bg-retro-green px-3 py-1 text-black disabled:opacity-50">저장</button>
                    <button type="button" onClick={() => { setTitle(habit.title); setCategory(habit.category); setEditing(false); }}
                        className="px-2 text-zinc-300">취소</button>
                </form>
            ) : (
                <div className="flex items-start gap-3">
                    <input type="checkbox" aria-label={`${habit.title} 오늘 완료`} checked={completed} disabled={disabled}
                        onChange={async () => { if (await toggleHabit(habit.id, today)) onComplete(); }}
                        className="mt-1 h-6 w-6 shrink-0 accent-retro-green" />
                    <div className="min-w-0 flex-1">
                        <p className={`break-words font-pixel text-sm ${completed ? "text-zinc-400 line-through" : "text-white"}`}>{habit.title}</p>
                        <p className="mt-1 text-xs text-zinc-400">{categoryLabel(habit.category)} · 연속 {streak}일 · 완료 시 +{habit.expReward} XP</p>
                    </div>
                    <button type="button" onClick={() => setEditing(true)} className="text-xs text-retro-blue hover:underline">수정</button>
                    <button type="button" disabled={disabled} onClick={() => { void archiveHabit(habit.id); }}
                        className="text-xs text-zinc-400 hover:underline disabled:opacity-50">보관</button>
                </div>
            )}
            <div className="flex gap-1" aria-label={`${habit.title} 최근 14일 기록`}>
                {Array.from({ length: 14 }, (_, index) => {
                    const date = shiftDateKey(today, index - 13);
                    const done = hasCompletion(completions, habit.id, date);
                    return <span key={date} title={`${date}: ${done ? "완료" : "미완료"}`}
                        className={`h-3 flex-1 ${done ? "bg-retro-green" : "bg-zinc-700"}`} />;
                })}
            </div>
        </li>
    );
}

export default function HabitManager() {
    const { habits, completions, isLoading, isMutating, hasLoaded, error, addHabit, fetchData, subscribeData } = useHabitStore();
    const [today, setToday] = useState(() => koreaDateKey(new Date()));
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<HabitCategory>("routine");
    const [confettiTrigger, setConfettiTrigger] = useState(0);

    useEffect(() => {
        void fetchData();
        const timer = window.setInterval(() => setToday(koreaDateKey(new Date())), 30_000);
        let disposed = false;
        let unsubscribe: (() => void) | undefined;
        void supabase.auth.getUser().then(({ data: { user } }) => {
            if (!disposed && user) unsubscribe = subscribeData(user.id);
        });
        return () => { disposed = true; window.clearInterval(timer); unsubscribe?.(); };
    }, [fetchData, subscribeData]);

    const active = habits.filter((habit) => !habit.archivedAt);
    const archived = habits.filter((habit) => habit.archivedAt);
    const completedToday = active.filter((habit) => hasCompletion(completions, habit.id, today)).length;
    const week = weeklyProgress(habits, completions, today);
    const weeklyCompleted = week.reduce((sum, day) => sum + day.completed, 0);
    const weeklyPossible = week.reduce((sum, day) => sum + day.eligible, 0);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (await addHabit(title, category)) {
            setTitle("");
            setCategory("routine");
        }
    };

    return (
        <div className="space-y-6">
            <PixelConfetti trigger={confettiTrigger} />
            <RetroCard className="border-4 border-black bg-retro-bg p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-dashed border-zinc-600 pb-3">
                    <div>
                        <h2 className="font-press text-sm text-retro-yellow">오늘의 퀘스트</h2>
                        <p className="mt-2 text-xs text-zinc-400">{today} · 매일 자정(한국 시간)에 새 기록이 시작됩니다</p>
                    </div>
                    <p className="font-press text-sm text-retro-green">{completedToday} / {active.length}</p>
                </div>
                <div className="h-3 bg-zinc-700" role="progressbar" aria-label="오늘 달성률"
                    aria-valuenow={completedToday} aria-valuemin={0} aria-valuemax={active.length}>
                    <div className="h-full bg-retro-green transition-all"
                        style={{ width: `${active.length ? (completedToday / active.length) * 100 : 0}%` }} />
                </div>
                {error && <p role="alert" className="text-sm text-retro-red">{error}</p>}
                {!hasLoaded ? <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <span>{error ? "기록을 불러오지 못했습니다." : "습관을 불러오는 중…"}</span>
                    {error && !isLoading && <button type="button" onClick={() => { void fetchData(); }} className="text-retro-blue hover:underline">다시 시도</button>}
                </div>
                    : active.length === 0 ? <p className="text-sm text-zinc-400">아직 진행 중인 습관이 없습니다. 아래에서 첫 습관을 등록해 보세요.</p>
                        : <ul className="space-y-3">{active.map((habit) =>
                            <HabitRow key={habit.id} habit={habit} today={today} disabled={isLoading || isMutating}
                                onComplete={() => setConfettiTrigger((value) => value + 1)} />)}</ul>}
            </RetroCard>

            <RetroCard className="border-4 border-black bg-retro-bg p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <h2 className="font-press text-sm text-retro-yellow">지난 7일</h2>
                    <p className="text-sm text-zinc-300">{weeklyCompleted} / {weeklyPossible}회 완료</p>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {week.map((day) => <div key={day.date} className="text-center">
                        <div className="flex h-20 items-end bg-zinc-800" title={`${day.date}: ${day.completed}/${day.eligible}`}>
                            <div className="w-full bg-retro-blue" style={{ height: `${day.rate}%` }} />
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-400">{day.date.slice(5)}</p>
                        <p className="text-[10px] text-zinc-300">{day.completed}/{day.eligible}</p>
                    </div>)}
                </div>
                <p className="text-xs text-zinc-400">등록 전 날짜와 보관 후 날짜는 달성률에서 제외합니다.</p>
            </RetroCard>

            <RetroCard className="border-4 border-black bg-retro-bg p-5 sm:p-6 space-y-4">
                <h2 className="font-press text-sm text-retro-yellow">새 습관 등록</h2>
                <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                    <input aria-label="새 습관 이름" value={title} onChange={(event) => setTitle(event.target.value)}
                        placeholder="예: 영어 단어 10개 복습" maxLength={80} required
                        className="min-w-0 flex-1 border-2 border-zinc-600 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500" />
                    <select aria-label="카테고리" value={category}
                        onChange={(event) => setCategory(event.target.value as HabitCategory)}
                        className="border-2 border-zinc-600 bg-zinc-800 px-3 py-2 text-white">
                        {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <button type="submit" disabled={isLoading || isMutating} className="border-2 border-black bg-retro-yellow px-4 py-2 font-press text-xs text-black disabled:opacity-50">추가</button>
                </form>
            </RetroCard>

            {archived.length > 0 && <details className="border-2 border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-300">
                <summary className="cursor-pointer">보관한 습관 {archived.length}개</summary>
                <ul className="mt-3 space-y-2">{archived.map((habit) =>
                    <li key={habit.id} className="flex flex-wrap items-center justify-between gap-2">
                        <span>{habit.title} · 총 {completions.filter((entry) => entry.habitId === habit.id).length}회 완료</span>
                        <button type="button" disabled={isLoading || isMutating}
                            onClick={() => { void addHabit(habit.title, habit.category); }}
                            className="text-retro-blue hover:underline disabled:opacity-50">새 기록으로 다시 시작</button>
                    </li>)}</ul>
            </details>}
        </div>
    );
}
