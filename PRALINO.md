# Pralino Classic Patisserie — Selldone Layout

**Pralino Classic Patisserie** (package `pralino-classic-patisserie`, first version `1.0.0`) is a Layout of the Selldone shop **Bakio** (shop 15740, xapi name `bakio`): one pâtisserie selling individual pastries for courier delivery, worldwide shipping and pickup, cash on delivery, guest checkout. Single seller, English only, USD only. It is built for **pralino.selldone.shop**; Bakio's shop default and its other domains are never changed by this Layout (the coordinator pins releases).

The design is mockup set **A, "Classic"** (`../pralino-design/`: `<page>-a.html` for all 28 pages, source in `src/`, photos in `photos/`, report `PHASE1-REPORT.md`; brief `BRIEF-PRALINO.md`): a classic, editorial pâtisserie with white and soft-tint bands, the family's near-black ink and one tan accent, Cormorant Garamond over Mulish, big photography; light by default, dark through the footer's Theme row.

It started from Domino 1.0.2 (`domino-layout`, `git clone`, history kept; Domino came from Bakini Noir), so every Selldone flow solved there is kept: the bag drawer, checkout, the address and map sheets, payment, order, account and sign-in, the journal, compare, the i18n runtime and `t()` with Arabic right to left, the region pill, the theme switcher row, fit-in-circle, the release scripts and the checks.

## Setup

| Area | What is set |
| --- | --- |
| Repo | `pralino-layout`, branch `pralino`; remotes `domino` (the local Domino repo, push disabled), `upstream` (selldone/storefront, fetch only, push disabled) and `origin` (`selldone-custom-layouts/official-pralino`, never pushed from here) |
| Names | `manifest.json`: `pralino-classic-patisserie`, "Pralino Classic Patisserie", `1.0.0`, with the description of the A look (it is the Layout's description on Selldone); `selldone-layout.json` the same name, package, summary, live address and tags |
| Dev server | port **9150**, shop `bakio` (`.env`); `npm run serve` in this folder (launch entry `pralino-layout` in `../.claude/launch.json`) |
| Mockup CSS | `scripts/pralino-css.cjs` turns `pralino-design/src/{base,pages,pralino}.css` into `style/pralino/*.css` (generated, never edited): each rule scoped to Pralino's markup (`:is(.pr, .pr *)`), custom properties `--pr-`, the dark mode `html.pr-dark`, the mockup's theme band `.ts-*` → `.dts-*`, keyframes `pr-*`. Re-run it after a mockup change. The Layout's own touches: `style/pralino-layout.scss` (shell, pages) and `style/pralino-sd.scss` (Selldone's sheets and windows in Pralino's dress) |
| Tokens and type | `style/pralino-theme.scss`: the Tan family for the first paint (light `:root`, dark `html.pr-dark`), Cormorant Garamond + Mulish (loaded from `components/kalio/kalio-fonts.ts`), the shape scale |
| Theme | `components/pralino/pralino-theme.ts` (Tan, Rose, Sage, Slate, Ink + Custom + Light/Dark; storage key `pralino-theme`; dark class `pr-dark`; Bakio 15740 a showcase shop) and `pralino-theme.settings.ts` (the one file a merchant edits) |
| Shell | `components/pralino/shell/`: `PralinoHeader.vue` (the family-dark top bar with hours, way to pay, pickup street, EN · USD pill, phone, email; the white sticky header with Shop ⌄, Deals, Journal, About, Contact, the centred wordmark with the city, search, account, bag, Order now; the phone menu and the language & currency sheet), `PralinoBagDrawer.vue`, `PralinoFooter.vue` (the shop's name, Visit, Shop, Contact, the Theme band, the legal row) |
| Shared state | `components/pralino/pr.ts`: the collections and the catalogue read once, the layers (one open at a time), the shop's facts |

## One colour family

`components/pralino/pralino-family.ts` is the A mockup's `src/tokens.js` ported number for number. From the palette's colour (OKLCH, hue kept, chroma capped) it writes every ground on `<html>`: light band L .985, plate .966, soft .955, tint .925, the 300 tint .86, family dark .24; dark page .17, band .195, card .225, plate .26, family dark .15. Ink, muted words and field lines are walked to contrast targets. The theme switcher writes only the action colour (`--pr-act`, `-deep`, `-on`, `-text`) and Vuetify's primary. Seeds: Tan `#b8916a` (brand; button `#8b6640`), Rose `#b5687a`, Sage `#6f8f6a`, Slate `#55708f`, Ink `#4a4a4a`. Switching the palette re-tints bands, plates, the top bar, the footer, chips, the map pin and the buttons; the browser's theme colour follows the top bar.

## One shape language

Circle (50 %) for round things (the −% roundel, icon buttons, the mark, the map pin), **8 px** for panels and photos (`--pr-r-pn`), **4 px** for inner parts (buttons, chips, fields, plates, thumbnails; `--pr-r-in`); square only where a band meets the window's edge. Focus rings are inset and keep the control's shape. Selldone's own parts (sheets, the payment window, chips, the region chips, the theme row) are mapped onto the same scale in `pralino-layout.scss` and `pralino-sd.scss`.

## Photos

`components/pralino/pr-photos.ts` lists `assets/pralino/*.webp` at build time: the eight slots (`pralino-hero-back`, `pralino-hero-inset`, `pralino-about`, `pralino-how`, `pralino-offer`, `pralino-parallax`, `pralino-journal`, `pralino-footer`) and one photo per collection, `pralino-col-<slug of its title>.webp` (its address name is tried too). The 14 finished photos of `pralino-design/photos/` are shipped (2.3 MB); `photos/magnific/` never is. A slot without its file draws its designed fallback (the family tint with the mockup's line drawing, or the shop's own pastries as cut-outs); a new collection without a photo gets its best sellers on a plate. Never a caption or a file name.

## Everything from the shop

Nothing about Bakio is written in the Layout: the top bar's hours, way to pay, pickup street, phone and email; the footer's address, hours and line; the wordmark (the live title, capitalised) and its city; the map (a Mapbox static map of the shop's own location, the mockup's pin on it); the currency and language labels; the sample buyer and address of the mockup are the real customer's data or an honest empty state; the product ids in `scripts/run-checks.sh` are test inputs only. The mockup's demo switch on the product page ("Preview: a product with options") is not in the Layout: options show only when a product really has variants. Today's selection has one button style for every row.

## Arabic, right to left

The mockup's stylesheets now use logical directions (`inset-inline-*`, `margin-inline-*`, `padding-inline/-block`, `text-align: start/end`, logical corner radii), so an Arabic page mirrors: the hero's photo bleeds to the left edge with the words on the right, the photo bands and the title bands flip. Rules that move a box with `translateX` (the sliding drawer, menu and filter panel, centred toasts) stay physical. The LTR mockups were compared pixel by pixel before and after the change (identical). Bakio sells in English only; on the dev server `localStorage["pralino-dev-languages"] = "ar"` offers Arabic in the test browser (dev build only), so the Arabic checks really render in Arabic.

## Fixes found while porting

- The phone's buy bar stayed up after scrolling back to the top (its watcher saw no change below the window); it now hides again on the way up.
- The Journal link stays lit on a post, not only on the list.
- The tab icon is the Pralino mark (the title's capital in a family-dark circle), not Domino's.

## Checks

`bash scripts/run-checks.sh <base> <logs>` runs every check one browser at a time: ring sweep (dark, light, Arabic), card edge (kit and `card-edge-pr.cjs`, dark, light, Arabic), corner-clear (390, 768, 900, 1024, 1280, 1366, 1440, 1920; and Arabic), circle-fit (USD, AED, DKK, SAR, long made-up prices; light, dark, Arabic; product pages), contrast (Tan dark and light on every page, each palette and the custom colours #ffff00, #00ffff, #111111 in both modes, with the bag drawer or phone menu open, with the sign-in sheet, Arabic light and dark), the bag audit, currency, box check (photo over words, icon rows), Arabic words (`i18n-check-forced.cjs`), the shape audit (`shape-check.cjs`: every edge on the scale, nothing past the window, focus keeps its shape, one inset ring per field; light, dark, a custom teal, Arabic), underline (dark, light).

`scripts/pralino-prod-check.mjs` loads the **built** bundle through the shop's own storefront HTML and loader (pralino.selldone.shop, the loader pointed at `dist/app`) and walks home → collection → product → journal → post → bag → checkout; it is step 5b of `scripts/release.sh`, which also refuses a build of more than 300 files.

<!-- CHECKS:START -->
<!-- CHECKS:END -->

## Releases

Uploads: `bash "../new-shop-kits/upload-guard.sh" env LAYOUT_ID=<id> SELLDONE_CLI_SRC="../selldone-cli-src" bash scripts/release.sh <version> desk` (a new version number every time; the first upload had no id), then `node --use-system-ca scripts/kalio-verify-deploy.mjs "$(npm root -g)/selldone-cli" <id> dist/app`.

| Version | Date | Layout | Deploy | What |
| --- | --- | --- | --- | --- |
