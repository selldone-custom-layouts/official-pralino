# Theme and colours

Pralino runs the **shared theme switcher** (`components/theme-switcher/`), the same code as the other custom Layouts. Pralino's palettes are in `components/pralino/pralino-theme.ts`, the **colour family** that paints every ground from the palette in `components/pralino/pralino-family.ts`, and the Tan values for the first paint (with the type and shape scale) in `style/pralino-theme.scss`; the **one file a merchant edits** is `components/pralino/pralino-theme.settings.ts`.

## One colour family

Pralino is drawn in one colour family: every colour on the page comes from the palette's hue, plus white and the family's near-black. Switching the palette, or picking a custom colour, re-tints the bands, the plates, the lines, the words, the dark top bar and footer, the chips, the map pin and the buttons at once; the browser's own theme colour follows the top bar.

`pralino-family.ts` builds the family from the palette's colour in OKLCH, keeping its hue and capping its chroma, at fixed lightnesses:

| Part | Light mode | Dark mode |
| --- | --- | --- |
| Page | white | L .17 |
| Bands, soft tint | L .985 | L .195 |
| Cards | L .985, or white | L .225 |
| Plates under the pastries | L .966 | L .26 |
| Deeper tint (drawings, lines) | L .925 and .86 | L .31 |
| The dark top bar and footer | L .24 | L .15 |

Ink, muted words and field edges are then walked until they reach their contrast: ink 7:1 on the deeper tint, muted words 4.6:1, a field's edge 3:1; words on the dark bars use the hue at 7:1. The theme switcher writes only the action colour (`--pr-act`, `--pr-act-deep`, `--pr-act-on`, `--pr-act-text`) and Vuetify's primary on top, and `pralino-family.ts` also repaints Vuetify's own dialogs, menus and fields from the same family.

## Pralino's colours

Pralino paints every action with **one colour**, tan `#8b6640` (white words 5.16:1): every button, chosen state and link. The Tan family is built from the seed `#b8916a`.

Around it, in the light mode (the default): a white page `#ffffff`, soft tint bands and cards `#fff9f3`, plates `#fdf2e7`, a deeper tint `#fce1c7`, near-black ink `#282017`, muted words `#665c52`, lines `#ecddcf`; a white header with ink words and a hairline `#f1e6da`; the dark top bar and footer `#2b1c0c` with words `#fef5ec`, and the family's light shade `--pr-act-dk` (`#c9a27a` for Tan) as their hover. The `−%` roundel is near-black ink with white words. In the dark mode, the family's night: the page and header `#130e0a`, bands and fields `#19140e`, cards `#221a13`, plates `#2e2114`, words `#f7eee6`, muted words `#c7bbb1`, lines `#352c23`, the top bar and footer `#140801`, the action colour `#8a653f` with white words, and links `#d1a881`. Every colour is a token (`--pr-…`): `style/pralino-theme.scss` holds the Tan values (`:root` is light, `html.pr-dark` is dark) and `pralino-family.ts` rewrites them for the palette on the page.

The mode from the settings file (light by default) is painted before the first paint on every shop, so the other mode never flashes.

## On Pralino's showcase shop

![The footer's Theme row](https://raw.githubusercontent.com/selldone-custom-layouts/official-pralino/main/docs/screenshots/desktop-theme.jpg)

The **Theme** row sits in the footer, in a band of its own above the legal row, on the family's dark in both modes. It is never in the header. It holds:

- **Colour:** Tan (the default), Rose, Sage, Slate, Ink, and **Custom colour** (any colour from the browser's colour picker; the whole family is built from it and its action colour is made readable in light and dark against Pralino's own surfaces, with a note "Adjusted for readability" when it had to change).
- **Mode:** Light or Dark.

One click changes the whole site at once, with no reload: Pralino's colour family, the Kalio base, Vuetify's theme and Selldone's own parts (the buy button, prices, the bag drawer, the checkout sheets, dialogs). The choice is kept in the browser (key `pralino-theme`; dark mode is the class `pr-dark` on `<html>`) and painted before the first paint, so the default never flashes. The arrow keys (and Home / End) move between the swatches.

| Light (the default) | Dark |
| --- | --- |
| ![Pralino in light mode](https://raw.githubusercontent.com/selldone-custom-layouts/official-pralino/main/docs/screenshots/desktop-home.jpg) | ![Pralino in dark mode](https://raw.githubusercontent.com/selldone-custom-layouts/official-pralino/main/docs/screenshots/desktop-dark.jpg) |
| ![Light on a phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-pralino/main/docs/screenshots/phone-home.jpg) | ![Dark on a phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-pralino/main/docs/screenshots/phone-dark.jpg) |

## On your own shop

The visitor switcher is a **showcase** feature. With `themeSwitcher: "showcase"` it shows only on the Layout's own showcase shops (listed in `showcaseShops` in `components/pralino/pralino-theme.ts`; Pralino's is Bakio, 15740). On any other shop it is not shown, nothing is read from or written to the browser's storage, and Pralino shows the theme from the settings file:

```ts
export const THEME_SETTINGS: ThemeSettings = {
  palette: "tan",            // "tan" | "rose" | "sage" | "slate" | "ink"
  // brandColor: "#F5C400",  // any colour; replaces palette (the whole page takes its family)
  mode: "light",             // "light" | "dark"
  themeSwitcher: "showcase", // "showcase" | "on" (your visitors get it) | "off"
  textOnBrand: "auto",       // with brandColor: "auto" (a light brand keeps dark words) | "white"
};
```

| Setting | Allowed values |
| --- | --- |
| `palette` | `"tan"` (the brand; the default), `"rose"`, `"sage"`, `"slate"`, `"ink"` |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette`, and the whole page (bands, plates, lines, words, the dark bars) takes this colour's family |
| `mode` | `"light"` (white and the soft tint; the default) or `"dark"` (the family's night) |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on the Layout's own showcase shops; the default), `"on"` (your visitors get the Theme row in the footer), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on it) or `"white"` (white words; a light colour is darkened) |

Every colour is made readable automatically: buttons, links, chosen states and dark mode.

## Examples

Change only these lines; leave the rest of the file as it is.

| You want | Set |
| --- | --- |
| "Use the rose theme" | `palette: "rose"` |
| "Use the yellow theme" | No palette is yellow, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"` |
| "My brand colour is #F5C400" | `brandColor: "#F5C400", textOnBrand: "auto"`; use `textOnBrand: "white"` for white words (the colour is then darkened) |
| "Make it dark" | `mode: "dark"` |
| "Let visitors switch themes" | `themeSwitcher: "on"` |
| "Remove the switcher" | `themeSwitcher: "off"` (on your own shop it is already hidden with `"showcase"`) |
| "Go back to the original colours" | remove `brandColor`, set `palette: "tan", mode: "light"` |

Then build and upload a new version and put it live:

```bash
LAYOUT_ID=<your Layout id> PW=<path>/node_modules/playwright/index.js SELLDONE_CLI_SRC=<cli clone> \
  bash scripts/release.sh <new version> desk
```

See [Build and Upload](Build-and-Upload) and [Go Live](Go-Live).

## Contrast

| Palette | Seed of the family | Light: action colour, white words on it | Light: link colour on the tint band / the plate | Dark: action colour, white words on it | Dark: link colour on the card |
| --- | --- | --- | --- | --- | --- |
| Tan | `#b8916a` | `#8b6640` 5.16:1 | 4.93:1 / 4.67:1 | `#8a653f` 5.23:1 | `#d1a881` on `#221a13` 7.86:1 |
| Rose | `#b5687a` | `#a15668` 5.19:1 | 4.95:1 / 4.67:1 | `#a05668` 5.22:1 | `#ea98aa` on `#23181a` 7.86:1 |
| Sage | `#6f8f6a` | `#577652` 5.10:1 | 4.90:1 / 4.64:1 | `#567451` 5.23:1 | `#99bb94` on `#171e16` 8.02:1 |
| Slate | `#55708f` | `#546f8e` 5.20:1 | 5.00:1 / 4.72:1 | `#55708f` 5.12:1 | `#96b3d5` on `#161c24` 7.92:1 |
| Ink | `#4a4a4a` | `#4a4a4a` 8.86:1 | 8.49:1 / 8.06:1 | `#6c6c6c` 5.25:1 | `#b1b1b1` on `#1c1c1c` 7.95:1 |

In light mode each family's ink reads at 15.9:1 or more on the white page and its muted words at 6.4:1 or more; the words on the dark top bar and footer read at 15.2:1 or more, and the light shade (`--pr-act-dk`) at 7:1 or more. In dark mode words read at 14.9:1 or more on the card and muted words at 9.1:1 or more. (Each figure is worked out from the colours that `pralino-theme.ts` and `pralino-family.ts` give each palette.) A custom or brand colour goes through `paletteFromColor()`, which moves only its lightness until each role reads against Pralino's surfaces (`#ffffff`, `#fafafa` and `#f4f4f4` in light; `#0f0f0f`, `#151515`, `#1c1c1c` and `#242424` in dark, the lightnesses every family's grounds sit at); its family is built from the same colour. Release 1.0.0's contrast audit passed with `TOTAL 0` for every palette and for the custom colours `#ffff00`, `#00ffff` and `#111111`, in light and dark.

## Checks

Run these from the repository root after a theme change. They need Playwright; set `PW` to your install (`PW=<path>/node_modules/playwright`), because the default path in the scripts is not yours. `".pr .ftr"` is Pralino's footer, which every page shows once it is ready. Run one at a time: Selldone limits how many requests one address may send in a minute.

1. **Contrast** on the live shop, at desktop and phone width. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> ".pr .ftr"
   ```
   To test one palette and mode, add `STORAGE='{"pralino-theme":"{\"palette\":\"tan\",\"mode\":\"dark\"}"}'` (this works where the switcher is shown).
2. **Bag drawer, bag page and address sheet.** It must print `TOTAL 0`. It fills a bag in the browser only and blocks every order request. The palette argument is a palette id, or `custom:#rrggbb` for a custom colour:
   ```sh
   SHOP=<your shop's xapi name> STORAGE_KEY=pralino-theme WAIT=".pr .ftr" CART=".bag-btn" \
     node components/theme-switcher/tools/cart-audit.cjs https://<your shop> tan light
   ```
3. **Underlines, boxes and shapes.** No line under any word or icon (a post's own links aside), at rest or on hover; photos never on words, icon rows aligned; every edge a circle, 8 px or 4 px, focus keeping its shape, nothing past the window. Each must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node scripts/underline-check.cjs https://<your shop> ".pr .ftr"
   SHOP=<your shop's xapi name> PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node scripts/box-check.cjs https://<your shop> ".pr .ftr"
   PAGES="home=/,category=/<a category>,product=/product/<id>" node scripts/shape-check.cjs https://<your shop> ".pr .ftr"
   ```
   All three default to the showcase shop's pages, so always pass `PAGES` (and `SHOP` for the box check, which also opens the menus, a quick view and the bag).
4. **Colour maths:** `node components/theme-switcher/theme-color.test.mjs` (Node 22.6 or newer).

On Pralino's showcase shop the same checks run with `https://pralino.selldone.shop` (or the dev server, `http://localhost:9150`), `SHOP=bakio`, `PAGES="home=/,category=/croissants-category,product=/product/720375"`, for each palette in light and dark. `scripts/run-checks.sh <base> <log folder>` is the full set that produced 1.0.0's test table, one browser at a time; a few of its checks (the ring, corner and circle checks and one card-edge check) come from a shared check kit that is not part of this repository, so on your own copy run the checks above.
