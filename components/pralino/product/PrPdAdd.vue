<!--
  Pralino — the product page's add box (pages-product.js .pd-add): "Add to
  bag", then − n + in its place, for the page's chosen variant. The count is
  the bag's own line through kalio-basket's queue (quick taps are never
  lost); "+" takes the focus when the box appears. Without a chosen option:
  "Choose an option" (inactive); sold out: "Sold out".
-->
<template>
  <button v-if="!q" :aria-disabled="blocked ? 'true' : undefined" :class="['btn', 'add', { '-off': blocked }]" type="button" @click.prevent.stop="more">
    {{ shownLabel }}
  </button>
  <div v-else :aria-label="t('pralino.add.inBag', '{name} in bag', { name: product.title })" class="qb" role="group">
    <button :aria-label="t('pralino.add.less', 'Remove one {name}', { name: product.title })" type="button" @click.prevent.stop="less"><pr-icon name="minus" /></button>
    <span aria-live="polite" class="qn">{{ q }}</span>
    <button
      ref="plus"
      :aria-disabled="full ? 'true' : undefined"
      :aria-label="t('pralino.add.more', 'Add one more {name}', { name: product.title })"
      :title="full ? t('pralino.add.noMore', 'No more in stock') : undefined"
      type="button"
      @click.prevent.stop="more"
    >
      <pr-icon name="plus" />
    </button>
  </div>
</template>

<script>
import PrIcon from "../PrIcon.vue";
import { addVariant, basketLine, pendingLine, pendingLineFor, shownCount, stepTo } from "../../kalio/kalio-basket";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrPdAdd",
  components: { PrIcon },
  props: {
    product: { type: Object, required: true },
    /** The page's chosen variant (null for a product without options). */
    variant: { type: Object, default: null },
    /** The product has options but none is chosen yet. */
    needsChoice: { type: Boolean, default: false },
  },
  computed: {
    line() {
      const p = this.product;
      if (!p) return null;
      if (this.variant) return basketLine(this, p, { id: this.variant.id }) || pendingLineFor(p, this.variant.id);
      if (this.needsChoice) return null;
      return basketLine(this, p) || pendingLine(p);
    },
    q() {
      return shownCount(this.product, this.line);
    },
    stock() {
      const n = this.variant ? this.variant.quantity : this.product.quantity;
      return Number.isFinite(Number(n)) ? Number(n) : 0;
    },
    soldOut() {
      return !(this.stock > 0);
    },
    full() {
      return !this.soldOut && this.q >= this.stock;
    },
    blocked() {
      return this.soldOut || this.full || this.needsChoice;
    },
    shownLabel() {
      if (this.soldOut) return t("pralino.pd.soldOut", "Sold out");
      if (this.needsChoice) return t("pralino.pd.chooseFirst", "Choose an option");
      return t("pralino.add.add", "Add to bag");
    },
  },
  watch: {
    q(now, before) {
      if (before === 0 && now > 0 && this.hadFocus) this.$nextTick(() => this.$refs.plus?.focus({ preventScroll: true }));
    },
  },
  methods: {
    t,
    more(e) {
      if (this.blocked) return;
      this.hadFocus = !!e?.currentTarget && document.activeElement === e.currentTarget;
      if (!this.q || !this.line) return addVariant(this, this.product, this.variant);
      stepTo(this, this.product, this.line, this.q + 1);
    },
    less() {
      if (this.q > 0 && this.line) stepTo(this, this.product, this.line, this.q - 1);
    },
  },
};
</script>
