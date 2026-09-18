import assert from "node:assert/strict";
import test from "node:test";
import { koreaDateKey, shiftDateKey, streakForHabit, weeklyProgress } from "../features/habit/progress.ts";
import { experienceFromTotal } from "../features/quest/experience.ts";

test("한국 날짜는 자정 경계에서 올바르게 바뀐다", () => {
    assert.equal(koreaDateKey(new Date("2026-09-17T14:59:00Z")), "2026-09-17");
    assert.equal(koreaDateKey(new Date("2026-09-17T15:00:00Z")), "2026-09-18");
    assert.equal(shiftDateKey("2026-03-01", -1), "2026-02-28");
});

test("어제까지 달성한 습관은 오늘 미완료여도 연속일을 유지한다", () => {
    const completions = [
        { habitId: "a", completedOn: "2026-09-16" },
        { habitId: "a", completedOn: "2026-09-17" },
    ];
    assert.equal(streakForHabit(completions, "a", "2026-09-18"), 2);
    assert.equal(streakForHabit(completions, "a", "2026-09-19"), 0);
});

test("오늘 달성하면 어제까지의 연속일에 하루를 더한다", () => {
    const completions = [
        { habitId: "a", completedOn: "2026-09-17" },
        { habitId: "a", completedOn: "2026-09-18" },
        { habitId: "b", completedOn: "2026-09-16" },
    ];
    assert.equal(streakForHabit(completions, "a", "2026-09-18"), 2);
});

test("생성 전 날짜를 분모에 넣지 않고 주간 달성률을 계산한다", () => {
    const habits = [{ id: "a", createdAt: "2026-09-17T00:00:00Z" }];
    const completions = [{ habitId: "a", completedOn: "2026-09-18" }];
    const week = weeklyProgress(habits, completions, "2026-09-18");
    assert.equal(week[0].eligible, 0);
    assert.deepEqual(week[6], { date: "2026-09-18", completed: 1, eligible: 1, rate: 100 });
});

test("누적 경험치에서 레벨과 현재 경험치를 재현한다", () => {
    assert.deepEqual(experienceFromTotal(270), { level: 3, currentExp: 20, nextExp: 200 });
});

test("보관한 습관은 보관일까지 집계하고 그 다음 날부터 제외한다", () => {
    const habits = [{ id: "a", createdAt: "2026-09-15T00:00:00Z", archivedAt: "2026-09-17T06:00:00Z" }];
    const week = weeklyProgress(habits, [], "2026-09-18");
    assert.equal(week.find((day) => day.date === "2026-09-17").eligible, 1);
    assert.equal(week.find((day) => day.date === "2026-09-18").eligible, 0);
});
