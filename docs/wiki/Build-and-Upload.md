# Build and Upload

Every release is a **new version** of your Layout on Selldone. `scripts/release.sh` runs every step in order; this page explains each one.

## One-time setup

```bash
npm i -g selldone-cli                                        # the official CLI
git clone https://github.com/selldone/cli selldone-cli-src   # its packager lives in .agents/
```

Sign in to the CLI once:

1. Run `selldone`.
2. Choose **Login | Login to your Selldone account.**
3. Approve the sign-in in your browser and type your **2FA code** in the terminal.

`selldone login` is not a command. The sign-in is saved in `~/.selldone-dev/.persist`; if that file is empty, every upload answers 401 until you sign in again.

You also need Python 3 (for the packager), Node.js 22.15 or newer (the scripts run `node --use-system-ca`) and Bash with `file`, `unzip` and `cmp` (Git Bash on Windows has them).

## Release

The first upload creates your Layout. Leave `LAYOUT_ID` out:

```bash
SELLDONE_CLI_SRC=../selldone-cli-src bash scripts/release.sh 1.0.0 desk
```

Note the Layout id printed after it (it is also in the Selldone developer panel). Every later release:

```bash
LAYOUT_ID=<your Layout id> SELLDONE_CLI_SRC=../selldone-cli-src \
  bash scripts/release.sh <new version> desk
```

The arguments:
- the **new version**, never used before;
- `desk`, the account design argument of the shared script. Domino no longer reads it (`VITE_KALIO_ACCOUNT`): its account is the same either way.

The variables:
- `SELLDONE_CLI_SRC`: your clone of [selldone/cli](https://github.com/selldone/cli) (required);
- `SELLDONE_CLI`: the installed CLI, by default `$(npm root -g)/selldone-cli`;
- `LAYOUT_ID`: with it, the script also checks the upload on the server.

## What the script does, and why

| Step | Why |
| --- | --- |
| Bump `version` in `manifest.json` | A version number is used up even when an upload fails. Never reuse one. |
| `npm run build-production` | Outputs `dist/app/shop.js`, one stylesheet `dist/app/shop.css` and the chunks, with a **relative base**. Releases are served from `cdn.selldone.com/public/layouts/<id>/releases/<ULID>/app/`. The only photo files Domino ships are the ones in `assets/domino/`; every other picture is the shop's own. |
| `rm -f dist/index.html` | Every ZIP member must be under `app/`. In production the Layout runs inside Selldone's HTML, so `index.html` is never used. The fonts (Cormorant, Jost) load from the app code (`components/kalio/kalio-fonts.ts`). |
| `scripts/kalio-svg-flatten.mjs` | Selldone accepts only passive SVG attributes. `style`, `<style>`, `xml:space`, `enable-background`, `display`, `fx/fy`, `data-*` and character references in values are refused. |
| MIME check (`file --mime-type`) | Selldone stores the MIME type it sniffs. A chunk starting with `import{` is stored as `text/x-java`, which browsers refuse. Every chunk starts with `"use strict";` (`sniffAsJavaScript` in `vite.config.ts`). |
| No `../shop.js` imports | Selldone's loader reaches `shop.js` through a redirect. A chunk importing `../shop.js` loads the app twice: an old page flashes, then the page goes blank. Shared code lives in a `core` chunk (`coreChunk` in `vite.config.ts`). |
| File count under ~360 | The archive is extracted inside the upload request, behind a ~100 s limit. At 714 files it was cut off mid-way and the version was burned. Domino 1.0.1 has **273 files** (359 before its grouping): `vite.config.ts` groups code only lazy routes use (Domino's small shared pieces in one chunk; Selldone's rare pages, such as community, Avocado, POS, hyper, Instagram, maps, vendor listings and other kinds of order, in one; Selldone's language packs four to a file), and only when everything a grouped module imports outside core is in the same group, so no common page loads a group's file. SVGs up to 16 KB and small PNG/JPG icons up to 12 KB ride inline, fonts ship as WOFF2 only and country flags load from jsDelivr. Each photo added to `assets/domino/` is one more file, and a new dependency can push it over. |
| `package_layout.py … --force` | Without `--force`, an old `dist.zip` is kept and it still prints PASS. |
| `cmp` of `shop.js` | Proves the ZIP is this build. |
| `scripts/kalio-deploy.mjs` | Uploads with the official CLI's sign-in and checks, sending only the six manifest fields the server accepts. |
| `scripts/kalio-verify-deploy.mjs` | Asks the server: the newest deploy must show `extracting:false`, `error:null`, `js_match:true` and `css_match:true`. **A CLI exit code is not proof.** |

To check an upload again later:

```bash
node --use-system-ca scripts/kalio-verify-deploy.mjs <selldone-cli root> <your Layout id> dist/app
```

It prints the two newest deploys, each with its release path.

## Upload rules found by testing (November 2026)

- `manifest` holds only `package, version, name, description, storefront, backoffice`.
- No spaces or brackets in any file name (`safeName` in `vite.config.ts`).
- The `package` name never changes after the first upload.
- An upload creates a **beta** version. Your shop doesn't change until you attach it: see [Go Live](Go-Live).

## Restyling from the mockup

Domino's look comes from the mockup's stylesheets (`domino-design/src/domino.css`, `b.css` and `pages.css`, set B "Cocoa & Pistachio"), converted by `scripts/domino-css.cjs` into `style/domino/*.css` (generated, every rule scoped to Domino's own markup, `.dm`; custom properties renamed `--dm-…`; dark mode as `html.dm-dark`). The tokens of both modes are kept by hand in `style/domino-theme.scss`. They are part of the repository, so a normal release needs nothing extra. Run the script again only after a change to the mockup itself: `node scripts/domino-css.cjs [<path to domino-design/src>]` (by default `../domino-design/src` beside the repository). Never edit `style/domino/` by hand; the Layout's own touches go in `style/domino-layout.scss` (see [Customize](Customize#styles)).

## Preview a release before it is live

```bash
node --use-system-ca scripts/kalio-live-preview.mjs <release-ULID> 9125
```

This serves a shop's real HTML with the loader pointed at that release, on `http://localhost:9125`. The ULID is in the release path that `kalio-verify-deploy.mjs` prints. It reads the showcase shop Bakio (`https://bakini.selldone.shop`) unless you name yours: `SHOP_URL=https://<your handle>.myselldone.com node --use-system-ca scripts/kalio-live-preview.mjs <release-ULID> 9125`.
