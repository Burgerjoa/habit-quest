"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "../store";

export default function LevelUpModal() {
    const { isLeveledUp, level, closeLevelUpModal } = useQuestStore();

    return (
        <AnimatePresence>
            {isLeveledUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLevelUpModal}
                        className="absolute inset-0 bg-black cursor-pointer"
                    />

                    <motion.div
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{
                            scale: 1,
                            y: 0,
                            opacity: 1,
                            transition: { type: "spring", stiffness: 300, damping: 15 } // 💡 쫀득한 바운스 효과!
                        }}
                        exit={{ scale: 0.8, opacity: 0, y: 30 }}
                        className="relative z-10 w-full max-w-sm border-8 border-black bg-zinc-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-press text-retro-yellow animate-bounce tracking-widest">
                                LEVEL UP!
                            </h2>
                            <p className="font-pixel text-retro-green text-sm">
                                HERO REACHES A NEW HEIGHTS! ⚔️
                            </p>
                        </div>

                        <div className="border-4 border-black bg-black p-4 inline-block">
                            <span className="font-press text-4xl text-retro-yellow">
                                LV.{level}
                            </span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={closeLevelUpModal}
                            className="w-full py-3 bg-retro-green text-black border-4 border-black font-press text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-400 active:shadow-none transition-colors"
                        >
                            ACCEPT QUEST
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
