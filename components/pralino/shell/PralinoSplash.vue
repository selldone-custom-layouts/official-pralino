<!--
  Pralino — the in-app splash (new-shop-kits/loading/IN-APP-SPLASH.md). Selldone removes the domain's custom
  loading frame as soon as the app starts (about half a second with a warm cache), so the Layout draws the same
  picture itself and keeps it until the page is really ready:

  - the frame's picture (new-shop-kits/loading/configs/pralino.json, make-loading.cjs): the ground, a faint ring
    with a tan arc turning once every 1.2 s, the croissant line art already drawn, and the brand under it — the
    shop's own title drawn like the header's wordmark (Cormorant Garamond, capitalised, shrinking with its length,
    two lines at most, right to left by itself) with its city under it, from the live shop record, never written
    in (or the Layout's logo image when BRAND sets one). Colours are the family tokens, so a palette, dark mode or a
    custom colour re-tints it; reduced motion keeps it still.
  - Only on the first page load of a browser session (sessionStorage "pralino-splash").
  - It hides (a 300 ms fade) once the shop's details, the collections and the catalogue are in and the first route
    has drawn, the first photo in view has decoded (or 2.5 s have passed since it began), and 1.2 s have passed
    since navigation start (not with reduced motion); always by 4 s; at once on a route error. The pages render
    underneath, so nothing waits for the fade.
-->
<template>
  <teleport to="body">
    <div v-if="on" :class="['pr-splash', { out: fading }]" role="status">
      <span class="pr-splash__sr">{{ t("pralino.splash.loading", "Loading {shop}", { shop: word || "" }) }}</span>
      <div class="pr-splash__ld">
        <svg :style="{ '--pr-splash-delay': delay }" aria-hidden="true" class="pr-splash__mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle class="pr-splash__base" cx="60" cy="60" r="56" />
          <circle class="pr-splash__arc" cx="60" cy="60" r="56" />
          <g class="pr-splash__art" transform="translate(18 14) scale(.7)">
            <path d="M10 80c2-14 13-24 25-27 6-12 16-19 25-19s19 7 25 19c12 3 23 13 25 27-6 4-14 4-20-2-2 8-8 12-14 12-4 6-10 9-16 9s-12-3-16-9c-6 0-12-4-14-12-6 6-14 6-20 2z" />
            <path d="M35 53c5 8 7 18 5 28M60 34c2 12 2 31 0 47M85 53c-5 8-7 18-5 28" />
            <path d="M24 66c3 2 6 3 9 3M96 66c-3 2-6 3-9 3" />
          </g>
        </svg>
        <div aria-hidden="true" class="pr-splash__brand">
          <img v-if="logo" :src="logo" alt="" class="pr-splash__logo" />
          <span v-else-if="word" :style="{ '--pr-splash-size': nameSize + 'px' }" class="pr-splash__name" dir="auto">{{ word }}</span>
          <span v-if="city" class="pr-splash__sub" dir="auto">{{ city }}</span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { BRAND } from "../../kalio/kalio-brand";
import { t } from "../../kalio/i18n/kalio-i18n";
import { pr, shopFacts } from "../pr";

const KEY = "pralino-splash";
const MIN = 1200;
const CAP = 4000;
const PHOTO_WAIT = 2500;

export default {
  name: "PralinoSplash",
  data: () => ({ on: false, fading: false, pr, delay: "0ms" }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    word() {
      const w = String(BRAND.name || this.shop?.title || "").trim();
      return w.charAt(0).toUpperCase() + w.slice(1);
    },
    /* the Layout's own logo image, only when BRAND sets one (Pralino draws a wordmark) */
    logo() {
      return BRAND.logo || "";
    },
    city() {
      try {
        return this.word ? shopFacts(this.shop).city || "" : "";
      } catch {
        return "";
      }
    },
    /* the frame's rule: 42 px for a short name, smaller as it grows (make-loading.cjs) */
    nameSize() {
      const n = Array.from(this.word).length;
      const size = Math.max(22, Math.min(42, Math.round(420 / Math.max(n, 1) + 8)));
      return typeof window !== "undefined" && window.innerWidth <= 420 ? Math.max(20, Math.round(size * 0.86)) : size;
    },
  },
  created() {
    /* dev build only: localStorage "pralino-splash-hold" = "1" keeps it up for the checks (scripts/splash-check.mjs) */
    this.hold = import.meta.env.DEV && (() => { try { return localStorage.getItem("pralino-splash-hold") === "1"; } catch { return false; } })();
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
      sessionStorage.setItem(KEY, "1");
    } catch {
      seen = false;
    }
    /* past the 4 s cap already (a very slow start): no splash at all, never a flash of one */
    if (!this.hold && (seen || performance.now() >= CAP)) return;
    this.on = true;
    /* the arc picks up where the frame's left it (both started at navigation start) */
    this.delay = -Math.round(performance.now() % 1200) + "ms";
  },
  mounted() {
    if (!this.on) return;
    this.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    this.offError = this.$router.onError(() => this.hide(true));
    if (!this.hold) this.capTimer = setTimeout(() => this.hide(), Math.max(0, CAP - performance.now()));
    this.poll = setInterval(() => this.check(), 100);
  },
  beforeUnmount() {
    this.stop();
  },
  methods: {
    t,
    stop() {
      clearInterval(this.poll);
      clearTimeout(this.capTimer);
      this.offError?.();
    },
    /* the first photo in view in the page (the hero's), decoded or given up on after 2.5 s */
    photoReady() {
      if (this.photoDone) return true;
      const img = [...document.querySelectorAll(".v-main img")].find((i) => {
        const r = i.getBoundingClientRect();
        return r.width > 40 && r.height > 40 && r.top < window.innerHeight && r.bottom > 0;
      });
      /* a page with no photo in view (the FAQ, a 404 with its search): nothing to wait for */
      if (!img) {
        if (!this.noPhotoSince) this.noPhotoSince = performance.now();
        return performance.now() - this.noPhotoSince > 300;
      }
      if (!this.photoSince) {
        this.photoSince = performance.now();
        const done = () => (this.photoDone = true);
        (img.decode ? img.decode() : Promise.resolve()).then(done, done);
      }
      if (performance.now() - this.photoSince > PHOTO_WAIT) this.photoDone = true;
      return !!this.photoDone;
    },
    check() {
      if (this.hold) return;
      const facts = shopFacts(this.shop);
      const data = facts.ready && this.pr.ready && this.pr.catsReady && !!document.querySelector(".v-main .pr");
      if (!data) return;
      if (!this.photoReady()) return;
      if (!this.reduce && performance.now() < MIN) return;
      this.hide();
    },
    hide(now = false) {
      if (!this.on || this.fading) return;
      this.stop();
      if (now || this.reduce) {
        this.on = false;
        return;
      }
      this.fading = true;
      setTimeout(() => (this.on = false), 300);
    },
  },
};
</script>

<style>
/* The frame's picture, in the family tokens (light: the Tan values of configs/pralino.json). */
.pr-splash {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  background: var(--pr-bg, #ffffff);
  color: var(--pr-ink, #2d2d2d);
  font-family: var(--pr-sans, "Mulish", system-ui, sans-serif);
  -webkit-font-smoothing: antialiased;
  opacity: 1;
  transition: opacity 0.3s ease;
}
.pr-splash.out {
  opacity: 0;
  pointer-events: none;
}
.pr-splash__ld {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  max-width: min(88vw, 560px);
  box-sizing: border-box;
  text-align: center;
}
.pr-splash__mark {
  width: 120px;
  height: 120px;
  display: block;
  flex: none;
}
.pr-splash__base {
  fill: none;
  stroke: var(--pr-line, #e4dcd2);
  stroke-width: 1.2;
}
.pr-splash__arc {
  fill: none;
  stroke: var(--pr-act-text, #8c6844);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 62 290;
  transform-origin: 60px 60px;
  animation: pr-splash-turn 1.2s linear infinite;
  animation-delay: var(--pr-splash-delay, 0ms);
}
.pr-splash__art {
  fill: none;
  stroke: var(--pr-ink, #2d2d2d);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.pr-splash__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
}
.pr-splash__logo {
  display: block;
  max-width: min(220px, 70vw);
  max-height: 72px;
  width: auto;
  height: auto;
  object-fit: contain;
}
.pr-splash__name {
  font: 500 var(--pr-splash-size, 42px) / 1.05 var(--pr-serif, "Cormorant Garamond", Georgia, serif);
  letter-spacing: 0.04em;
  color: var(--pr-ink, #2d2d2d);
  max-width: 100%;
  overflow-wrap: anywhere;
}
.pr-splash__sub {
  font: 700 9px/1.4 var(--pr-sans, "Mulish", system-ui, sans-serif);
  letter-spacing: 0.38em;
  padding-inline-start: 0.38em;
  text-transform: uppercase;
  color: var(--pr-muted, #646464);
  margin-top: 9px;
  max-width: 100%;
}
.pr-splash__name:dir(rtl),
.pr-splash__sub:dir(rtl) {
  letter-spacing: 0;
  padding-inline-start: 0;
}
.pr-splash__sub:dir(rtl) {
  font-size: 12px;
  text-transform: none;
}
.pr-splash__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes pr-splash-turn {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 420px) {
  .pr-splash__mark {
    width: 92px;
    height: 92px;
  }
  .pr-splash__logo {
    max-height: 56px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pr-splash,
  .pr-splash__arc {
    animation: none;
    transition: none;
  }
}
</style>
