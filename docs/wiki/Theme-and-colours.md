# Theme and colours

Domino runs the **shared theme switcher** (`components/theme-switcher/`), the same code as the other custom Layouts. Domino's palettes are in `components/domino/domino-theme.ts` and its grounds, lines and words for both modes in `style/domino-theme.scss`; the **one file a merchant edits** is `components/domino/domino-theme.settings.ts`.

## Domino's colours

Domino paints every action with **one colour**, pistachio `#5a7440` (white words 5.24:1): every button, chosen state and link.

Around it, in the light mode (the default): a cream ground `#f7f1ea`, cream cards and fields `#fffaf4`, bands `#efe5d9`, cocoa ink `#3a2a22`, muted words `#6b574b`, lines `#e2d4c4`, plates `#f2e8db`; a cocoa top bar `#2c1f19`, a cocoa header and title bands `#3a2a22` with cream words, and a dark cocoa footer `#2a1e18`. On the cocoa header and footer, the palette's light shade (`--dm-act-dk`; `#b7d192` for Pistachio) marks the hover, the bag's count, "Order now" and the wordmark's dot, with cocoa words on it. In the cocoa-night dark mode: the ground `#1a1310`, bands and fields `#231a15`, cards and plates `#2d221b`, words `#f3e9de`, muted words `#c2b1a2`, lines `#3e3129`, the header `#120d0b`, the footer `#0f0b09`, and a light pistachio `#a9c584` with cocoa words `#1a1310` on it. The header and footer stay cocoa in every palette. Every colour is a token in `style/domino-theme.scss` (`:root` is light, `html.dm-dark` is dark).

The mode from the settings file (light by default) is painted before the first paint on every shop, so the other mode never flashes.

## On Domino's showcase shop

![The footer's Theme row](https://raw.githubusercontent.com/selldone-custom-layouts/official-domino/main/docs/screenshots/desktop-theme.jpg)

The **Theme** row sits in the footer, in a band of its own above the legal row. It is never in the header. It holds:

- **Colour:** Pistachio (the default), Cherry, Caramel, Blueberry, and **Custom colour** (any colour from the browser's colour picker; it is made readable in light and dark against Domino's own surfaces, with a note "Adjusted for readability" when it had to change).
- **Mode:** Light or Dark.

One click changes the whole site at once, with no reload: Domino's colours, the Kalio base, Vuetify's theme and Selldone's own parts (the buy button, prices, the bag drawer, the checkout sheets, dialogs). The choice is kept in the browser (key `domino-theme`; dark mode is the class `dm-dark` on `<html>`) and painted before the first paint, so the default never flashes. The arrow keys (and Home / End) move between the swatches.

| Light (the default) | Dark |
| --- | --- |
| ![Domino in light mode](https://raw.githubusercontent.com/selldone-custom-layouts/official-domino/main/docs/screenshots/desktop-home.jpg) | ![Domino in dark mode](https://raw.githubusercontent.com/selldone-custom-layouts/official-domino/main/docs/screenshots/desktop-dark.jpg) |
| ![Light on a phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-domino/main/docs/screenshots/phone-home.jpg) | ![Dark on a phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-domino/main/docs/screenshots/phone-dark.jpg) |

## On your own shop

The visitor switcher is a **showcase** feature. With `themeSwitcher: "showcase"` it shows only on the Layout's own showcase shops (listed in `showcaseShops` in `components/domino/domino-theme.ts`). On any other shop it is not shown, nothing is read from or written to the browser's storage, and Domino shows the theme from the settings file:

```ts
export const THEME_SETTINGS: ThemeSettings = {
  palette: "pistachio",      // "pistachio" | "cherry" | "caramel" | "blueberry"
  // brandColor: "#F5C400",  // any colour; replaces palette
  mode: "light",             // "light" | "dark"
  themeSwitcher: "showcase", // "showcase" | "on" (your visitors get it) | "off"
  textOnBrand: "auto",       // with brandColor: "auto" (a light brand keeps dark words) | "white"
};
```

| Setting | Allowed values |
| --- | --- |
| `palette` | `"pistachio"` (the brand; the default), `"cherry"`, `"caramel"`, `"blueberry"` |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette` |
| `mode` | `"light"` (the cream ground; the default) or `"dark"` (the cocoa night) |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on the Layout's own showcase shops; the default), `"on"` (your visitors get the Theme row in the footer), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on it) or `"white"` (white words; a light colour is darkened) |

Every colour is made readable automatically: buttons, links, chosen states and dark mode.

## Examples

Change only these lines; leave the rest of the file as it is.

| You want | Set |
| --- | --- |
| "Use the cherry theme" | `palette: "cherry"` |
| "Use the yellow theme" | No palette is yellow, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"` |
| "My brand colour is #F5C400" | `brandColor: "#F5C400", textOnBrand: "auto"`; use `textOnBrand: "white"` for white words (the colour is then darkened) |
| "Make it dark" | `mode: "dark"` |
| "Let visitors switch themes" | `themeSwitcher: "on"` |
| "Remove the switcher" | `themeSwitcher: "off"` (on your own shop it is already hidden with `"showcase"`) |
| "Go back to the original colours" | remove `brandColor`, set `palette: "pistachio", mode: "light"` |

Then build and upload a new version and put it live:

```bash
LAYOUT_ID=<your Layout id> SELLDONE_CLI_SRC=<cli clone> bash scripts/release.sh <new version> desk
```

See [Build and Upload](Build-and-Upload) and [Go Live](Go-Live).

## Contrast

| Palette | Light: action colour, white words on it | Dark: action colour, words on it | Dark: text colour on the card `#2d221b` |
| --- | --- | --- | --- |
| Pistachio | `#5a7440` 5.24:1 | `#a9c584`, cocoa words `#1a1310` 9.62:1 | `#b7d192` 9.25:1 |
| Cherry | `#a43c4c` 6.31:1 | `#b54c5a`, white words 5.06:1 | `#ff909c` 7.17:1 |
| Caramel | `#98571a` 5.66:1 | `#a05f24`, white words 5.05:1 | `#e8a169` 7.18:1 |
| Blueberry | `#4f5f9f` 6.05:1 | `#5a6aac`, white words 5.13:1 | `#9aaef5` 7.19:1 |

Each palette's dark text colour is also its `--dm-act-dk` on the cocoa header and footer, where it reads at 6.3:1 or more against the light header `#3a2a22` (8.18:1 for Pistachio) and 7.4:1 or more against the footer `#2a1e18`; the bag's count, in `#2a1e18` on that shade, reads at 7.4:1 or more too. In light mode every action colour reads at 4.5:1 or more as text on the cream ground `#f7f1ea` and on the band `#efe5d9`; ink reads at 12.21:1 on the ground, and muted words at 6.06:1 on the ground and 5.46:1 on the band. In dark mode words read at 15.31:1 on the ground and 12.92:1 on the card, and muted words at 8.83:1 and 7.45:1. A custom or brand colour goes through `paletteFromColor()`, which moves only its lightness until each role reads against Domino's surfaces (`#f7f1ea`, `#efe5d9` and `#fffaf4` in light; `#1a1310`, `#231a15` and `#2d221b` in dark).

## Checks

Run these from the repository root after a theme change. They need Playwright; set `PW` to your install (`PW=<path>/node_modules/playwright`) if the default path is not yours. `".ftr"` is the footer, which every page shows once it is ready.

1. **Contrast** on the live shop, at desktop and phone width. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> ".ftr"
   ```
   To test one palette and mode, add `STORAGE='{"domino-theme":"{\"palette\":\"pistachio\",\"mode\":\"dark\"}"}'` (this works where the switcher is shown).
2. **Bag drawer, bag page and address sheet.** It must print `TOTAL 0`. It fills a bag in the browser only and blocks every order request. The palette argument is a palette id, or `custom:#rrggbb` for a custom colour:
   ```sh
   SHOP=<your shop's xapi name> STORAGE_KEY=domino-theme WAIT=".ftr" CART=".bag-btn" \
     node components/theme-switcher/tools/cart-audit.cjs https://<your shop> pistachio light
   ```
3. **Underlines and boxes.** No line under any word or icon, at rest or on hover; photos never on words, icon rows aligned. Each must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node scripts/underline-check.cjs https://<your shop> ".ftr"
   SHOP=<your shop's xapi name> PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node scripts/box-check.cjs https://<your shop> ".ftr"
   ```
   Both default to the showcase shop's pages, so always pass `PAGES` (and `SHOP` for the box check, which also opens the menus, a quick view and the bag).
4. **Colour maths:** `node components/theme-switcher/theme-color.test.mjs` (Node 22.6 or newer).

On Domino's showcase shop the same checks run with `https://domino.selldone.shop`, `SHOP=bakio`, `PAGES="home=/,category=/croissants-category,product=/product/720375"`, for each palette in light and dark; `scripts/run-checks.sh` runs the whole set there, one browser at a time.
