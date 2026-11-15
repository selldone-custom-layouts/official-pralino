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
**1.0.0, final run on the dev server (15 Nov 2026, 05:08–08:06, no source edits during the run): 49 checks, every one TOTAL 0** — ring-dark, ring-light, ring-ar, card-edge, card-edge-pr-dark, card-edge-pr-light, card-edge-pr-ar, corner, corner-ar, circle, circle-ar, circle-dark, circle-pd, circle-pd-ar, contrast-dark, contrast-light, contrast-rose-light, contrast-rose-dark, contrast-sage-light, contrast-sage-dark, contrast-slate-light, contrast-slate-dark, contrast-ink-light, contrast-ink-dark, contrast-ffff00-light, contrast-ffff00-dark, contrast-00ffff-light, contrast-00ffff-dark, contrast-111111-light, contrast-111111-dark, contrast-states-dark, contrast-states-light, contrast-signin-dark, contrast-signin-light, contrast-ar, contrast-ar-dark, cart-dark, cart-light, currency, box-dark, box-light, box-ar, i18n-ar, shape-light, shape-dark, shape-teal, shape-ar, underline-dark, underline-light. The first full pass found two things, both fixed before the final run: the box check read the offer card's words and the footer's columns as covered by their photos (fixed by making each slot its own layer with the photo at its bottom; no visual change), and the Arabic check flagged two strings of Bakio's own data (the gateway's name after "Total ·", a cookie's own pro), now in its IGNORE list. Bakio sells in USD only, so AED, DKK and SAR stay USD on its pages; the circle checks' long made-up amount ("XXXX 1,234,567" in every circle) stands in for them. `i18n-lint` on `pralino.ar.ts`: every key present; the 6 notes it prints are the natural Arabic zero/one/two forms that carry no number (as in Domino).

Production bundle before the upload (`pralino-prod-check.mjs`, release step 5b): home, collection, product, journal, post, bag, checkout all drawn, 0 page errors, shop.js and shop.css served from the build. 281 files.
<!-- CHECKS:END -->

## Phase 3 — live (15 November 2026)

Layout 42 @ 1.0.0 was pinned on pralino.selldone.shop (domain 1252) by the coordinator.

**Live checks on 1.0.0** (`W3=1440,1100,390 bash scripts/run-checks.sh https://pralino.selldone.shop <logs>`; the Arabic runs through `scripts/pw-shop-languages.cjs`, which offers Arabic in the test browser only): ring dark, light and Arabic, card edge (kit; Pralino's cards dark, light, Arabic), corner-clear (390–1920 with 1366; Arabic) and circle-fit (USD, AED, DKK, SAR, long prices) all **TOTAL 0**. The run was stopped there for the urgent zoom-out fix below; the rest of the suite is to run on 1.0.1 once it is pinned.

**Guest checkout walk on live** (`scripts/pralino-checkout-walk.mjs`, desktop 1440 and phone 390; every way up to Selldone's payment window, nothing ordered, every `/buy/` call blocked, the bag emptied after): the three ways (Bakio courier with Morning / Evening / Night / Instant, Worldwide shipping $10.00, Pickup at Bakio San Francisco with Morning / Evening), the delivery sheet, the address sheet (map off, the shop's option) and the payment window for each way ("Place order · pay $2.81 on delivery", "$12.81 on delivery", "$2.81 at pickup"; Cash on delivery offered), 0 page errors. One bug: after the courier, **Worldwide shipping (no windows) still showed "· Morning"** in the receipt (the courier's window was kept in Selldone's delivery info). Fixed in 1.0.1.

**Fixes in 1.0.1**
- **No half-made facts on first paint.** Selldone first draws the page with a shop record that has its delivery ways but not its details; the top bar read "Open 0 days a week, 8:00–18:00" for about a second. `shopFacts().ready` now says when the details are in; until then the top bar's facts, phone and email, the footer's Visit and Contact, the product's delivery lines and every hours line wait, and the home's sentences built from the details, the collections and the catalogue (the hero's line, About and its links, How ordering works, the offer card, the counters) appear once, complete. A shop with hours but no days reads "Open 8:00–18:00" (never "0 days").
- **Wide windows** (the owner zoomed out to 2880 and 3840 CSS px). The page was capped at 1720 px while the bleed pads were sized from the window (`100vw`), so at 2880 "How ordering works", the journal and the hero squeezed their text into a column a few pixels wide and the hero's photo went to the right edge. Now the page runs the window's full width (`layouts/StorefrontLayout.vue`, the bands edge to edge like the header and footer, every page's content in the 1320 px wrap, centred), and nothing that bleeds or aligns is sized from the window: the hero, How ordering works, the journal and the title bands are size containers and the pad, the seam, the inset and the photo heights use `cqw` (the band's own width; mockup source `pralino-design/src`, LTR pixel-identical at 1440 and 390). The hero at 1920, 2560, 2880 and 3840 has its copy left, the photo to the window's edge with its rounded corner, the inset across the seam and the words on the photo's dark corner.
- **One page frame** (the owner at 3840–8000 CSS px: the hero's photo ran to the window's edge while the sections below stayed a 1320 px strip). Every photo that bleeds (the hero's, How ordering works, the journal, the photo band, a title band with a photo) stops at the frame's edge, `--pr-frame-max: 1920px`, centred, so the hero and the sections below share one left and one right edge; band grounds (the tint bands, the top bar, header and footer) may run the window's width, and beyond the frame the sides are the page's own ground. The content wrap grows a little on big screens, `--pr-wrap: clamp(1320px, 1320px + (frame − 1440px) × .35, 1600px)` with the frame width `--pr-frame-w: min(100cqw, 1920px)` measured on the band it sits in (never `vw`); grids keep their column counts.
- **The in-app splash** (`components/pralino/shell/PralinoSplash.vue`, as `new-shop-kits/loading/IN-APP-SPLASH.md`): Selldone removes the domain's loading frame as soon as the app starts (about half a second), so the Layout draws the same picture (the ground, the faint ring with the tan arc turning once every 1.2 s, the croissant line art drawn, the shop's live title and city set like the header's wordmark, in the family tokens) and keeps it on the first page load of a session until the shop's details, the collections, the catalogue and the first route are in, the first photo in view has decoded (or 2.5 s), and 1.2 s have passed since navigation start (not with reduced motion); always gone by 4 s, at once on a route error; a 300 ms fade. On dev, `localStorage["pralino-splash-hold"] = "1"` keeps it up for `scripts/splash-check.mjs`.
- **A window kept from another way:** a way without windows clears the window it inherited (Selldone's delivery info and the receipt), and the receipt names only a window the chosen way offers.

**New checks, permanent:** `scripts/text-column-check.cjs` (no running text in a column under 240 px on windows of 1024 px or more, no word broken mid-word, no grid or flex track that holds words squeezed under 44 px, no words over words); box, corner-clear, card-edge and the text probe now also run at 1920, 2560, 2880 and 3840 (`WIDE` in `run-checks.sh`). On live 1.0.0 the text probe finds the squeeze at 2880 (the journal's posts and How ordering works); on dev 1.0.1 it is at 0.

<!-- P3CHECKS:START -->
<!-- P3CHECKS:END -->

## Releases

Uploads: `bash "../new-shop-kits/upload-guard.sh" env LAYOUT_ID=42 SELLDONE_CLI_SRC="../selldone-cli-src" bash scripts/release.sh <version> desk` (a new version number every time; the first upload had no id and created Layout **42**), then `node --use-system-ca scripts/kalio-verify-deploy.mjs "$(npm root -g)/selldone-cli" 42 dist/app`.

| Version | Date | Layout | Deploy | What |
| --- | --- | --- | --- | --- |
| 1.0.0 | 15 Nov 2026 | 42 | 664 (release `01M7F0PA2A9CJDRR8NVXB3SB76`) | First upload: every page in the A mockups on Selldone's real flows, one colour family, one shape language, Arabic mirrored. 281 files. 49 dev checks TOTAL 0; production-bundle check OK before upload; verified on the server (`extracting:false`, `error:null`, shop.js and shop.css match). Not pinned by this session |
