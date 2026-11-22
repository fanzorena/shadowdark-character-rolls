export const ABILITIES = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

// Matches the Shadowdark modifier table for scores 3 to 18
export const modifier = score => Math.floor((score - 10) / 2);

// Original rules: at least one score of 14+.
// House rules: also requires the modifier total to be above 0.
export function evaluate(scores, houseRules = false) {
  const totalMods = scores.reduce((sum, s) => sum + modifier(s), 0);
  const has14 = scores.some(s => s >= 14);
  return { totalMods, valid: has14 && (!houseRules || totalMods > 0) };
}
