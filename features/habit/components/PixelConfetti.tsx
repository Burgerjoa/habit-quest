"use client";

import { motion } from "framer-motion";

const RETRO_COLORS = ["#ffc825", "#38bdf8", "#4ade80", "#f43f5e", "#a855f7"];

function random(seed: number) {
    return ((seed * 1664525 + 1013904223) >>> 0) / 4294967296;
}

interface PixelConfettiProps {
    trigger: number;
}

export default function PixelConfetti({ trigger }: PixelConfettiProps) {
    if (trigger === 0) return null;
    const particles = Array.from({ length: 25 }, (_, i) => {
        const seed = trigger * 1000 + i * 10;
        return {
            id: `${trigger}-${i}`,
            color: RETRO_COLORS[Math.floor(random(seed) * RETRO_COLORS.length)],
            size: random(seed + 1) * 8 + 6,
            x: (random(seed + 2) - 0.5) * 400,
            y: -(random(seed + 3) * 200 + 100),
            delay: random(seed + 4) * 0.1,
            rotation: random(seed + 5) * 360,
        };
    });

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
                        rotate: [0, p.rotation],
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
