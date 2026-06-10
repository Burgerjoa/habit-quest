"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RetroCard } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) setMessage(error.message)
            else setMessage("회원가입 성공! 메일을 확인해주세요")
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setMessage(error.message)
            else {
                setMessage("로그인 성공!")
                router.push("/")
            }
        }
    };

    return (
        <RetroCard className="w-full max-w-sm mx-auto bg-retro-bg border-4 border-black p-6 space-y-4">
            <h2 className="text-lg font-press text-retro-yellow text-center border-b-4 border-dashed border-black pb-3">
                {isSignUp ? "CREATE HERO 👤" : "LOGIN HERO 🔑"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-zinc-800 text-white border-4 border-black font-press text-sm"
                    placeholder="EMAIL"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 bg-zinc-800 text-white border-4 border-black font-press text-sm"
                    placeholder="PASSWORD"
                    required
                />

                <Button variant="retroPrimary" type="submit" className="w-full font-press text-xs py-2">
                    {isSignUp ? "REGISTER" : "LOGIN"}
                </Button>
            </form>

            <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-center text-xs font-pixel text-zinc-400 hover:text-white transition"
            >
                {isSignUp ? "이미 캐릭터가 있으신가요? 로그인하기" : "새로운 캐릭터 생성하기 (회원가입)"}
            </button>

            {message && <p className="text-center font-pixel text-xs text-retro-red">{message}</p>}
        </RetroCard>
    );
}
