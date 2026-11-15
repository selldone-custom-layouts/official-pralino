<!--
  Pralino — the page-title band (pralino-design/src/shell.js pt(), nicdark's
  title band): cocoa, a scalloped lower edge, two faint drawings, the
  breadcrumb (Home first), the italic title and a lead. cls: "compact",
  "slim" (breadcrumb only), "art-pt". The default slot is the band's extra
  (a search form, the checkout steps, a sample tag).
-->
<template>
  <section :aria-label="label || undefined" :class="['pt', cls]">
    <pr-art :name="art" wrap="pt-a1" /><pr-art :name="art2" wrap="pt-a2" />
    <div class="wrap pt-in">
      <nav :aria-label="t('pralino.pt.crumbs', 'Breadcrumb')" class="crumbs">
        <ol>
          <li>
            <router-link :to="{ path: '/' }">{{ t("pralino.pt.home", "Home") }}</router-link>
          </li>
          <li v-for="(c, i) in crumbs" :key="i">
            <router-link v-if="c.to" :to="c.to"><bdi>{{ c.label }}</bdi></router-link>
            <span v-else aria-current="page"><bdi>{{ c.label }}</bdi></span>
          </li>
        </ol>
      </nav>
      <h1 v-if="title" class="pt-h"><bdi>{{ title }}</bdi></h1>
      <p v-if="lead" class="pt-l">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<script>
import PrArt from "../PrArt.vue";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrPt",
  components: { PrArt },
  props: {
    crumbs: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    lead: { type: String, default: "" },
    cls: { type: String, default: "" },
    label: { type: String, default: "" },
    art: { type: String, default: "croissant" },
    art2: { type: String, default: "macaron" },
  },
  methods: { t },
};
</script>
