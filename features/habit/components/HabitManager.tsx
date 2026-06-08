"use client";

import { useState } from "react";
import { useHabitStore } from "../store"
import { HabitCategory } from "../types";
import { RetroCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HabitManager() {
    const { habits, addHabit, toggleHabit, deleteHabit } = useHabitStore();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<HabitCategory>("routine");

    //습관 추가 핸들러
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addHabit(title, "", category, 10);

        setTitle("");
        setCategory("routine");
    };
    return (
        <RetroCard className="w-full max-w-md mx-auto bg-retro-bg border-4 border-black p-6 space-y-6">
            <h2 className="text-lg font-press text-retro-yellow border-b-4 border-dashed border-black pb-3">Quest 1: 습관 형성하기 🎯</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="새로운 습관을 입력하세요..."
                    className="w-full p-3 border-4 border-black bg-zinc-800 text-white placeholder-zinc-500 rounded-none outline-none focus:bg-zinc-700 font-pixel text-sm"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HabitCategory)}
                    className="w-full p-3 border-4 border-black bg-zinc-800 text-white rounded-none outline-none focus:bg-zinc-700 font-pixel text-sm"
                >
                    <option value="health">건강</option>
                    <option value="study">학습</option>
                    <option value="hobby">취미</option>
                    <option value="routine">루틴</option>
                    <option value="etc">기타</option>
                </select>

                <Button
                    type="submit"
                    variant="retroPrimary"
                    className="w-full font-press text-xs py-2">
                    습관 추가하기
                </Button>
            </form>


            <ul className="space-y-3">
                {habits.map((habit) => (
                    <li key={habit.id} className="flex items-center justify-between p-3 border-4 border-black bg-zinc-800 shadow-retro">
                        <div className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={habit.isCompleted}
                                onChange={() => {
                                    toggleHabit(habit.id);
                                }}
                                className="w-6 h-6 border-4 border-black bg-white checked:bg-retro-green appearance-none cursor-pointer rounded-none flex items-center justify-center after:content-['✓'] after:hidden checked:after:block after:text-black after:font-extrabold after:text-xs"
                            />
                            <span className={habit.isCompleted ? "line-through text-zinc-500 font-pixel text-sm" : "text-white font-pixel text-sm"}>
                                {habit.title} ({habit.category})
                            </span>
                        </div>
                        <Button
                            variant="retro"
                            onClick={() => deleteHabit(habit.id)}
                            className="bg-retro-red hover:bg-red-500 text-white text-[10px] px-2 py-1 h-auto"
                        >
                            DELETE
                        </Button>
                    </li>
                ))}
            </ul>
        </RetroCard>
    );

}