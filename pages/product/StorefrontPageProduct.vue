<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!--
    Pralino — the product page (pralino-design/product-b.html,
    src/pages-product.js): the slim title band with the breadcrumb (Home ›
    collection › product); the gallery and the sticky buy column
    (PrProductOverview); the tabs — Description, Additional information,
    Reviews (PrProductTabs); "Buy together" (this and the best seller of two
    other collections, PrTogether); "More <collection>" (never this product,
    a full row of six, three or two). Selldone's own sections for other kinds
    of product (offers, includes, files, membership, a product landing page)
    follow when the product has them.
  -->
  <div class="pr pr-pdp s--product">
    <slot name="header" :center="true"></slot>
    <pr-pt :crumbs="crumbs" :label="t('pralino.pt.crumbs', 'Breadcrumb')" cls="slim" />

    <pr-product-overview v-if="product" :key="product.id" can-buy show-cover @reviews="$refs.tabs?.open('rev')" />
    <section v-else aria-hidden="true" class="pd pr-pd-skel">
      <div class="wrap pd-in">
        <div class="pd-gal"><div class="pd-main"></div></div>
        <div class="pd-buy"><i class="-a"></i><i class="-b"></i><i class="-c"></i><i class="-d"></i><i class="-e"></i></div>
      </div>
    </section>

    <template v-if="product">
      <pr-product-tabs ref="tabs" :product="product" />
      <pr-together :product="product" :variant="current_variant" />

      <div class="wrap pr-pd-sd">
        <s-product-offers class="s--product-section"></s-product-offers>
        <s-product-includes></s-product-includes>
        <s-product-files-list></s-product-files-list>
        <s-product-subscription-membership></s-product-subscription-membership>
      </div>
      <s-product-landing></s-product-landing>

      <section v-if="more.length" aria-labelledby="more-h" class="sec-s more">
        <div class="wrap">
          <header class="sec-hd sm">
            <p class="eyebrow">{{ t("pralino.pd.moreEyebrow", "From the same counter") }}</p>
            <h2 id="more-h" class="h2">{{ t("pralino.pd.moreH", "More {name}", { name: catTitle(cat) }) }}</h2>
          </header>
          <div class="grid six">
            <pr-card v-for="p in more" :key="p.id" :product="p" no-cat />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";
import PrPt from "../../components/pralino/ui/PrPt.vue";
import PrCard from "../../components/pralino/ui/PrCard.vue";
import PrProductOverview from "../../components/pralino/product/PrProductOverview.vue";
import PrProductTabs from "../../components/pralino/product/PrProductTabs.vue";
import PrTogether from "../../components/pralino/product/PrTogether.vue";
import { bySells, catOf, catTitle, catTo, pr, loadDm } from "../../components/pralino/pr";
import { rememberViewed } from "../../components/bakini/bakini";
import { t } from "../../components/kalio/i18n/kalio-i18n";
import { GtagEcommerce } from "@selldone/components-vue/plugins/gtag/GtagEcommerce";
import SProductIncludes from "@selldone/components-vue/storefront/product/includes/SProductIncludes.vue";
import SProductFilesList from "@selldone/components-vue/storefront/product/file/list/SProductFilesList.vue";
import SProductSubscriptionMembership from "@selldone/components-vue/storefront/product/subscription/membership/SProductSubscriptionMembership.vue";
import SProductOffers from "@selldone/components-vue/storefront/product/offers/SProductOffers.vue";
import { computed } from "vue";
import SProductAdminButton from "@selldone/components-vue/storefront/product/admin/button/SProductAdminButton.vue";
import { XapiProductGetTypes } from "@selldone/sdk-storefront/product";
import SProductLanding from "@selldone/components-vue/storefront/product/landing/SProductLanding.vue";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import { StorefrontSeo } from "../../helpers/StorefrontSeo";

export default {
  name: "StorefrontPageProduct",
  mixins: [CurrencyMixin],

  inject: ["$shop"],
  props: {},
  components: {
    PrPt,
    PrCard,
    PrProductOverview,
    PrProductTabs,
    PrTogether,
    SProductLanding,
    SProductAdminButton,
    SProductOffers,
    SProductSubscriptionMembership,
    SProductFilesList,
    SProductIncludes,
  },

  /* The product and the chosen variant, for Selldone's sections. */
  provide() {
    return {
      $product: computed(() => this.product),
      $variant: computed(() => this.current_variant),
    };
  },

  data: function () {
    return {
      product: null,
      busy: false,
      pr,
    };
  },

  computed: {
    current_variant() {
      return this.$store.getters.getCurrentSelectedVariant;
    },
    cat() {
      return this.product ? this.product.category || catOf(this.product.category_id) : null;
    },
    crumbs() {
      const out = [];
      if (this.cat) out.push({ to: catTo(this.cat), label: catTitle(this.cat) });
      if (this.product) out.push({ label: this.product.title });
      return out;
    },
    /* More of the same collection, best sellers first, never this one: six,
       three or two, so the row is always full. */
    more() {
      if (!this.product) return [];
      const l = bySells(this.pr.products.filter((p) => p.category_id === this.product.category_id && p.id !== this.product.id));
      const n = l.length >= 6 ? 6 : l.length >= 3 ? 3 : l.length >= 2 ? 2 : 0;
      return l.slice(0, n);
    },
  },

  watch: {
    $route() {
      this.getProduct();
    },
  },

  created() {
    loadDm();
    this.getProduct();
  },

  methods: {
    t,
    catTitle,
    catTo,

    getProduct() {
      const seoNavigation = StorefrontSeo.captureNavigation();
      const handleSuccessResponse = ({ product }: XapiProductGetTypes.IResponse) => {
        this.product = product;
        rememberViewed(product.id);

        GtagEcommerce.MeasuringViewsOfProductDetails(this.$shop, product, this.GetUserSelectedCurrency().code, "product-page");

        // Reject initial-load and superseded responses, including SDK cache callbacks.
        StorefrontSeo.updateProduct(product, this.$shop, seoNavigation, this.GetUserSelectedCurrency().code);
      };

      if (window.PRE_LOADED_DATA?.PRODUCT_PACK) {
        console.log("⚡ Turbo load product.");
        handleSuccessResponse(window.PRE_LOADED_DATA.PRODUCT_PACK);
        window.PRE_LOADED_DATA = null; // Clear!
      } else {
        this.busy = true;
      }

      window.$storefront.products
        .optimize(60)
        .get(this.getId(this.$route.params.product_id), {
          "augmented-categories": 3, // Return 3 categories in the parent folder of current category
          "augmented-cross-sells": true, // Return max 3 cross-selling items
        })
        .cache(handleSuccessResponse)
        .then(handleSuccessResponse)
        .catch((e) => {
          NotificationService.showLaravelError(e);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
