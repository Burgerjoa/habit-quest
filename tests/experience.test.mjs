import assert from "node:assert/strict";
import test from "node:test";
import { calculateExperience } from "../features/quest/experience.ts";

test("완료한 습관을 취소하면 레벨업 이전 상태로 돌아간다", () => {
    const before = { level: 1, currentExp: 90, nextExp: 100 };
    const completed = calculateExperience(before, 20);

    assert.deepEqual(completed, { level: 2, currentExp: 10, nextExp: 150 });
    assert.deepEqual(calculateExperience(completed, -20), before);
});

test("경험치가 여러 레벨을 넘거나 0 밑으로 내려가도 처리한다", () => {
    const initial = { level: 1, currentExp: 0, nextExp: 100 };
    const gained = calculateExperience(initial, 270);

    assert.deepEqual(gained, { level: 3, currentExp: 20, nextExp: 200 });
    assert.deepEqual(calculateExperience(gained, -270), initial);
    assert.deepEqual(calculateExperience(initial, -10), initial);
});
