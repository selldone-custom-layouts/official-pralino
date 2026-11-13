<!--
  Domino — the shop's mark (pages.css .mark): the wordmark's first letter in
  the italic serif on cocoa with the accent dot, the avatar of the order's
  messages and the account. From the live title (or BRAND.name), never
  written in. sm: the 32px one beside a message.
-->
<template>
  <span :class="['mark', { sm }]" aria-hidden="true"><i>{{ letter }}</i><em></em></span>
</template>

<script>
import { BRAND } from "../../kalio/kalio-brand";

export default {
  name: "DmMark",
  inject: { $shop: { default: null } },
  props: { sm: { type: Boolean, default: false }, word: { type: String, default: "" } },
  computed: {
    letter() {
      const w = (this.word || BRAND.name || this.$shop?.title || "").trim();
      return Array.from(w)[0]?.toLowerCase() || "";
    },
  },
};
</script>
