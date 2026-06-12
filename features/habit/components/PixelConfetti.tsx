"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const RETRO_COLORS = ["#ffc825", "#38bdf8", "#4ade80", "#f43f5e", "#a855f7"];

interface PixelConfettiProps {
    trigger: number;
    onComplete: () => void;
}

export default function PixelConfetti({ trigger, onComplete }: PixelConfettiProps) {
    const [particles, setParticles] = useState<{ id: number; color: string; size: number; x: number; y: number; delay: number }[]>([]);

    useEffect(() => {
        if (trigger > 0) {
            const newParticles = Array.from({ length: 25 }).map((_, i) => ({
                id: Date.now() + i + Math.random(),
                color: RETRO_COLORS[Math.floor(Math.random() * RETRO_COLORS.length)],
                size: Math.random() * 8 + 6,
                x: (Math.random() - 0.5) * 400,
                y: -(Math.random() * 200 + 100),
                delay: Math.random() * 0.1,
            }));
            setParticles((prev) => [...prev, ...newParticles]);

            const timer = setTimeout(() => {
                setParticles([]);
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [trigger]);

    if (particles.length === 0) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                        x: p.x,
                        y: [0, p.y, p.y + 400],
                        scale: [1, 1, 0],
                        rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: p.delay,
                    }}
                    style={{
                        position: "absolute",
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: "2px 2px 0px 0px #000",
                    }}
                />
            ))}
        </div>
    );
}
