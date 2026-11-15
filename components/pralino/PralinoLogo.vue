<!--
  Pralino — the wordmark (pralino-design/src/pralino.css .wm-name / .wm-sub): the shop's own live title in
  Cormorant Garamond, with the shop's city in small tracked capitals under it. Nothing is written in: the
  word is BRAND.name when the Layout sets one (kalio-brand.ts), else the shop's title; the city comes from
  the shop's own address. Another bakery that imports the Layout gets its own name and town drawn the same
  way. A long title steps the size down so it never leaves the header.
-->
<template>
  <component :is="to ? 'router-link' : 'span'" :aria-label="label" :class="['wm', 'pr-wm', size]" :to="to">
    <span aria-hidden="true" class="wm-name">{{ word }}</span><span v-if="city" aria-hidden="true" class="wm-sub">{{ city }}</span>
  </component>
</template>

<script>
import { BRAND } from "../kalio/kalio-brand";
import { t } from "../kalio/i18n/kalio-i18n";
import { shopFacts } from "./pr";

export default {
  name: "PralinoLogo",
  inject: { $shop: { default: null } },
  props: {
    to: { type: [Object, String, null], default: () => ({ path: "/" }) },
  },
  computed: {
    word() {
      const w = (BRAND.name || this.$shop?.title || "").trim();
      return w.charAt(0).toUpperCase() + w.slice(1);
    },
    city() {
      try {
        return shopFacts(this.$shop).city || "";
      } catch {
        return "";
      }
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
