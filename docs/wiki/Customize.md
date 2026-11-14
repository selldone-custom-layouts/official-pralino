# Customize

Domino's design lives in its own components and style sheets. Selldone's commerce logic underneath (basket, bill, checkout, variants, orders, payment) stays untouched. After any change in the code, or a new photo in `assets/domino/`: build and upload a new version ([Build and Upload](Build-and-Upload)) and put it live ([Go Live](Go-Live)). A change in your shop's data (a title, a product photo, a delivery window, an article) needs no release: it shows on the next visit.

## The name and the wordmark

The wordmark is your **shop's title**, read live. `components/domino/DominoLogo.vue` draws it in lower case, Cormorant italic, with a small dot after it in the palette's light shade; a long title steps the size down so it never leaves the header. The hero's first line, the footer's copyright, the page titles and the messages use the same title. Rename the shop in Selldone and the Layout follows.

`components/kalio/kalio-brand.ts`: `BRAND.name = null` keeps the shop's title. A string there replaces it everywhere the storefront names the shop.

The mark (the browser tab's icon and the shop's avatar on order messages) is drawn from the title's first letter: `markFor()` in the same file for the tab, and `components/domino/ui/DmMark.vue` (the letter in the italic serif on cocoa, with the accent dot) for the messages; the account draws the shopper's own letter the same way. It is inline, so there is no image file to replace; change those two to change it.

## The colours, dark or light

One file: `components/domino/domino-theme.settings.ts`. See [Theme and colours](Theme-and-colours). Do not edit the palettes in `components/domino/domino-theme.ts` or the tokens in `style/domino-theme.scss` for a merchant's theme.

## Type, tokens and words

| What | Where |
| --- | --- |
| Fonts (Cormorant for headings, numbers set large and the wordmark; Jost for text, buttons and the nav; Material Symbols Rounded only for Selldone's own parts and the shared pieces) | `components/kalio/kalio-fonts.ts` |
| Icons (inline line icons, one stroke width) and the mockup's pastry drawings (croissant, macaron, cupcake, tart, cake, whisk) | `components/domino/dm-icons.ts`, drawn by `DmIcon.vue` and `DmArt.vue` |
| Colour, type and shape tokens for both modes (grounds, ink, lines, the cocoa header and footer, plates, photo slots, the action colour's roles, radii) | `style/domino-theme.scss`, every name `--dm-…`: `:root` is the light mode, `html.dm-dark` the dark mode |
| "Bag" instead of basket in Selldone's own English strings | `components/kalio/kalio-brand.ts` (`bagWords()`) |
| Domino's own words (every one through `t("domino.…", "English")`) | the components; the English in `components/kalio/i18n/domino.en.ts`, Arabic in `domino.ar.ts` (see [Languages](#languages)) |

## Photos

| Picture | Where it comes from |
| --- | --- |
| Pastries on every card, the quick view, the product page, the bag and the hero | each product's main photo, a transparent cut-out (PNG or WebP); more photos make the gallery |
| Collections in Shop ⌄ | the collection's best seller's cut-out |
| Collection portraits: the home's collection cards and gallery, the strip under a collection, About | `assets/domino/hero-<collection name>.webp` when the Layout has it, else its three best sellers on a plate |
| The photo slots: the hero (two), About, How ordering works, the offer card, the photo band, the journal, the footer's texture | `assets/domino/<slot>.webp` when the Layout has it, else the slot's designed fallback (`components/domino/DmPhoto.vue`, `DmCuts.vue`) |
| The journal and each post | each article's cover image |
| Contact | a static map of the shop's location (Selldone's map service: the dark style in dark mode, the street style in light) with the shop's pin |

Product pictures are changed in the Selldone dashboard, not in the code. The cut-outs matter: the Layout sets every pastry on a rounded warm plate, and a photo with its own ground shows as a square. See [Shop Requirements](Shop-Requirements#products).

### The photo slots

| Slot | File in `assets/domino/` | Size | Without the file |
| --- | --- | --- | --- |
| The hero's big photo (deep; the three most-ordered collections over it) | `domino-hero-back.webp` | 2000 × 1250 | the deep cocoa surface with the cake drawing |
| The hero's framed photo | `domino-hero-inset.webp` | 900 × 1100 | the most-ordered collection's second best seller as a cut-out on the cream surface |
| About (the home and the top of the About page) | `domino-about.webp` | 1200 × 800 | five pieces, one per collection, spread across the surface |
| How ordering works | `domino-how.webp` | 1200 × 1500 | the cream surface with the tart drawing |
| The offer card (deep; its words at the foot) | `domino-offer.webp` | 900 × 1350 | the piece with the biggest saving, in the upper middle |
| The photo band (deep) | `domino-parallax.webp` | 2400 × 1100 | the best seller of each collection in a row |
| The journal (deep; "Journal" over it) | `domino-journal.webp` | 1200 × 1400 | the deep surface with the whisk drawing |
| The footer's texture | `domino-footer.webp` | 2400 × 900 | the mockup's fine dot texture on the dark footer |
| Each collection's portrait | `hero-<collection name>.webp` | 1200 × 1500 | its three best sellers on a plate |

`<collection name>` is the collection's address name in Selldone (`cookies`, `mini-cakes`). The repository ships Bakio's six (`hero-cookies`, `hero-croissants`, `hero-danish-pastries`, `hero-mini-cakes`, `hero-muffins`, `hero-tarts`); a collection whose name matches none of them shows its plate. To add a photo:

1. Make it at the exact size, as WebP, with the exact name. No words, logos, price tags or people on it, and no pastry cut by the edge. On the deep slots the Layout's words sit over the photo on a soft scrim, so leave that part plain.
2. Put it in `assets/domino/`. `components/domino/dm-photos.ts` lists the files that exist at build time, so nothing else changes.
3. Build and release a new version, and check that the file count stays under ~360.

A slot never shows a caption, a file name or a size, with or without its file. Ready-made prompts for Bakio's eight slots are in `domino-design/CODEX-PROMPTS.md` in the project; the six collection portraits are shared with Bakini Noir.

## Sections and pages

| What | Where |
| --- | --- |
| Header (the top bar with the language and currency pill; the cocoa bar with Shop ⌄, Deals, Journal, About, Contact, the wordmark, search with live suggestions, the account, the bag button and Order now; the phone menu and the language sheet) | `components/domino/shell/DominoHeader.vue` |
| Bag drawer (the lines, the receipt, Checkout and View bag, Often added) | `components/domino/shell/DominoBagDrawer.vue` |
| Footer (the line on how orders arrive, the address, days and hours, email and phone; the Theme row; the legal row) | `components/domino/shell/DominoFooter.vue` |
| Wordmark | `components/domino/DominoLogo.vue` |
| Home (hero, counters, About, the collections people order most, How ordering works, the courier's numbers with the offer card and the ways, gallery, Today's selection, photo band, marquee, journal) | `components/domino/DominoHome.vue`, inside `pages/products/StorefrontPageProducts.vue` |
| Photo slots and drawings | `components/domino/DmPhoto.vue`, `DmCuts.vue`, `DmArt.vue`, `dm-photos.ts` |
| Shared data and layers (the collections and catalogue read once, the shop's facts, one layer open at a time) | `components/domino/dm.ts` |
| Shared pieces (the title band, card, add box, quick view, modal, empty state, sample label, numerals, icon lines, the shop's mark) | `components/domino/ui/` (`DmPt.vue`, `DmCard.vue`, `DmQuickView.vue`, `DmModal.vue`, `DmEmpty.vue`, `DmSampleTag.vue`, `DmNumeral.vue`, `DmIcLine.vue`, `DmMark.vue`), `components/domino/DmAdd.vue` |
| Listings (a collection, search, deals, every pastry; the title band, the chips, the filter panel, sort, the grid, the strip under a collection) | `components/domino/shop/DmListing.vue`, `DmStrip.vue`, inside `pages/products/StorefrontPageProducts.vue` |
| Product page (gallery, buy column, options, add box, the delivery lines, the tabs, Buy together, More <collection>, phone buy bar) | `pages/product/StorefrontPageProduct.vue`, `components/domino/product/` (`DmProductOverview.vue`, `DmPdAdd.vue`, `DmProductTabs.vue`, `DmTogether.vue`, `pd.ts`) |
| Compare | `components/domino/compare/DmCompare.vue`, `pages/comparison/` |
| Bag page and checkout (the lines, How it reaches you, the receipt, step pills, Contact, Delivery and its windows, address or pickup counter, Billing, note) | `pages/basket/cart/StorefrontPageBasketCart.vue` (Selldone's script, Domino's markup), `components/domino/buy/dm-cart.ts`, `DmLineQb.vue` |
| Delivery ways and the delivery sheet | `pages/basket/cart/SCartShippingOptions.vue`, `components/domino/buy/DmShipSheet.vue` |
| Address sheet and payment window | `components/kalio/checkout/KalioAddressSheet.vue` and Selldone's window, dressed by `style/domino-sd.scss` |
| Order page (title band, progress, pastries, payment, receiver, chat) | `pages/basket/order/` (and `physical/dashbaord/`), `components/domino/order/` (`DmOrderPay.vue`, `DmOrderReceiver.vue`, `DmOrderChat.vue`, `od.ts`) |
| Account (Overview, Orders, Addresses, Profile) | `components/kalio/account/` (`KalioAccountShell.vue`, `KalioAccountHome.vue`, `KalioOrdersBoard.vue`, `kalio-account.ts`), `pages/user/` |
| Sign-in sheet | `components/kalio/shell/KalioSignIn.vue` |
| Journal and post | `pages/blog/list/StorefrontPageBlogsList.vue`, `pages/blog/view/StorefrontPageBlogsView.vue`, `components/domino/read/DmPost.vue` |
| About, Terms, Privacy, Contact, FAQ (with the sample text and its label) | `pages/official/`, `pages/faq/StorefrontPageFaq.vue`, `components/domino/read/` (`DmLegal.vue`, `DmMap.vue`, `rd.ts`) |
| 404 | `pages/errors/404/StorefrontPageError404.vue` |

Every page's markup is Domino's own; the scripts underneath are Selldone's and the Kalio base's (bag, checkout, order, account, sign-in, compare). A shop with its own custom header or footer code in Selldone keeps Selldone's header or footer (`layouts/StorefrontLayout.vue`).

## Styles

| File | Holds |
| --- | --- |
| `style/domino-theme.scss` | Domino's tokens (`--dm-…`): type, radii, and the grounds, lines and words of both modes (`:root` light, `html.dm-dark` dark). The theme switcher writes only the palette's action colours (`--dm-act*`) on top. |
| `style/domino/domino.css`, `b.css`, `pages.css` | the mockup's stylesheets (`domino-design/src/`), converted by `scripts/domino-css.cjs`: every rule scoped to Domino's own markup (`:is(.dm, .dm *)`), the custom properties renamed `--dm-…`, dark mode as `html.dm-dark`, keyframes `dm-*`. **Generated: never edit them.** |
| `style/domino-layout.scss` | the Layout's own touches, loaded last: Selldone's and Vuetify's parts inside Domino's pages, and the places where the Vue markup differs from the mockup's. Change the look here. |
| `style/domino-sd.scss` | the parts Domino borrows, in its dress: Kalio's address sheet (map on or off), Selldone's payment window, the scrim under the sheets |
| `style/storefront.scss` and the shared `kalio-*.scss` / `bakini-*.scss` it loads | the Kalio base's skin for Selldone's own components; their `--bk-act*` colours follow the palette, so Vuetify's primary follows it too |

All of them are loaded from `StorefrontApp.vue`: `storefront.scss` first, then `domino-theme.scss`, the generated files, `domino-sd.scss`, and `domino-layout.scss` last. Every Domino component wraps its markup in an element with the class `dm`, so these rules never touch Selldone's or Vuetify's parts outside it.

## Languages

Every word Domino writes goes through `t("key", "English")` (`components/kalio/i18n/kalio-i18n.ts`). The English is the second argument at the call site; the dictionaries are files beside it:

| File | Holds |
| --- | --- |
| `components/kalio/i18n/base/<code>.ts` | the shared Kalio words (bag, checkout, account, compare, theme…), the same in every Kalio-family Layout |
| `components/kalio/i18n/domino.<code>.ts` | Domino's own words: `domino.*` |
| `components/kalio/i18n/bakini.<code>.ts` | the `bakini.*` words the shared Kalio and Bakini code still uses |
| `components/kalio/i18n/lang-<code>.ts` | merges the three; loaded only when a visitor picks that language |
| `components/kalio/i18n/index.ts` | `EN` (English, bundled) and `LOADERS`, the list of other languages Domino knows |

Domino ships English and Arabic (`ar`, right to left: the whole page mirrors). The visitor picks one from the language and currency pill in the top bar (the phone menu's "Language & currency" row); the list is the shop's own languages (Selldone dashboard › Shop › Languages).

To change a word: edit the English at the call site, and the same key's value in `domino.en.ts` and in each `domino.<code>.ts` (a `bakini.*` word lives in `bakini.en.ts` and `bakini.<code>.ts`; a shared Kalio word, one without a prefix such as `theme.title`, in `base/en.ts` and `base/<code>.ts`).

To add a language your shop offers:

1. Copy `domino.en.ts` to `domino.<code>.ts` and `bakini.en.ts` to `bakini.<code>.ts`, and translate every value (keep `{n}`, `{shop}` and the other `{…}` words; plural keys end in `.one` / `.other`, and a language with more forms adds `.zero`, `.two`, `.few`, `.many`).
2. Translate `base/en.ts` into `base/<code>.ts` the same way.
3. Copy `lang-ar.ts` to `lang-<code>.ts` and change its three imports.
4. Add one line to `LOADERS` in `index.ts`, next to `ar: () => import("./lang-ar")`.
5. Build and check every page in that language. A word still in English is a string that is not wrapped in `t()` yet: wrap it with a new `domino.…` key.

The words the shop writes (product names, collections, units, pros, spec, articles) are the shop's data: translate them in the Selldone dashboard.

Right to left, Domino keeps these rules:

- logical CSS everywhere (`margin-inline`, `inset-inline`, `text-align: start`), so the page mirrors; the theme row's arrow keys follow the direction;
- the shop's own words (names, collections, addresses) sit in `<bdi>`, so each keeps its own direction inside a translated sentence; phone numbers stay left to right;
- the words in the `−%` roundel and the deals band's "Save" are fitted to their circle in every language and currency;
- an Arabic face (Noto Sans Arabic) is loaded only when Arabic is picked.

## Rules the design keeps

- **One action colour.** Pistachio (or your palette) for every button, chosen state and link; on the cocoa header and footer, the palette's light shade (`--dm-act-dk`) with cocoa words. The header and footer stay cocoa in every palette. Every colour is a token.
- **Flat.** Buttons without shadows; hover changes the colour only; no line under any word or icon, links inside a post's own text included.
- **Rings inside the box.** Every selection ring and card edge is an inset shadow, never an outline.
- **Cut-outs on plates.** Product photos are transparent cut-outs on rounded warm plates (`#f2e8db`; `#2d221b` in dark mode), so there is no white square in either mode.
- **Words in their circles, corners off words.** The `−%` roundel and the quick-view eye sit in the plate's top corners, where there are no words; the roundel's words always fit inside it.
- **Photos carry no words.** The photo files have no text; on the deep slots the Layout's own words sit over a soft scrim, elsewhere beside or under the photo.
- **A click opens, a second click closes.** Shop ⌄, the search, the menus and the sheets open on a click and close on a second click, Esc, a click outside or a page change; one layer at a time.
- **Moving parts can stop.** The marquee holds on hover and keyboard focus and stands still for reduced motion; the listing's results fade without motion when the visitor asks for less.
- **Bag, not cart.** In the Layout's words and in Selldone's own English strings.
- **Honest words.** No invented history, awards, names, counts or reviews; no product count in the shop's words; sample pages say they are samples; "every piece" only when every piece has the same saving; delivery lines and windows only from the shop's own delivery ways; counter hours only from the pickup note; deal clocks only to a deal's real end date; no stars without reviews; no options without real variants; "not taking payment" when there is no payment method.
- **Live data.** Nothing names a product, price, collection, delivery way or opening hour; another bakery gets its own.
