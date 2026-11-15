#!/usr/bin/env bash
# Pralino — every kit check, one after the other (never two browsers on the shop at once: 429),
# each into its own log, then one line per check with its TOTAL.
#
# usage: bash scripts/run-checks.sh <base-url> <log-folder> [checks]
#   checks: comma list of names below (default: all)
# Needs MSYS_NO_PATHCONV=1 on Git Bash (set here). Dev: http://localhost:9150 · live: https://pralino.selldone.shop
# Bakio sells in English only: on dev, localStorage "pralino-dev-languages" = "ar" offers Arabic in the test
# browser (StorefrontMixin, dev build only), so the Arabic runs below really render in Arabic.
# Widths: 1440, 1024 (the header's first desktop width) and 390 where a check takes WIDTHS; corner-clear
# 390–1920 with 1366; circles in USD, AED, DKK and SAR (LONG=1 also stress-tests a long code in every circle).
# i18n-ar IGNORE: Bakio's own data that equals an English string of the Layout (its gateway "Cash on delivery",
# its way "Worldwide shipping", the flavour "Pistachio", the cookies' spec key "Style", its counter note "Pickup counter at …",
# the bag drawer's "Total · <the gateway's name>" and a cookie's own pro "Sold as one cookie for an easy personal treat.").
set -u
export MSYS_NO_PATHCONV=1
BASE="${1:-http://localhost:9150}"
OUT="${2:-check-logs}"
ONLY="${3:-}"
KIT="$(cd "$(dirname "$0")/../.." && (pwd -W 2>/dev/null || pwd))/new-shop-kits"
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
mkdir -p "$OUT"
WAIT=".pr .ftr"
SK='pralino-theme'
W3="1440,1024,390"
# theme_of <palette> <light|dark> [custom #hex]: the storage value for that theme
theme_of() {
  if [ -n "${3:-}" ]; then echo "{\"$SK\":\"{\\\"palette\\\":\\\"custom\\\",\\\"custom\\\":\\\"$3\\\",\\\"mode\\\":\\\"$2\\\"}\"}"
  else echo "{\"$SK\":\"{\\\"palette\\\":\\\"$1\\\",\\\"mode\\\":\\\"$2\\\"}\"}"; fi
}
DARK="$(theme_of tan dark)"
LIGHT="$(theme_of tan light)"
AR="{\"local-shop-bakio\":\"ar\",\"pralino-dev-languages\":\"ar\"}"
ARDARK="{\"local-shop-bakio\":\"ar\",\"pralino-dev-languages\":\"ar\",\"$SK\":\"{\\\"palette\\\":\\\"tan\\\",\\\"mode\\\":\\\"dark\\\"}\"}"
CUR="${CIRCLE_CURRENCIES:-USD,AED,DKK,SAR}"
# The product ids and the article below are test inputs only (Bakio's own pieces), never in the Layout.
PAGES_ALL='home=/,category=/croissants-category,deals=/?filter={"only_has_discount":true},search=/?search=pistachio,product=/product/720375,product2=/product/720359,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,article=/blog/pickup-or-delivery-36222,about=/about-us,terms=/terms,privacy=/privacy,contact=/contact-us,faq=/faq,404=/no-such-page,cart=/basket/PHYSICAL,checkout=/basket/PHYSICAL?step=checkout,account=/user'
PAGES_MAIN='home=/,category=/croissants-category,deals=/?filter={"only_has_discount":true},search=/?search=pistachio,product=/product/720375,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,about=/about-us,404=/no-such-page'
BOX_PAGES='home=/,category=/croissants-category,deals=/?filter=%7B%22only_has_discount%22%3Atrue%7D,search=/?search=pistachio,product=/product/720375,product2=/product/720359,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,article=/blog/pickup-or-delivery-36222,404=/no-such-page,faq=/faq,contact=/contact-us,about=/about-us,terms=/terms,privacy=/privacy,account=/user'
UL_PAGES='home=/,category=/croissants-category,deals=/?filter={"only_has_discount":true},product=/product/720375,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,article=/blog/pickup-or-delivery-36222,about=/about-us,contact=/contact-us,faq=/faq,terms=/terms,privacy=/privacy,404=/no-such-page,account=/user'
SHAPE_PAGES='home=/,category=/croissants-category,deals=/?filter={"only_has_discount":true},search=/?search=pistachio,product=/product/720375,compare=/comparison?list=p720375_p720378_p720380,blog=/blog,article=/blog/pickup-or-delivery-36222,about=/about-us,contact=/contact-us,terms=/terms,privacy=/privacy,faq=/faq,404=/no-such-page,cart=/basket/PHYSICAL,account=/user'
BAG='.bag-btn >> visible=true'
OPEN_STATES='(async () => { const b = [...document.querySelectorAll(innerWidth < 980 ? ".menu-btn" : ".bag-btn")].find((x) => x.offsetParent); if (!b) return "FAIL no button"; b.click(); return true; })()'
OPEN_SIGNIN='(async () => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); window.$global_router.push("/user"); await sleep(3500); const s = [...document.querySelectorAll(".acc-nav button, .pr button")].find((x) => /Sign in/i.test(x.textContent)); if (!s) return "FAIL no sign-in button"; s.click(); await sleep(1500); return true; })()'
CIRCLE_PAGES='home=/,deals=/?filter={"only_has_discount":true},category=/croissants-category'

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
run ring-ar     env PAGES="$PAGES_MAIN" STORAGE="$AR" node "$KIT/single-vendor-shop/ring-sweep.cjs" "$BASE" "$WAIT"
run card-edge   env WIDTHS="$W3" node "$KIT/single-vendor-shop/card-edge-check.cjs" "$BASE/" "$BASE/#cat" "$BASE/?search=pistachio" "$BASE/?filter=%7B%22only_has_discount%22%3Atrue%7D"
run card-edge-pr-dark  env WIDTHS="$W3" STORAGE="$DARK"  node "$ROOT/scripts/card-edge-pr.cjs" "$BASE/" "$BASE/#cat" "$BASE/?search=pistachio" "$BASE/?filter=%7B%22only_has_discount%22%3Atrue%7D" "$BASE/blog" "$BASE/about-us" "$BASE/faq" "$BASE/contact-us" "$BASE/terms" "$BASE/privacy" "$BASE/user" "$BASE/comparison?list=p720375_p720378_p720380"
run card-edge-pr-light env WIDTHS="$W3" STORAGE="$LIGHT" node "$ROOT/scripts/card-edge-pr.cjs" "$BASE/" "$BASE/#cat" "$BASE/?search=pistachio" "$BASE/blog" "$BASE/about-us" "$BASE/contact-us"
run card-edge-pr-ar    env WIDTHS="1440,390" STORAGE="$AR" node "$ROOT/scripts/card-edge-pr.cjs" "$BASE/" "$BASE/#cat" "$BASE/blog" "$BASE/about-us"
run corner      env PAGES="$PAGES_MAIN" STORAGE="$DARK" WIDTHS="1920,1440,1366,1280,1024,900,768,390" node "$KIT/single-vendor-shop/corner-clear-check.cjs" "$BASE" "$WAIT"
run corner-ar   env PAGES="$PAGES_MAIN" STORAGE="$AR" WIDTHS="1920,1366,1024,390" node "$KIT/single-vendor-shop/corner-clear-check.cjs" "$BASE" "$WAIT"
run circle      env PAGES="$CIRCLE_PAGES" LONG=1 CURRENCIES="$CUR" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-ar   env PAGES="$CIRCLE_PAGES" LONG=1 CURRENCIES="$CUR" STORAGE="$AR" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-dark env PAGES="$CIRCLE_PAGES" LONG=1 STORAGE="$DARK" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-pd   env PAGES='product=/product/720375,product2=/product/720359' CURRENCIES="$CUR" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run circle-pd-ar env PAGES='product=/product/720375' CURRENCIES="$CUR" STORAGE="$AR" node "$KIT/single-vendor-shop/circle-fit-check.cjs" "$BASE" "$WAIT"
run contrast-dark   env WIDTHS="$W3" PAGES="$PAGES_ALL" STORAGE="$DARK"   node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-light  env WIDTHS="$W3" PAGES="$PAGES_ALL" STORAGE="$LIGHT"  node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
# One colour family: a palette re-tints every ground, so each palette is audited light and dark,
# and the custom colours the owner names (#ffff00, #00ffff, #111111) in both modes too.
for p in rose sage slate ink; do for m in light dark; do
  run "contrast-$p-$m" env WIDTHS="$W3" PAGES="$PAGES_MAIN" STORAGE="$(theme_of "$p" "$m")" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
done; done
for c in ffff00 00ffff 111111; do for m in light dark; do
  run "contrast-$c-$m" env PAGES="$PAGES_MAIN" STORAGE="$(theme_of custom "$m" "#$c")" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
done; done
run contrast-states-dark  env WIDTHS="$W3" PAGES='home=/' STORAGE="$DARK"  OPEN="$OPEN_STATES" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-states-light env WIDTHS="$W3" PAGES='home=/' STORAGE="$LIGHT" OPEN="$OPEN_STATES" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-signin-dark  env PAGES='home=/' STORAGE="$DARK"  OPEN="$OPEN_SIGNIN" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-signin-light env PAGES='home=/' STORAGE="$LIGHT" OPEN="$OPEN_SIGNIN" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-ar      env PAGES="$PAGES_MAIN" STORAGE="$AR" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run contrast-ar-dark env PAGES="$PAGES_MAIN" STORAGE="$ARDARK" node "$ROOT/components/theme-switcher/tools/contrast-audit.cjs" "$BASE" "$WAIT"
run cart-dark   env SHOP=bakio WAIT="$WAIT" CART=".bag-btn" STORAGE_KEY="$SK" node "$ROOT/components/theme-switcher/tools/cart-audit.cjs" "$BASE" tan dark
run cart-light  env SHOP=bakio WAIT="$WAIT" CART=".bag-btn" STORAGE_KEY="$SK" node "$ROOT/components/theme-switcher/tools/cart-audit.cjs" "$BASE" tan light
run currency    env WIDTHS="$W3" SHOP=bakio MENU=".menu-btn" MEGA="[aria-controls=dd-shop]" CART="$BAG" CATEGORY=/croissants-category DEALS='/?filter={"only_has_discount":true}' node "$ROOT/components/region-switcher/tools/currency-check.cjs" "$BASE" "$WAIT"
run box-dark    env WIDTHS="$W3" PAGES="$BOX_PAGES" STORAGE="$DARK"  node "$ROOT/scripts/box-check.cjs" "$BASE" "$WAIT"
run box-light   env WIDTHS="$W3" PAGES="$BOX_PAGES" STORAGE="$LIGHT" node "$ROOT/scripts/box-check.cjs" "$BASE" "$WAIT"
run box-ar      env PAGES="$BOX_PAGES" STORAGE="$AR" STATES=0 node "$ROOT/scripts/box-check.cjs" "$BASE" "$WAIT"
run i18n-ar     env IGNORE="Cash on delivery|Worldwide shipping|Pistachio|Style|/^Pickup counter at /|/ · cash on delivery$/|Sold as one cookie for an easy personal treat." I18N="$ROOT/components/kalio/i18n" LANGUAGES=ar SHOP=bakio MENU=".menu-btn" CART="$BAG" CATEGORY="@a[href$=\"-category\"]" PAGES="about=/about-us,contact=/contact-us,blog=/blog,terms=/terms,privacy=/privacy,account=/user,cart=/basket/PHYSICAL,compare=/comparison?list=p720375_p720378_p720380" node "$ROOT/scripts/i18n-check-forced.cjs" "$BASE" "$WAIT"
# One shape language: every edge a circle, 8 px (panel) or 4 px (inner), square only at the window's edge;
# focus rings keep the control's shape; nothing past the window; the overlays open
run shape-light env WIDTHS="$W3" PAGES="$SHAPE_PAGES" STORAGE="$LIGHT" node "$ROOT/scripts/shape-check.cjs" "$BASE" "$WAIT"
run shape-dark  env WIDTHS="$W3" PAGES="$SHAPE_PAGES" STORAGE="$DARK"  node "$ROOT/scripts/shape-check.cjs" "$BASE" "$WAIT"
run shape-teal  env WIDTHS="1440,390" PAGES="$PAGES_MAIN" STORAGE="$(theme_of custom light '#0f7b7b')" STATES=0 node "$ROOT/scripts/shape-check.cjs" "$BASE" "$WAIT"
run shape-ar    env WIDTHS="1440,390" PAGES="$PAGES_MAIN" STORAGE="$AR" STATES=0 node "$ROOT/scripts/shape-check.cjs" "$BASE" "$WAIT"
run underline-dark  env PAGES="$UL_PAGES" STORAGE="$DARK"  node "$ROOT/scripts/underline-check.cjs" "$BASE" "$WAIT"
run underline-light env PAGES="$UL_PAGES" STORAGE="$LIGHT" WIDTHS=1440 node "$ROOT/scripts/underline-check.cjs" "$BASE" "$WAIT"
echo "done"
