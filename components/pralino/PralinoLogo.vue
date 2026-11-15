<!--
  Pralino — the wordmark (pralino-design/src/b.css .wm): the shop's own live
  title in lower case, Cormorant italic, then a small pistachio dot (the
  palette's light shade). Nothing is written in: the word is BRAND.name when
  the Layout sets one (kalio-brand.ts), else the shop's title, so another
  bakery that imports the Layout gets its own name drawn the same way. A
  long title steps the size down so it never leaves the header.
-->
<template>
  <component :is="to ? 'router-link' : 'span'" :aria-label="label" :class="['wm', 'pr-wm', size]" :to="to">
    <span aria-hidden="true" class="wm-name">{{ word }}</span><i aria-hidden="true" class="wm-dot"></i>
  </component>
</template>

<script>
import { BRAND } from "../kalio/kalio-brand";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "PralinoLogo",
  inject: { $shop: { default: null } },
  props: {
    to: { type: [Object, String, null], default: () => ({ path: "/" }) },
  },
  computed: {
    word() {
      return (BRAND.name || this.$shop?.title || "").trim().toLowerCase();
    },
    size() {
      const n = Array.from(this.word).length;
      return n > 16 ? "-xl" : n > 10 ? "-long" : "";
    },
    label() {
      return this.to ? t("pralino.logo.homeOf", "{name}, home", { name: this.word }) : this.word;
    },
  },
};
</script>
