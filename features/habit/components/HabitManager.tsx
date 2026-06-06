"use client";

import { useState } from "react";
import { useHabitStore } from "../store"
import { HabitCategory } from "../types";

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
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quest 1: 습관 형성하기 🎯</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="새로운 습관을 입력하세요..."
                    className="w-full p-2 border rounded border-gray-300 dark:border-zinc-700 bg-transparent text-gray-800 dark:text-white"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HabitCategory)}
                    className="w-full p-2 border rounded border-gray-300 dark:border-zinc-700 bg-transparent text-gray-800 dark:text-white"
                >
                    <option value="health">건강</option>
                    <option value="study">학습</option>
                    <option value="hobby">취미</option>
                    <option value="routine">루틴</option>
                    <option value="etc">기타</option>
                </select>

                <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition">
                    습관 추가하기
                </button>
            </form>


            <ul className="space-y-2">
                {habits.map((habit) => (
                    <li key={habit.id} className="flex items-center justify-between p-3 border rounded border-gray-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={habit.isCompleted}
                                onChange={() => {
                                    toggleHabit(habit.id);
                                }}
                            />
                            <span className={habit.isCompleted ? "line-through text-gray-400" : "text-gray-800 dark:text-white"}>
                                {habit.title} ({habit.category})
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                deleteHabit(habit.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}