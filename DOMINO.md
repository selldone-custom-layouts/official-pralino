# Domino Cocoa Patisserie — Selldone Layout

**Domino Cocoa Patisserie** (package `domino-cocoa-patisserie`, first version `1.0.0`) is a Layout of
the Selldone shop **Bakio** (shop 15740, xapi name `bakio`, `https://bakio.myselldone.com`): one
pâtisserie selling individual pastries for courier delivery, worldwide shipping and pickup, cash on
delivery, guest checkout. Single seller, English only, USD only. It is built for
**domino.selldone.shop** only; Bakio's shop default (Layout 36, Bakini Noir) and domain 1247 are never
touched by this Layout.

The design is mockup set **B, "Cocoa & Pistachio"** (`../domino-design/`: `home-b.html` and `src/`,
the inner pages as `<page>-b.html`, the photo prompts in `CODEX-PROMPTS.md`; build brief
`BUILD-DOMINO.md`): a cream ground, cocoa ink and a cocoa header, a pistachio accent, rounded photos and
pill buttons, Cormorant over Jost; light by default, dark through the footer's Theme row.

It started from Bakini Noir 1.0.5 (`bakini-layout`, `git clone`, history kept), so every Selldone flow
of that Layout is kept (bag drawer, checkout, address/map sheet, payment, order, account, sign-in,
journal, compare, i18n `t()` with Arabic right to left, the region pill, the theme switcher row,
fit-in-circle, the release scripts and the live checks).

## Phase 1 — setup, shell and home (13 November 2026)

| Area | What is set |
| --- | --- |
| Repo | `domino-layout`, branch `domino`; remotes `bakini` (the local Bakini repo, push disabled), `upstream` (selldone/storefront, push disabled) and `origin` (`selldone-custom-layouts/official-domino`, not pushed yet). `modules/` (the six Selldone modules with `patches/*.patch` applied) and `node_modules/` copied from Bakini (same `package.json` and lock); `/modules/` and `/dist.zip` are ignored |
| Names | `manifest.json`: `domino-cocoa-patisserie`, "Domino Cocoa Patisserie", `1.0.0`; `selldone-layout.json`; `package.json` repository `official-domino` |
| Dev server | port **9140**, shop `bakio`, home = shop page (`.env`); `npm run serve` in this folder (launch entry `domino-layout` in `../.claude/launch.json`) |
| Tokens | `style/domino-theme.scss`: the mockup's B tokens with a `--dm-` prefix. `:root` = light (cream, cocoa, pistachio), `html.dm-dark` = the cocoa night. Everything that follows the palette (check marks, the bag's count, the header's hover, the wordmark's dot) reads `--dm-act*` |
| Mockup CSS | `scripts/domino-css.cjs` turns `domino-design/src/{domino,b}.css` into `style/domino/*.css` (generated, never edited): every rule scoped to Domino's markup (`:is(.dm, .dm *)`, a bare element rule `:where()`), variables `--dm-`, `[data-mode=dark]` → `html.dm-dark`, `body` → the `.dm` root, the mockup's theme band `.ts-*` → `.dts-*` (the kit's row owns `.ts-*`), keyframes `dm-*`. The Layout's own touches are `style/domino-layout.scss` |
| Theme | `components/domino/domino-theme.ts` (config) and `domino-theme.settings.ts` (the one file a merchant edits): Pistachio (the brand, the mockup's hand-set values), Cherry, Caramel, Blueberry (built by `paletteFromColor` with the mockup's surfaces, as its `palVars` does) + Custom + Light/Dark; light by default; storage key `domino-theme`; dark class `dm-dark`; Bakio 15740 in `showcaseShops`. The switcher also writes the inherited `--bk-act*` names, so Vuetify's `--v-theme-primary` (kalio-tokens.scss) and the pages not yet ported follow the palette |
| Type | Cormorant + Jost from JS (`components/kalio/kalio-fonts.ts`); Instrument Serif and Manrope are no longer loaded |
| Shell | `components/domino/shell/`: `DominoHeader.vue` (top bar with the counter's days and hours, the way to pay, "Pickup at <street>", the language & currency pill `EN · USD`, phone and email; the sticky cocoa bar with Shop ⌄ (each collection with its best seller and its lowest price), Deals, Journal, About, Contact, the centred wordmark, search with live suggestions, the account, the bag with its count, "Order now"; the phone menu with "Show N more" past 8 collections and the "Language & currency" row and sheet), `DominoBagDrawer.vue`, `DominoFooter.vue` (texture slot, the line, address, contact, the kit's Theme row, the legal row) |
| Home | `components/domino/DominoHome.vue`: every section of `home-b.html` from live data (hero, counters on the cocoa band, About, the four collections people order most, how ordering works, counters + offer + the ways to receive it, the gallery, today's selection with the add box, the photo band, the marquee, the journal) |
| Wordmark | `components/domino/DominoLogo.vue`: the shop's live title in lower case, Cormorant italic, a dot in the palette's light shade; a long title steps down in size |
| Shared state | `components/domino/dm.ts` (the collections and the catalogue read once, the layers, the shop's facts); `components/bakini/noir/noir.ts` now re-exports it for the Noir pages not yet ported, so there is one layer state |
| Removed | the Noir header, footer, logo, home and carousel, Bakini's theme config, and `assets/bakini/` (the collection photos moved to `assets/domino/`) |

**Photo slots.** `components/domino/dm-photos.ts` lists the files in `assets/domino/` at build time
(`import.meta.glob`): the eight Domino slots by name (`domino-hero-back`, `domino-hero-inset`,
`domino-about`, `domino-how`, `domino-offer`, `domino-parallax`, `domino-journal`, `domino-footer`) and
one portrait photo per collection, `hero-<collection name>.webp` (the six shared with Noir).
`DmPhoto.vue` shows a slot's photo when its file exists; otherwise its designed fallback, never a
caption, file name or size:

| Slot | Fallback |
| --- | --- |
| `domino-hero-back` (deep, collection names over it) | the deep cocoa surface with the mockup's cake drawing |
| `domino-hero-inset` | the most-ordered collection's second best seller as a cut-out on the cream surface |
| `domino-about` | five pieces, one per collection, spread across the surface |
| `domino-how` | the cream surface with the tart drawing |
| `domino-offer` (deep, words at the foot) | the piece with the biggest saving, in the upper middle |
| `domino-parallax` (deep band) | the best seller of each collection in a row |
| `domino-journal` (deep, "Journal" over it) | the deep surface with the whisk drawing |
| `domino-footer` | the mockup's fine dot texture on the dark footer |
| a collection photo | its three best sellers on a plate |

To add the owner's Codex photos later: put `assets/domino/<slot>.webp` with exactly these names (same
sizes as `domino-design/CODEX-PROMPTS.md`), build and upload a new version. Keep the file count low: the
upload limit is about 360 files.

**Reversible choices made in phase 1.**

- The counters band shows collections, the saving, the counter's days and hours and the ways to
  receive an order, not the mockup's "60 pieces on the counter": the owner's rule says no product count
  in customer text. For the same reason the Shop menu shows each collection's lowest price ("From
  $2.81") instead of "10 pieces".
- The home's About lines are written from the shop's own facts (address, collections, ways, payment),
  so they carry no "Sample text" tag; the About page itself keeps its sample label.
- The About section's links: Delivery and Payment jump to the home's own "ways" and "how" sections,
  Pickup opens Contact (the mockup's delivery and payment pages are checkout sheets, not pages).
- "Shop ⌄" opens on a click only (the owner's rule: a click opens, a second click closes); the
  mockup's hover-open is left out.
- Today's selection is the best sellers mixed across collections (in stock), so a row never shows
  one kind only.
- The language & currency pill sits in the top bar's right end (the mockup set's later shell puts it
  there); with one language and one currency it still reads "EN · USD".

**Pages not yet ported (phase 2).** The category, search, deals, product, compare, bag page,
checkout, order, account, journal, article, About, Contact, FAQ, legal and 404 pages are still the
Noir components. They already wear Domino's colours and faces: `style/bakini-theme.scss` now gives the
Noir token names (`--bk-*`) Domino's values in both modes, `html.bk-dark` became `html.dm-dark` in the
Noir styles, Manrope/Instrument Serif became Jost/Cormorant in the shared skins, and the switcher writes
the palette into `--bk-act*` too. Their markup and layout are Noir's until each is ported to its
`<page>-b.html`. The words: Domino's new components use `t("domino.*", "English")` with the English in
the call; `components/kalio/i18n/*.en.ts` and the Arabic files are re-extracted in phase 2.

**Build (13 November 2026, phase 1).** `npm run build-production`: 359 files once `dist/index.html`
is removed (release.sh does), the same as Noir 1.0.5 at the upload limit. What fills it: 292 JS
chunks, of which about 100 are Selldone's own language packs (one lazy chunk per language, about
80 KB each) and most of the rest Selldone's lazy pages and widgets; 65 assets (20 large Selldone SVGs,
six IRANSans faces from `storefront.ts`'s Persian font import, four Font Awesome faces, Selldone's
PNGs, the six collection photos). The Noir chunks (NxCard, NxCrumbs, NxEmpty, NxLegal, NxMap, NxRow,
NxSampleTag, noir-account, noir-cart, pd, rd) go with the phase 2 port. Planned room before the first
upload: group Selldone's rarely used lazy pages (Avocado, Hyper, POS, community, Instagram, map) into
one chunk and load the Persian faces only for Persian; the eight Domino photos will add eight files.

**Dev screenshots.** `node --use-system-ca scripts/dev-shots.cjs http://localhost:9140/
docs/dev-shots 1440,390 light,dark` (one browser at a time, `/buy/` blocked; `OVERLAYS="menu,drawer"`
also shoots the layers). The PNGs stay out of git (`.gitignore`).

## Releases

None yet.
