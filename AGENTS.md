# AI Agent Entry Point

Detailed AI instructions and reusable custom Storefront Layout material live
in the dedicated [`.ai-agent/`](.ai-agent/) directory so they stay separate
from application source.

For tasks that customize, redesign, audit, package, or publish this Storefront
as a custom Selldone Layout, read these files completely:

1. [`.ai-agent/AGENTS.md`](.ai-agent/AGENTS.md)
2. [`.ai-agent/SKILL.md`](.ai-agent/SKILL.md)
3. [`.ai-agent/AI_WORKFLOW.md`](.ai-agent/AI_WORKFLOW.md) when GitHub setup,
   dependency synchronization, packaging, authentication, or deployment is in
   scope

The official Vue 3/Vite Storefront is the implementation baseline. This kit
does not authorize a framework replacement or a parallel storefront app; the
visual design may change completely while the platform and commerce contracts
remain intact. Do not change the official repository's Git remote model or run
release commands merely because this shim exists. Apply publication rules in
the owner's controlled clone, fork, or release branch.

## Theme (palette, brand colour, light or dark, the visitor switcher)

When a merchant asks for a theme ("use the cherry theme", "my brand colour is #F5C400", "make it dark"), edit **one file only**: `components/domino/domino-theme.settings.ts`. Nothing else needs to change, and the colours are made readable automatically (buttons, links, chosen states, dark mode). Domino Cocoa Patisserie paints every action with one colour (pistachio by default) on a cream ground with cocoa ink; the header and footer stay cocoa in every palette.

| Setting | Allowed values |
| --- | --- |
| `palette` | `"pistachio"` (the brand; the default), `"cherry"`, `"caramel"`, `"blueberry"` |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette` |
| `mode` | `"light"` (the cream ground; the default) or `"dark"` (the cocoa night) |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on the Layout's own showcase shop, Bakio 15740; the default), `"on"` (the merchant's visitors get the Theme row in the footer), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on it) or `"white"` (white words; a light colour is darkened) |

Worked examples (change only these lines; leave the rest of the file as it is):

- **"Use the cherry theme"**: `palette: "cherry"`.
- **"My brand colour is #F5C400"**: `brandColor: "#F5C400", textOnBrand: "auto"`. Use `textOnBrand: "white"` if they want white words; the colour is then darkened.
- **"Make it dark"**: `mode: "dark"`.
- **"Let visitors switch themes"**: `themeSwitcher: "on"`.
- **"Remove the switcher"**: `themeSwitcher: "off"`. On a merchant's own shop it is already hidden with `"showcase"`.
- **"Go back to the original colours"**: remove `brandColor` and set `palette: "pistachio", mode: "light"`.

The switcher itself is the shared package in `components/theme-switcher/` (the same code as every other Layout; see its PORTING.md in the kit). Domino's palettes are in `components/domino/domino-theme.ts` and its grounds, lines and words for both modes in `style/domino-theme.scss`; do not edit them for a merchant's theme.

Then release and check:

1. Build and upload: `LAYOUT_ID=<your Layout id> SELLDONE_CLI_SRC=<cli clone> bash scripts/release.sh <new version> desk`. Put the version live.
2. Check the contrast on the live shop. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> ".ftr"
   ```
3. If the visitor switcher is on, also run the kit's `ring-sweep.cjs` in light and dark (`STORAGE='{"domino-theme":"{\\"palette\\":\\"pistachio\\",\\"mode\\":\\"dark\\"}"}'`). The switcher is the Theme row in the footer.

## Words and languages

Domino's own words go through `t("domino.<area>.<name>", "English")` (`components/kalio/i18n/kalio-i18n.ts`, the shared i18n runtime). The English is `components/kalio/i18n/base/en.ts` (the shared Kalio words), `bakini.en.ts` (the `bakini.*` words still used by the shared Kalio/Bakini code) and `domino.en.ts` (Domino's own), generated from the code by the kit's `i18n-extract.cjs` (run it once with the prefix `domino.` and once with `bakini.`); Arabic is `base/ar.ts` + `bakini.ar.ts` + `domino.ar.ts`, merged by `lang-ar.ts` and listed in `index.ts` (`LOADERS`), fetched only when a visitor picks it. The basket is a **bag** everywhere ("Add to bag", "Your bag"), in the Layout's words and in Selldone's own English strings (`components/kalio/kalio-brand.ts`, `bagWords()`). To add a language the shop enables: translate `domino.en.ts` and `bakini.en.ts` to `<code>` files (same keys, keep every `{…}`, add the language's plural forms), copy `base/<code>.ts` from the shared set, add `lang-<code>.ts` and one `LOADERS` line. A new visible word always gets a `t()` key; a word still in English after a language pick is an unwrapped string. Use logical CSS (`margin-inline`, `inset-inline`, `text-align: start`) so a right-to-left language mirrors.
