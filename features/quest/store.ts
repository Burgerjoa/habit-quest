interface QuestState extends QuestStats {
    addExp: (exp: number) => void;
    resetQuest: () => void;
}