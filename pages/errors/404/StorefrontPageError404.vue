<!--
  Pralino — page not found (pralino-design/404-b.html, pages-shop.js "404"):
  inside the Layout, with the header and footer (router: BakiniNotFound).
  Two faint drawings, the outlined 404, "This page is not on the counter"
  and why, a search (Selldone's own catalogue search), "Back to the home
  page" and "See the deals"; then "A few pastries to try instead": six
  best sellers, one collection after another, as cards.
-->
<template>
  <div class="pr pr-404">
    <section aria-labelledby="nf-h" class="nf">
      <pr-art name="cake" wrap="nf-a1" /><pr-art name="whisk" wrap="nf-a2" />
      <div class="wrap nf-in">
        <svg aria-hidden="true" class="nf-num" focusable="false" viewBox="0 0 360 150"><text text-anchor="middle" x="180" y="128">404</text></svg>
        <h1 id="nf-h" class="nf-h">{{ t("pralino.nf.h", "This page is not on the counter") }}</h1>
        <p class="nf-p">{{ t("pralino.nf.p", "The link may be old, or the page has moved. Search for a pastry, or start again from the home page.") }}</p>
        <form class="nf-srch" role="search" @submit.prevent="go">
          <label class="sr" for="nfq">{{ t("pralino.nf.search", "Search the bakery") }}</label><pr-icon name="search" /><input
            id="nfq"
            v-model="q"
            :placeholder="placeholder"
            autocomplete="off"
            enterkeyhint="search"
            type="search"
          /><button class="btn sm" type="submit">{{ t("pralino.nf.go", "Search") }}</button>
        </form>
        <div class="nf-acts">
          <router-link :to="{ path: '/' }" class="btn alt">{{ t("pralino.nf.home", "Back to the home page") }}</router-link>
          <router-link :to="dealsTo" class="qlink">{{ t("pralino.nf.deals", "See the deals") }}</router-link>
        </div>
      </div>
    </section>
    <section v-if="picks.length" aria-labelledby="nft-h" class="sec-s nf-try">
      <div class="wrap">
        <header class="sec-hd sm">
          <p class="eyebrow">{{ t("pralino.nf.whileHere", "While you are here") }}</p>
          <h2 id="nft-h" class="h2">{{ t("pralino.nf.tryH", "A few pastries to try instead") }}</h2>
        </header>
        <div class="grid six">
          <pr-card v-for="p in picks" :key="p.id" :product="p" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PrIcon from "../../../components/pralino/PrIcon.vue";
import PrArt from "../../../components/pralino/PrArt.vue";
import PrCard from "../../../components/pralino/ui/PrCard.vue";
import { bySells, catTitle, pr, loadDm, mixed } from "../../../components/pralino/pr";
import { catalogueRoute, dealsRoute } from "../../../components/kalio/kalio-catalog";
import { t } from "../../../components/kalio/i18n/kalio-i18n";

export default defineComponent({
  name: "StorefrontPageError404",
  components: { PrIcon, PrArt, PrCard },
  data: () => ({ q: "", pr }),
  computed: {
    /* Six best sellers in stock, one collection after another. */
    picks(): any[] {
      return mixed(bySells(this.pr.products.filter((x: any) => x.quantity > 0))).slice(0, 6);
    },
    /* "Search croissants, tarts…" from the shop's own collections. */
    placeholder(): string {
      const names = this.pr.cats.slice(0, 2).map((c: any) => catTitle(c).toLowerCase());
      return names.length ? t("pralino.nf.ph", "Search {names}…", { names: names.join(", ") }) : t("pralino.nf.search", "Search the bakery");
    },
    dealsTo(): any {
      return dealsRoute();
    },
  },
  created() {
    loadDm();
    (this as any).setPageTitle?.(t("pralino.nf.title", "Page not found"));
  },
  methods: {
    t,
    go() {
      const text = this.q.trim();
      const r = (window as any).$storefront.routes;
      this.$router.push(text ? { name: r.SHOP_PAGE, query: { search: text } } : catalogueRoute({}));
    },
  },
});
</script>
