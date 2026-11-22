import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, modifier } from "../scripts/abilities.mjs";

test("modifiers follow the Shadowdark table", () => {
  const expected = { 3: -4, 4: -3, 5: -3, 6: -2, 7: -2, 8: -1, 9: -1, 10: 0, 11: 0, 12: 1, 13: 1, 14: 2, 15: 2, 16: 3, 17: 3, 18: 4 };
  for (const [score, mod] of Object.entries(expected)) assert.equal(modifier(Number(score)), mod, `score ${score}`);
});

test("original rules only need one score of 14+", () => {
  assert.deepEqual(evaluate([14, 10, 10, 10, 10, 10]), { totalMods: 2, valid: true });
  assert.deepEqual(evaluate([14, 3, 3, 10, 10, 10]), { totalMods: -6, valid: true });
  assert.deepEqual(evaluate([13, 13, 12, 10, 10, 10]), { totalMods: 3, valid: false });
});

test("house rules also need a modifier total above 0", () => {
  assert.deepEqual(evaluate([14, 10, 10, 10, 10, 10], true), { totalMods: 2, valid: true });
  assert.deepEqual(evaluate([12, 15, 9, 10, 11, 7], true), { totalMods: 0, valid: false });
  assert.deepEqual(evaluate([13, 13, 12, 10, 10, 10], true), { totalMods: 3, valid: false });
  assert.deepEqual(evaluate([8, 9, 10, 11, 7, 6], true), { totalMods: -6, valid: false });
});
