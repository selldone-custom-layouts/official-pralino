<!--
  Domino — the three-panel strip under a collection (pages-shop.js strip(),
  nicdark's dark card · photo · light card): the courier (its radius, days
  and windows, "Order for delivery"), the collection's photo (or its best
  sellers on a plate), and pickup at the counter (the counter's own note and
  the way to pay, "Find the counter"). Without a courier the dark card tells
  the shipping; without pickup the light card tells the way to pay. From the
  shop's own data.
-->
<template>
  <section :aria-label="t('domino.strip.aria', 'Delivery and pickup')" class="trio-s">
    <div class="wrap trio">
      <div v-if="dark" class="tri dark">
        <dm-art cls="tri-ic" name="whisk" />
        <h3>{{ dark.title }}</h3>
        <p>{{ dark.text }}</p>
        <router-link :to="bagTo" class="btn sm on-dark">{{ dark.btn }}</router-link>
      </div>
      <router-link :to="catTo(cat)" aria-hidden="true" class="tri photo" tabindex="-1">
        <img v-if="photo" :src="photo" alt="" loading="lazy" />
        <dm-cuts v-else :products="pieces" kind="trio" />
      </router-link>
      <div v-if="light" class="tri light">
        <dm-art cls="tri-ic" name="cupcake" />
        <h3>{{ light.title }}</h3>
        <p>{{ light.text }}</p>
        <router-link :to="contactTo" class="btn sm">{{ light.btn }}</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import DmArt from "../DmArt.vue";
import DmCuts from "../DmCuts.vue";
import { collectionPhoto } from "../dm-photos";
import { bySells, catTo, inCat, money, shopFacts } from "../dm";
import { t } from "../../kalio/i18n/kalio-i18n";

const list = (items, type = "conjunction") => {
  try {
    return new Intl.ListFormat(document.documentElement.lang || "en", { style: "long", type }).format(items);
  } catch {
    return items.join(", ");
  }
};

export default {
  name: "DmStrip",
  components: { DmArt, DmCuts },
  props: { cat: { type: Object, required: true } },
  computed: {
    facts() {
      return shopFacts(this.$store.getters.getShop);
    },
    photo() {
      return collectionPhoto(this.cat);
    },
    pieces() {
      return bySells(inCat(this.cat.id));
    },
    dark() {
      const f = this.facts;
      const c = f.courier;
      if (c) {
        const near = c.distance ? t("domino.strip.within", "Local delivery within {km} km of the bakery.", { km: c.distance }) : t("domino.strip.local", "Local delivery.");
        const days = c.days.length >= 7 ? t("domino.strip.everyDay", "Every day") : list(c.days.map((d) => String(d).slice(0, 3)));
        const wins = c.windows.length ? list(c.windows.map((w) => String(w).toLowerCase())) : "";
        return { title: c.title, text: [near, [days, wins].filter(Boolean).join(", ") + "."].join(" "), btn: t("domino.strip.orderDelivery", "Order for delivery") };
      }
      const s = f.shipping;
      if (s) return { title: s.title, text: s.freeOver ? t("domino.strip.shipFree", "Ships anywhere; free on orders over {amount}.", { amount: money(s.freeOver, true) }) : t("domino.strip.ship", "Ships anywhere."), btn: t("domino.strip.orderShip", "Order for shipping") };
      return null;
    },
    light() {
      const f = this.facts;
      if (f.pickup) {
        const note = f.pickupNote ? f.pickupNote.replace(/\.?\s*$/, ".") : "";
        return { title: t("domino.strip.pickupT", "Pickup at the counter"), text: [note, f.gateway?.name ? f.gateway.name + "." : ""].filter(Boolean).join(" "), btn: t("domino.strip.findCounter", "Find the counter") };
      }
      if (f.gateway) return { title: f.gateway.name, text: f.gateway.description, btn: t("domino.strip.contact", "Contact the bakery") };
      return null;
    },
    bagTo() {
      return { name: window.$storefront.routes.BASKET_PAGE, params: { type: "PHYSICAL" } };
    },
    contactTo() {
      return { name: window.$storefront.routes.SHOP_CONTACT_US };
    },
  },
  methods: { t, catTo },
};
</script>
