# Shadowdark Character Rolls

A Foundry VTT module that rolls Shadowdark abilities (3d6 in order) and shows in chat the modifier total and whether the roll is valid. When the roll is invalid, a **Reroll** button appears; only the player who rolled (or the GM) can use it.

| Macro | The roll is valid when |
|:--|:--|
| **Roll Character** | at least one ability is 14 or higher (original rules) |
| **Roll Character (House Rules)** | at least one ability is 14 or higher **and** the modifier total is above 0 |

## Installation

In Foundry: **Add-on Modules → Install Module**, paste the URL below into **Manifest URL** and click **Install**:

```
https://github.com/fanzorena/shadowdark-character-rolls/releases/latest/download/module.json
```

Then enable the module in your world (**Manage Modules**).

## Usage

When the GM joins the world with the module enabled, both macros are created in the Macro Directory, visible to every player. Players can run them from the directory or drag them to their hotbar.

If a macro is deleted, it is recreated the next time the GM joins the world. The logic lives in the module, so module updates apply to the existing macros.

You can also call it from the console or another macro:

```js
game.modules.get("shadowdark-character-rolls").api.rollCharacter({ houseRules: false });
```

## Releasing a version

1. Bump `version` in `module.json` (e.g. `1.0.1`), then commit and push.
2. On GitHub, create a release tagged `v1.0.1`.
3. The workflow attaches `module.json` and `module.zip` to the release, and Foundry will offer the update.

## Tests

```
node --test
```
