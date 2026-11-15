<!--
  Pralino — the product card (pralino-design/src/shell.js card()): the plate
  with the cut-out (a fixed square, the photo contained), the −25% roundel and
  the quick-view eye in the plate's top corners (no words there), then the
  collection, the name (two lines), "Per <unit>" (and "only n left" when five
  or fewer), the price with the struck was-price, the saving, and "Add to
  bag", which turns into − n + in place (PrAdd). The roundel's words always
  fit their circle (fit-in-circle). A card without a saving keeps the saving
  line's height, so a row's buttons stay level.
-->
<template>
  <article :class="['pc', cls]" :style="delay != null ? { '--d': delay + 'ms' } : null">
    <div class="pc-plate">
      <router-link :to="to" aria-hidden="true" class="pc-ph" tabindex="-1">
        <img
          :loading="eager ? 'eager' : 'lazy'"
          :src="img"
          :srcset="srcset"
          alt=""
          decoding="async"
          draggable="false"
          height="640"
          sizes="(max-width: 760px) 40vw, 200px"
          width="640"
          @error="dropSrcset"
        />
      </router-link>
      <span v-if="pv.off > 0" ref="off" :aria-label="t('pralino.card.offAria', '{off} percent off', { off: pv.off })" class="pc-off"><span dir="ltr">−{{ pv.off }}%</span></span>
      <button :aria-label="t('pralino.card.quick', 'Quick view: {name}', { name: product.title })" aria-controls="qv" class="pc-qv" type="button" @click="quick($event)">
        <pr-icon name="eye" />
      </button>
    </div>
    <div class="pc-tx">
      <p v-if="!noCat && catName" class="pc-c"><bdi>{{ catName }}</bdi></p>
      <h3 class="pc-t">
        <router-link :to="to">{{ product.title }}</router-link>
      </h3>
      <p class="pc-u">
        {{ t("pralino.card.per", "Per {unit}", { unit }) }}<template v-if="low">{{ " · " }}<span class="low">{{ t("pralino.card.onlyLeft", "only {n} left", { n: product.quantity }) }}</span></template>
      </p>
      <p class="pc-pr">
        <span class="now money">{{ money(pv.now) }}</span><template v-if="pv.was">{{ " " }}<s class="was money">{{ money(pv.was) }}</s></template>
      </p>
      <p :aria-hidden="pv.save > 0 ? undefined : 'true'" :class="['pc-sv', { '-none': !(pv.save > 0) }]">
        {{ pv.save > 0 ? t("pralino.card.save", "Save {amount}", { amount: money(pv.save) }) : " " }}
      </p>
      <div class="pc-add"><pr-add :product="product" /></div>
    </div>
  </article>
</template>

<script>
import PrIcon from "../PrIcon.vue";
import PrAdd from "../PrAdd.vue";
import { catOf, catTitle, money, openQuick, priceView, productImage, productTo, unitOf } from "../pr";
import { dropSrcset, productSrcset } from "../../kalio/kalio-catalog";
import { currentCurrency } from "../../region-switcher/region";
import { fitInCircle } from "../../bakini/fit-in-circle";
import { fitOnResize } from "../pr-fit";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrCard",
  components: { PrIcon, PrAdd },
  props: {
    product: { type: Object, required: true },
    noCat: Boolean,
    eager: Boolean,
    cls: { type: [String, Array, Object], default: "" },
    delay: { type: Number, default: null },
  },
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    pv() {
      void currentCurrency();
      return priceView(this.shop, this.product);
    },
    to() {
      return productTo(this.product);
    },
    img() {
      return productImage(this.product);
    },
    srcset() {
      return productSrcset(this.product);
    },
    unit() {
      return unitOf(this.product);
    },
    low() {
      const q = Number(this.product.quantity);
      return q > 0 && q <= 5;
    },
    catName() {
      return catTitle(catOf(this.product.category_id));
    },
  },
  watch: {
    "pv.off"() {
      this.$nextTick(() => fitInCircle(this.$refs.off));
    },
  },
  beforeUnmount() {
    this.unfit?.();
  },
  mounted() {
    this.unfit = fitOnResize(() => fitInCircle(this.$refs.off));
    this.$nextTick(() => fitInCircle(this.$refs.off));
    document.fonts?.ready?.then(() => fitInCircle(this.$refs.off));
  },
  methods: {
    t,
    money,
    dropSrcset,
    quick(e) {
      openQuick(this.product, e.currentTarget);
    },
  },
};
</script>
