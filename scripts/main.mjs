import { ABILITIES, evaluate } from "./abilities.mjs";

const ID = "shadowdark-character-rolls";

async function rollCharacter({ houseRules = false } = {}) {
  const roll = await new Roll(`{${ABILITIES.map(() => "3d6").join(",")}}`).evaluate();
  const rolls = roll.terms[0].rolls;
  const { totalMods, valid } = evaluate(rolls.map(r => r.total), houseRules);

  const rows = rolls.map((r, i) => `
    <tr>
      <th scope="row" style="text-align: left">${ABILITIES[i]}</th>
      <td style="text-align: center">${r.dice[0].results.map(d => d.result).join(" + ")}</td>
      <td style="text-align: center"><strong>${r.total}</strong></td>
    </tr>`).join("");

  const reroll = valid ? "" : `<button type="button" data-sdcr-reroll="${houseRules}">Reroll</button>`;

  return roll.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: `Shadowdark Abilities (3d6 in order)${houseRules ? " — House Rules" : ""}`,
    content: `
      <table>
        <thead>
          <tr>
            <th scope="col" style="text-align: left">Ability</th>
            <th scope="col">Dice</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="2" style="text-align: left">Total Modifiers</th>
            <td style="text-align: center"><strong>${totalMods > 0 ? "+" : ""}${totalMods}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p style="text-align: center">
        <strong>${valid ? "✅ Valid roll" : "❌ Invalid roll"}</strong>
      </p>
      ${reroll}`
  });
}

const MACROS = [
  { key: "original", name: "Roll Character", houseRules: false },
  { key: "houseRules", name: "Roll Character (House Rules)", houseRules: true }
];

Hooks.once("init", () => {
  game.modules.get(ID).api = { rollCharacter };
  // v13 passes an HTMLElement to renderChatMessageHTML; v12 only has renderChatMessage with jQuery
  if (game.release.generation >= 13) Hooks.on("renderChatMessageHTML", bindReroll);
  else Hooks.on("renderChatMessage", (message, html) => bindReroll(message, html[0]));
});

// The active GM creates the macros once; every player can see and run them
Hooks.once("ready", async () => {
  if (game.users.activeGM !== game.user) return;
  for (const { key, name, houseRules } of MACROS) {
    const data = {
      name,
      command: `game.modules.get("${ID}").api.rollCharacter({ houseRules: ${houseRules} });`,
      flags: { [ID]: { macro: key } }
    };
    if (game.macros.some(m => m.getFlag(ID, "macro") === key)) continue;
    // Version 1.0.0 created a single house-rules macro under an older flag
    const legacy = houseRules && game.macros.find(m => m.getFlag(ID, "rolarAtributos"));
    if (legacy) await legacy.update({ ...data, [`flags.${ID}.-=rolarAtributos`]: null });
    else await Macro.create({
      ...data,
      type: "script",
      img: "icons/svg/d20-grey.svg",
      ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER }
    });
  }
});

function bindReroll(message, html) {
  const button = html.querySelector("[data-sdcr-reroll]");
  if (!button) return;
  // Only the player who rolled (or a GM) may reroll
  if (!message.isAuthor && !game.user.isGM) return button.remove();
  button.addEventListener("click", () => {
    button.disabled = true;
    rollCharacter({ houseRules: button.dataset.sdcrReroll === "true" });
  });
}
