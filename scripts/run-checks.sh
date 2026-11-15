#!/usr/bin/env bash
# Every kit check, one after the other (never two browsers on the shop at once: 429),
# each into its own log, then one line per check with its TOTAL.
#
# usage: bash scripts/run-checks.sh <base-url> <log-folder> [checks]
#   checks: comma list of names below (default: all)
# Needs MSYS_NO_PATHCONV=1 on Git Bash (set here). Dev: http://localhost:9150 · live: https://pralino.selldone.shop
set -u
export MSYS_NO_PATHCONV=1
BASE="${1:-http://localhost:9150}"
OUT="${2:-check-logs}"
ONLY="${3:-}"
KIT="$(cd "$(dirname "$0")/../.." && (pwd -W 2>/dev/null || pwd))/new-shop-kits"
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
mkdir -p "$OUT"
WAIT=".ftr"
SK='pralino-theme'
DARK="{\"$SK\":\"{\\\"palette\\\":\\\"pistachio\\\",\\\"mode\\\":\\\"dark\\\"}\"}"
LIGHT="{\"$SK\":\"{\\\"palette\\\":\\\"pistachio\\\",\\\"mode\\\":\\\"light\\\"}\"}"
YELLOW="{\"$SK\":\"{\\\"palette\\\":\\\"custom\\\",\\\"custom\\\":\\\"#ffff00\\\",\\\"mode\\\":\\\"dark\\\"}\"}"
AR="{\"local-shop-bakio\":\"ar\"}"
PAGES_ALL='home=/,category=/croissants-category,deals=/?filter={"only_has_discount":true},search=/?search=pistachio,product=/product/720375,product2=/product/720359,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,article=/blog/a-guide-to-the-croissant-collection-36221,about=/about-us,terms=/terms,privacy=/privacy,contact=/contact-us,faq=/faq,404=/no-such-page,cart=/basket/PHYSICAL,account=/user'
PAGES_MAIN='home=/,category=/croissants-category,deals=/?filter={"only_has_discount":true},search=/?search=pistachio,product=/product/720375,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,404=/no-such-page'
SIGNIN='(async () => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); await sleep(800); const s = [...document.querySelectorAll(".acc-nav button")].find((x) => /Sign in/i.test(x.textContent)); if (!s) return "FAIL no sign-in button"; s.click(); await sleep(1200); return true; })()'

want() { [ -z "$ONLY" ] || [[ ",$ONLY," == *",$1,"* ]]; }
run() { # name, command...
  local name="$1"; shift
  want "$name" || return 0
  echo "▶ $name"
  ( "$@" ) > "$OUT/$name.log" 2>&1
  printf '%-28s %s\n' "$name" "$(grep -E '^(TOTAL|PROBLEMS)' "$OUT/$name.log" | tail -1 || true)" | tee -a "$OUT/summary.txt"
}

run ring-dark   env PAGES="$PAGES_ALL" STORAGE="$DARK"  node "$KIT/single-vendor-shop/ring-sweep.cjs" "$BASE" "$WAIT"
run ring-light  env PAGES="$PAGES_ALL" STORAGE="$LIGHT" node "$KIT/single-vendor-shop/ring-sweep.cjs" "$BASE" "$WAIT"
run card-edge   node "$KIT/single-vendor-shop/card-edge-check.cjs" "$BASE/" "$BASE/#cat" "$BASE/?search=pistachio" "$BASE/?filter=%7B%22only_has_discount%22%3Atrue%7D"
run card-edge-pr-dark  env STORAGE="$DARK"  node "$ROOT/scripts/card-edge-pr.cjs" "$BASE/" "$BASE/#cat" "$BASE/?search=pistachio" "$BASE/?filter=%7B%22only_has_discount%22%3Atrue%7D" "$BASE/blog" "$BASE/about-us" "$BASE/faq" "$BASE/contact-us" "$BASE/user"
run card-edge-pr-light env STORAGE="$LIGHT" node "$ROOT/scripts/card-edge-pr.cjs" "$BASE/" "$BASE/#cat" "$BASE/?search=pistachio" "$BASE/blog" "$BASE/terms"
run corner      env PAGES="$PAGES_MAIN" STORAGE="$DARK" node "$KIT/single-vendor-shop/corner-clear-check.cjs" "$BASE" "$WAIT"
# CIRCLE_CURRENCIES="USD,AED,DKK,SAR": the circle checks try each currency (set the way the shop's picker
# does). LONG=1 reloads after each page, so a product page (a cold /product/ load gets Selldone's SEO page
# in a headless browser) is checked on its own without LONG.
CIRCLE_PAGES='home=/,deals=/?filter={"only_has_discount":true}'
run circle      env PAGES="$CIRCLE_PAGES" LONG=1 CURRENCIES="${CIRCLE_CURRENCIES:-}" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-ar   env PAGES="$CIRCLE_PAGES" LONG=1 CURRENCIES="${CIRCLE_CURRENCIES:-}" STORAGE="$AR" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-dark env PAGES="$CIRCLE_PAGES" LONG=1 CURRENCIES="${CIRCLE_CURRENCIES:-}" STORAGE="$DARK" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-pd   env PAGES='product=/product/720375,product2=/product/720359' CURRENCIES="${CIRCLE_CURRENCIES:-}" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-pd-ar env PAGES='product=/product/720375' CURRENCIES="${CIRCLE_CURRENCIES:-}" STORAGE="$AR" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run contrast-dark   env PAGES="$PAGES_ALL" STORAGE="$DARK"   node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-light  env PAGES="$PAGES_ALL" STORAGE="$LIGHT"  node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-yellow env PAGES="$PAGES_MAIN" STORAGE="$YELLOW" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-states-dark  env PAGES='home=/' STORAGE="$DARK"  OPEN='(async () => { const b = document.querySelector(innerWidth < 980 ? ".menu-btn" : ".bag-btn"); if (!b) return "FAIL no button"; b.click(); return true; })()' node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-states-light env PAGES='home=/' STORAGE="$LIGHT" OPEN='(async () => { const b = document.querySelector(innerWidth < 980 ? ".menu-btn" : ".bag-btn"); if (!b) return "FAIL no button"; b.click(); return true; })()' node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-signin-dark  env PAGES='account=/user' STORAGE="$DARK"  OPEN="$SIGNIN" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-signin-light env PAGES='account=/user' STORAGE="$LIGHT" OPEN="$SIGNIN" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-ar     env PAGES="$PAGES_MAIN" STORAGE="$AR" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run cart-dark   env SHOP=bakio WAIT="$WAIT" CART=".bag-btn" STORAGE_KEY="$SK" node "$ROOT/components/theme-switcher/tools/cart-audit.cjs" "$BASE" pistachio dark
run cart-light  env SHOP=bakio WAIT="$WAIT" CART=".bag-btn" STORAGE_KEY="$SK" node "$ROOT/components/theme-switcher/tools/cart-audit.cjs" "$BASE" pistachio light
run currency    env SHOP=bakio MENU=".menu-btn" MEGA="[aria-controls=dd-shop]" CART=".bag-btn" CATEGORY=/croissants-category DEALS='/?filter={"only_has_discount":true}' node "$ROOT/components/region-switcher/tools/currency-check.cjs" "$BASE" "$WAIT"
run box-dark    env STORAGE="$DARK"  node "$ROOT/scripts/box-check.cjs" "$BASE" "$WAIT"
run box-light   env STORAGE="$LIGHT" node "$ROOT/scripts/box-check.cjs" "$BASE" "$WAIT"
run box-ar      env STORAGE="$AR" STATES=0 node "$ROOT/scripts/box-check.cjs" "$BASE" "$WAIT"
run underline-dark  env STORAGE="$DARK"  node "$ROOT/scripts/underline-check.cjs" "$BASE" "$WAIT"
run underline-light env STORAGE="$LIGHT" WIDTHS=1440 node "$ROOT/scripts/underline-check.cjs" "$BASE" "$WAIT"
run ring-ar     env PAGES="$PAGES_MAIN" STORAGE="$AR" node "$KIT/single-vendor-shop/ring-sweep.cjs" "$BASE" "$WAIT"
echo "done"
