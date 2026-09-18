export interface Experience {
    level: number;
    currentExp: number;
    nextExp: number;
}

export function calculateExperience(state: Experience, amount: number): Experience {
    let { level, currentExp, nextExp } = state;
    currentExp += amount;

    while (currentExp >= nextExp) {
        currentExp -= nextExp;
        level += 1;
        nextExp += 50;
    }

    while (currentExp < 0 && level > 1) {
        level -= 1;
        nextExp -= 50;
        currentExp += nextExp;
    }

    return { level, currentExp: Math.max(0, currentExp), nextExp };
}

export function experienceFromTotal(totalExp: number): Experience {
    let level = 1;
    let currentExp = Math.max(0, totalExp);
    let nextExp = 100;
    while (currentExp >= nextExp) {
        currentExp -= nextExp;
        level += 1;
        nextExp += 50;
    }
    return { level, currentExp, nextExp };
}
