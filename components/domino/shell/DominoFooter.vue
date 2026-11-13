<!--
  Domino — the footer (domino-design/src/domino.js footer(); set B): a dark
  cocoa band over the slot domino-footer (a dark linen texture; without the
  photo, the mockup's fine dot texture), one line in the large serif that
  says how orders reach the buyer (from the shop's own ways), the counter's
  address and days and hours, the email and the phone set large. Then the
  Theme band (the owner's rule of 10 November 2026: palettes, a custom
  colour and Light / Dark, in a band of its own above the legal row; the
  kit's ThemeSwitcherRow, only on the showcase shop). Then the legal row:
  Privacy, Terms, FAQ, Selldone's cookie settings, the copyright and city,
  the shop's social links and a small "made with" credit. A shop with
  custom footer code keeps Selldone's footer (StorefrontLayout).
-->
<template>
  <div class="dm dm-ftrwrap">
    <footer class="ftr">
      <dm-photo aria-hidden="true" art="croissant" class="ftr-tex" deep name="domino-footer">
        <template #fallback><span aria-hidden="true" class="ph-art"></span></template>
      </dm-photo>
      <div class="wrap ftr-in">
        <p class="ftr-line">{{ line }}</p>
        <div v-if="facts.address || openLine" class="ftr-col">
          <h3>{{ t("domino.ftr.address", "Address") }}</h3>
          <p v-if="addressLines.length">
            <template v-for="(l, i) in addressLines" :key="i"><bdi>{{ l }}</bdi><br v-if="i < addressLines.length - 1" /></template>
          </p>
          <p v-if="openLine" class="ftr-h">{{ openLine }}</p>
        </div>
        <div v-if="facts.email || facts.phone" class="ftr-col">
          <h3>{{ t("domino.ftr.contact", "Contact") }}</h3>
          <p v-if="facts.email">
            <a :href="'mailto:' + facts.email">{{ facts.email }}</a>
          </p>
          <a v-if="facts.phone" :href="'tel:' + facts.phone.replace(/[^\d+]/g, '')" class="ftr-phone" dir="ltr">{{ facts.phone }}</a>
        </div>
      </div>

      <!-- The theme switcher (the owner, 10 November 2026: in the footer on
           every Layout), only on the Layout's showcase shop. -->
      <div v-if="theme.enabled" class="dts-row">
        <div class="wrap dts-in"><theme-switcher-row /></div>
      </div>

      <div class="ftr-bot">
        <div class="wrap fb-in">
          <nav :aria-label="t('domino.ftr.legal', 'Legal')">
            <router-link :to="{ name: r.SHOP_PROFILE_PAGE_PRIVACY }">{{ t("domino.ftr.privacy", "Privacy") }}</router-link>
            <router-link :to="{ name: r.SHOP_PROFILE_PAGE_TERMS }">{{ t("domino.ftr.terms", "Terms") }}</router-link>
            <router-link :to="faqTo">{{ t("domino.ftr.faq", "FAQ") }}</router-link>
            <s-footer-section-gdpr class="dm-gdpr"></s-footer-section-gdpr>
          </nav>
          <div class="fb-end">
            <s-storefront-social-buttons class="dm-social"></s-storefront-social-buttons>
            <span>© {{ year }} <bdi>{{ shopName }}</bdi><template v-if="facts.city"> · <bdi>{{ facts.city }}</bdi></template></span>
            <s-footer-section-selldone class="dm-made"></s-footer-section-selldone>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import DmPhoto from "../DmPhoto.vue";
import ThemeSwitcherRow from "../../theme-switcher/ThemeSwitcherRow.vue";
import { themeState } from "../../theme-switcher/theme-switcher";
import SStorefrontSocialButtons from "@selldone/components-vue/storefront/social/SStorefrontSocialButtons.vue";
import SFooterSectionGdpr from "@selldone/components-vue/storefront/footer/section/gdpr/SFooterSectionGdpr.vue";
import SFooterSectionSelldone from "@selldone/components-vue/storefront/footer/section/selldone/SFooterSectionSelldone.vue";
import { loadDm, shopFacts } from "../dm";
import { t } from "../../kalio/i18n/kalio-i18n";

/* A US state's two letters for the address line ("CA"). */
const US = { California: "CA", "New York": "NY", Texas: "TX", Washington: "WA", Illinois: "IL", Florida: "FL", Massachusetts: "MA", Oregon: "OR" };

export default {
  name: "DominoFooter",
  components: { DmPhoto, ThemeSwitcherRow, SStorefrontSocialButtons, SFooterSectionGdpr, SFooterSectionSelldone },
  data: () => ({ theme: themeState }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    r() {
      return window.$storefront.routes;
    },
    facts() {
      return shopFacts(this.shop);
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    year() {
      return new Date().getFullYear();
    },
    faqTo() {
      return this.$router.hasRoute("ShopFAQ") ? { name: "ShopFAQ" } : { name: this.r.SHOP_CONTACT_US };
    },
    /* "Come to the counter, or let the courier come to you." From the shop's ways. */
    line() {
      const f = this.facts;
      if (f.pickup && f.courier) return t("domino.ftr.lineBoth", "Come to the counter, or let the courier come to you.");
      if (f.courier) return t("domino.ftr.lineCourier", "Let the courier come to you.");
      if (f.pickup) return t("domino.ftr.linePickup", "Come to the counter.");
      if (f.shipping) return t("domino.ftr.lineShip", "Sold one by one, shipped to your door.");
      return t("domino.ftr.lineNone", "Sold one by one.");
    },
    /* The street; city, state and postcode; the country. */
    addressLines() {
      const f = this.facts;
      const p = f.pickupPoint;
      const street = p?.address || String(f.address || "").split(",")[0];
      const region = US[f.region] || f.region || "";
      const cityLine = [f.city, [region, f.postal].filter(Boolean).join(" ")].filter(Boolean).join(", ");
      return [street, cityLine, f.country].filter(Boolean);
    },
    openLine() {
      const f = this.facts;
      if (!f.days.length && !f.hours) return "";
      if (f.everyDay) return f.hours ? t("domino.hdr.openEvery", "Open every day {hours}", { hours: f.hours }) : t("domino.hdr.openEveryNoHours", "Open every day");
      return f.hours
        ? t("domino.hdr.openDays", { one: "Open {n} day a week, {hours}", other: "Open {n} days a week, {hours}" }, { n: f.days.length, hours: f.hours })
        : t("domino.hdr.openDaysNoHours", { one: "Open {n} day a week", other: "Open {n} days a week" }, { n: f.days.length });
    },
  },
  created() {
    loadDm();
  },
  methods: { t },
};
</script>
