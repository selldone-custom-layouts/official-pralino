<!--
  Pralino — the quick view (pages-shop.js qvBody(), the "qv" sheet): the
  pastry on its plate, the collection, the name, "Per <unit> · In stock",
  the price with the was-price and the saving, the add box and "View full
  details". Opened from a card's eye (pr.ts openQuick); one per page, in the
  header's layers.
-->
<template>
  <pr-modal id="qv" :title="t('pralino.qv.title', 'Quick view')" cls="qvm">
    <div v-if="p" class="qv">
      <div class="qv-pl"><img :alt="p.title" :src="img" height="640" width="640" /></div>
      <div class="qv-tx">
        <p v-if="catName" class="pc-c"><bdi>{{ catName }}</bdi></p>
        <h3 class="qv-n">{{ p.title }}</h3>
        <p class="qv-u">{{ t("pralino.card.per", "Per {unit}", { unit }) }} · {{ stock }}</p>
        <p class="qv-pr">
          <span class="now money">{{ money(pv.now) }}</span><template v-if="pv.was">{{ " " }}<s class="was money">{{ money(pv.was) }}</s></template
          ><span v-if="pv.save > 0" class="save">{{ t("pralino.card.save", "Save {amount}", { amount: money(pv.save) }) }}</span>
        </p>
        <div class="qv-add"><pr-add :product="p" /></div>
        <router-link :to="to" class="qlink arrowed" @click="close">{{ t("pralino.qv.details", "View full details") }}<pr-icon name="arrow" /></router-link>
      </div>
    </div>
  </pr-modal>
</template>

<script>
import PrModal from "./PrModal.vue";
import PrIcon from "../PrIcon.vue";
import PrAdd from "../PrAdd.vue";
import { catOf, catTitle, closeLayer, layer, money, priceView, productImage, productTo, unitOf } from "../pr";
import { currentCurrency } from "../../region-switcher/region";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrQuickView",
  components: { PrModal, PrIcon, PrAdd },
  data: () => ({ layer }),
  computed: {
    p() {
      return this.layer.quick;
    },
    shop() {
      return this.$store.getters.getShop;
    },
    pv() {
      void currentCurrency();
      return priceView(this.shop, this.p);
    },
    img() {
      return productImage(this.p);
    },
    to() {
      return productTo(this.p);
    },
    unit() {
      return unitOf(this.p);
    },
    catName() {
      return catTitle(catOf(this.p?.category_id));
    },
    stock() {
      const q = Number(this.p?.quantity);
      if (!(q > 0)) return t("pralino.card.soldOut", "Sold out");
      return q <= 5 ? t("pralino.card.onlyLeftCap", "Only {n} left", { n: q }) : t("pralino.card.inStock", "In stock");
    },
  },
  methods: {
    t,
    money,
    close() {
      closeLayer(true);
    },
  },
};
</script>
