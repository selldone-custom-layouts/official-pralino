# Troubleshooting

## Sign in goes to Selldone and shows an error

The shop has no OAuth client for sign-in. Set up the shop's OAuth client id (shop dashboard, or the Selldone MCP connector's `selldone_shop_client_create`). See [Shop Requirements](Shop-Requirements).

## The shop shows a blank page, or an old page flashes first

A chunk imports `../shop.js`, so the app loads twice through Selldone's redirect. Keep shared code in the `core` chunk and don't use `experimentalMinChunkSize` (both in `vite.config.ts`). When you add a chunk group, keep its rule: a module joins a group only when everything it imports outside core is in the same group. `release.sh` refuses a build with `../shop.js` imports.

## Chunks fail with a MIME error (`text/x-java`)

Selldone stores the MIME type it sniffs from each file. Every JS file must start with `"use strict";`: that is `sniffAsJavaScript` in `vite.config.ts`. Check with `file --mime-type dist/app/js/*.js`.

## The upload is rejected

| Message | Fix |
| --- | --- |
| "The manifest must be an array." | Upload with `scripts/kalio-deploy.mjs`, not the plain CLI. |
| "Archive paths must be safe relative app/ paths." | Remove `dist/index.html`, and use no spaces or brackets in file names. |
| "Active SVG attributes" / "only passive vector shapes" | Run `node scripts/kalio-svg-flatten.mjs dist/app`. |
| Request cut off after ~100 s, and the version exists but is empty | Too many files. Stay under ~360 (Domino 1.0.1 has 273; each photo in `assets/domino/` adds one), then upload a **new** version number. |
| 401 | The CLI is signed out (`~/.selldone-dev/.persist` is empty). Run `selldone` → Login. |
| `node: bad option: --use-system-ca` | Your Node.js is too old for the release scripts. Use Node.js 22.15 or newer. |

## The upload worked but the shop still shows the old version

- The version isn't attached yet: see [Go Live](Go-Live).
- A custom domain keeps its own selection. Attach the version to that domain, or set it to **inherit**.
- You checked a URL with a query. Open the plain address and read `window.sdShopLayout`.
- The ZIP was stale: always package with `--force` and compare `shop.js` with `cmp`.

## `/` shows a landing page, the Layout is only on `/shop`

The Home is a Page Builder page. Set Home to **Shop** for the shop, or for that domain: see [Go Live](Go-Live).

## A pastry sits on a white or coloured square

Its photo has its own ground. Domino sets every pastry on a rounded warm plate (a dark cocoa plate in dark mode), so the main photo must be a **transparent cut-out** (PNG or WebP). Replace the photo in Selldone; no release is needed. See [Shop Requirements](Shop-Requirements#products).

## A product photo is blurry, or a small one does not load

The Selldone CDN serves product photos only at their original size and as 128 px and 64 px thumbnails. There is no 256 or 640 px variant: a request for one returns 404. In code, use `productImage(p)` (the original) for anything wider than a thumbnail, and `productImage(p, 128)` only for small thumbnails.

## A photo slot shows a drawing or cut-outs instead of a photo

That is the slot's designed fallback: the Layout has no file for it. Add `assets/domino/<exact name>.webp` (`domino-hero-back.webp`, `domino-about.webp`…; for a collection's portrait, `hero-<its address name>.webp`, as in `hero-mini-cakes.webp`), then build and release a new version: the files are listed at build time. See [Customize](Customize#photos).

## A collection shows a photo that is not mine

The repository ships Bakio's six collection portraits (`hero-cookies`, `hero-croissants`, `hero-danish-pastries`, `hero-mini-cakes`, `hero-muffins`, `hero-tarts` in `assets/domino/`). A collection of yours with the same address name picks one up. Replace the file with your own photo, or delete it (the collection then shows its three best sellers on a plate), and release a new version.

## A home section is missing

Each section folds away without its data, or shrinks to what the shop has:

| Section | Needs |
| --- | --- |
| The hero's collection names | collections with products (the hero itself always shows your shop's name) |
| The counters on the cocoa band | collections, a saving, open days or delivery ways (it shows four, two or one; never a count of products) |
| The collections people order most | collections with products (four, two or one cards) |
| The courier's numbers | a courier with time windows or a distance, or a shipping way with a free-shipping threshold |
| **<n> ways to receive it** | delivery ways |
| The gallery | collections with products, and enough pastries to fill the tiles around the centre |
| Today's selection | products in stock |
| The marquee | collections |
| The journal | published articles |

About, How ordering works, the offer card and the photo band always show; their lines come from the shop info, the delivery ways, the payment way and the savings. About's Delivery, Pickup and Payment links show only for what the shop has. See [Shop Requirements](Shop-Requirements).

## Deals shows only some pieces

Deals lists the pieces that have a saving. Give the other pieces a discount, or find them on their collection page and in search.

## Shop ⌄ doesn't open on hover

That is by design: Shop ⌄, the search and the menus open on a click and close on a second click, Esc, a click outside or a page change.

## The counter hours are missing

They are read from the pickup point's note, as a time range: `8:00-18:00`, `8:00–18:00` or `8:00 to 18:00`. Write them that way in the note. Without a range, the hours are left out everywhere; nothing is guessed.

## Checkout shows no time windows

The windows are your delivery ways' own time spans. Add them to each delivery way in the Selldone dashboard. A window shows only for the way that offers it.

## Contact's map shows no streets

Neither the shop info nor the pickup point has a location. Set the shop's location on the map in the Selldone dashboard. Without one, Contact shows the map's calm water colour and the pin only.

## Filters are missing, or a spec key never becomes a filter

- Specs must be **flat**, plus `spec_order`. A nested spec is not shown anywhere.
- A key whose every value is longer than 80 characters, or that has one value longer than 30 characters, is a note, not a filter: it stays in the product page's Additional information. Keys with two or more different values come first. Price is always there, and On offer when something on the page has a saving.

See [Shop Requirements](Shop-Requirements#specs-and-filters).

## The quick view says "Choose options"

The product has variants. The quick view sends the shopper to the product page, where the options are chosen. This is by design.

## Checkout says "This shop is not taking payment right now"

The shop has no payment method for this currency. Add one in the Selldone dashboard (cash on delivery is fine). Domino shows this line instead of a Place order button that opens an empty window; the bag is kept.

## About, Terms, Privacy or FAQ say "Sample text"

The shop has not written that page yet. The sample is built only from your shop's facts. Write the page (or the FAQ entries) in the Selldone dashboard and the label goes away.

## A post ends with no pastries

The panel in a post shows the pastries its text links to (`/product/<id>` links, four at most), else the ones it names. Link the pastries in the article's text.

## The footer's Theme row doesn't show on my shop

That is by design: with `themeSwitcher: "showcase"` it shows only on the Layout's own showcase shops. Set `themeSwitcher: "on"` in `components/domino/domino-theme.settings.ts` to give your visitors the switcher. See [Theme and colours](Theme-and-colours).

## Selldone's default purple appears in some places

Those are Selldone's own components using the theme colour. Domino's switcher writes the palette into the inherited `--bk-act*` names, from which `style/kalio-tokens.scss` sets `--v-theme-primary`, and sets Vuetify's theme from the palette in `components/domino/domino-theme.ts`; if a part still shows Selldone's purple, make it read that variable rather than a fixed colour. To change the colours themselves, use the settings file, not the tokens.

## Selldone's header or footer shows instead of Domino's

The shop has custom header or footer code in Selldone. A shop with its own code keeps Selldone's header or footer (`layouts/StorefrontLayout.vue`). Remove the custom code to get Domino's.

## I edited `style/domino/*.css` and my change was lost

Those files are generated from the mockup by `scripts/domino-css.cjs`. Put the change in `style/domino-layout.scss` instead. See [Customize](Customize#styles).

## A product page shows a plain purple page in a headless test

A headless browser opening a `/product/` link directly gets Selldone's SEO page. Open the home first and move with the Layout's links, or test in a normal browser or the dev server.

## The map in the address sheet is grey or 0 px tall

`mapbox-gl.css` sets `position: relative` on the map; the canvas must stay `position: absolute`. Use the `streets-v12` style. Search finds streets and numbers, not landmarks. With the checkout map off, the address sheet is a short form with search instead.

## Sticky parts don't stick

Vuetify's `.v-application` has `overflow: hidden`, which stops anything sticking. `style/domino-layout.scss` switches it to `overflow: clip` (the header and the product page's buy column stick); keep that rule if you restyle the page.

## GitHub blocks the push: "Mapbox Secret Access Token"

Selldone's storefront history contains Selldone's **public** Mapbox browser key (`pk.`). It has been public in `selldone/storefront` since 2023. Allow it once with the link GitHub prints, or remove it from your own commits.

## A word stays in English after picking another language

If it is your shop's data (a product, collection, unit, pros, spec or article), translate it in the Selldone dashboard. If Domino writes it, it is a string not yet wrapped in `t()`: wrap it with a new `domino.…` key, add the key to `domino.en.ts` and to each `domino.<code>.ts` (Arabic: `domino.ar.ts`), then build and release. See [Customize](Customize#languages).

## A red "429 Too Many Attempts" message, or a page that stays empty

Selldone limits how many requests one address may send in a minute. Many test browsers at once (or several Layouts tested from one computer) reach it; shoppers do not. Domino tries its shared reads up to four times, pausing as Selldone's Retry-After says; wait a minute and reload. Run the checks one at a time.
