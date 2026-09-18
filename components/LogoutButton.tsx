"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useHabitStore } from "@/features/habit/store";
import { useQuestStore } from "@/features/quest/store";

export default function LogoutButton() {
    const router = useRouter();
    const [error, setError] = useState("");

    const signOut = async () => {
        setError("");
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(error.message);
            return;
        }
        useHabitStore.setState({ habits: [], completions: [], hasLoaded: false, error: null });
        useQuestStore.setState({ totalExp: 0, level: 1, currentExp: 0, nextExp: 100,
            hasLoaded: false, isLeveledUp: false, error: null });
        router.replace("/login");
        router.refresh();
    };

    return <div className="text-right">
        <button type="button" onClick={signOut} className="text-xs text-zinc-400 hover:text-white hover:underline">로그아웃</button>
        {error && <p role="alert" className="text-xs text-retro-red">{error}</p>}
    </div>;
}
