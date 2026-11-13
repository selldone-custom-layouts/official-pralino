<!--
  Domino — FAQ (domino-design/faq-b.html, pages-read.js faq): the title
  band ("Questions & answers", a line, and the sample label while the shop
  has no FAQ of its own); beside the questions, "Before you order" with the
  topics as chips that jump to them and "Still wondering?" (the shop's
  phone and email, "Contact <shop>"); the questions grouped by topic, each
  group under its icon, each question a details row with a + (the first
  open).

  The questions are the shop's own (Selldone's FAQ, its first tag as the
  topic) when it has some; until then sample questions about ordering
  pieces, delivery windows, pickup, the way to pay and allergens, built from
  the shop's facts and labelled as a sample.
-->
<template>
  <div class="dm dm-faq">
    <dm-pt :crumbs="[{ label: t('domino.rd.faq', 'FAQ') }]" :lead="t('domino.rd.faqLead', 'Delivery windows, pickup, the way to pay and ordering single pieces.')" :title="t('domino.rd.faqT', 'Questions & answers')" art="macaron" art2="whisk">
      <dm-sample-tag v-if="!own && !busy" :text="t('domino.rd.faqSample', 'Sample questions — the shop has not written its FAQ yet')" />
    </dm-pt>
    <section :aria-label="t('domino.rd.questionsAria', 'Questions')" class="sec-s">
      <div class="wrap faq">
        <aside class="faq-side">
          <p class="eyebrow">{{ t("domino.rd.beforeOrder", "Before you order") }}</p>
          <h2 class="h3x">{{ t("domino.rd.plainAnswers", "Plain answers from the counter") }}</h2>
          <nav v-if="groups.length > 1" :aria-label="t('domino.rd.topics', 'Topics')" class="faq-nav">
            <ul>
              <li v-for="(g, i) in groups" :key="g.name">
                <a :href="'#fq' + i" class="chip" @click.prevent="jump(i)">{{ g.name }}</a>
              </li>
            </ul>
          </nav>
          <div v-if="f.phone || f.email" class="faq-ct">
            <p>
              <b>{{ t("domino.rd.stillWondering", "Still wondering?") }}</b>
            </p>
            <ul class="ils sm">
              <li v-if="f.phone" class="il">
                <span class="il-ic"><dm-icon name="phone" /></span>
                <div class="il-tx">
                  <b><a :href="'tel:' + f.phone.replace(/[^\d+]/g, '')" dir="ltr">{{ f.phone }}</a></b><span v-if="open">{{ open }}</span>
                </div>
              </li>
              <li v-if="f.email" class="il">
                <span class="il-ic"><dm-icon name="mail" /></span>
                <div class="il-tx">
                  <b><a :href="'mailto:' + f.email">{{ f.email }}</a></b><span>{{ t("domino.rd.answersEmail", "{shop} answers by email", { shop: name }) }}</span>
                </div>
              </li>
            </ul>
            <router-link :to="{ name: contactRoute }" class="btn sm">{{ t("domino.rd.contactT", "Contact {shop}", { shop: name }) }}</router-link>
          </div>
        </aside>
        <div class="faq-l">
          <template v-if="!busy">
            <section v-for="(g, i) in groups" :id="'fq' + i" :key="g.name" :aria-labelledby="'fqh' + i" class="fq">
              <h2 :id="'fqh' + i" class="fq-h">
                <span class="il-ic"><dm-icon :name="g.icon" /></span>{{ g.name }}
              </h2>
              <details v-for="(q, j) in g.items" :key="q.key" :open="i === 0 && j === 0" class="qa">
                <summary>
                  <span>{{ q.q }}</span><span aria-hidden="true" class="qa-ic"><dm-icon name="plus" /></span>
                </summary>
                <div v-if="q.html" class="art-body dm-qa-a" v-html="q.a"></div>
                <p v-else>{{ q.a }}</p>
              </details>
            </section>
          </template>
          <div v-else :aria-label="t('domino.rd.loadingFaq', 'Loading the questions')" class="dm-od-load" role="status">
            <span v-for="n in 3" :key="n" class="dm-od-sk -row"></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import DmIcon from "@app-storefront/components/domino/DmIcon.vue";
import DmPt from "@app-storefront/components/domino/ui/DmPt.vue";
import DmSampleTag from "@app-storefront/components/domino/ui/DmSampleTag.vue";
import { guestCheckout, money, openLine as openWords, shopFacts } from "@app-storefront/components/domino/dm";
import { sampleFaq, shopName } from "@app-storefront/components/domino/read/rd";
import { withRetry } from "@app-storefront/components/bakini/bakini";
import { t } from "@app-storefront/components/kalio/i18n/kalio-i18n";

export default {
  name: "StorefrontPageFaq",
  components: { DmIcon, DmPt, DmSampleTag },
  props: { shop: { type: Object } },

  data: () => ({ faqs: [] as any[], busy: true }),

  computed: {
    theShop() {
      return this.$store.getters.getShop || this.shop;
    },
    f() {
      return shopFacts(this.theShop);
    },
    name() {
      return shopName(this.theShop);
    },
    open() {
      return openWords(this.f);
    },
    own() {
      return this.faqs.length > 0;
    },
    /* The shop's questions (its first tag is the topic), else the sample. */
    items() {
      if (this.own)
        return this.faqs.map((x: any) => ({
          key: "f" + x.id,
          group: (x.tags && x.tags[0]) || t("domino.rd.general", "General"),
          q: x.question,
          a: x.answer || "",
          html: /<[a-z][\s\S]*>/i.test(String(x.answer || "")),
          icon: "chat",
        }));
      const icons = ["bag", "bike", "cash", "info"];
      const sample = sampleFaq(this.theShop, this.f, (n: number) => money(n, true), guestCheckout(this.theShop));
      const names = [...new Set(sample.map((x) => x.group))];
      return sample.map((x, i) => ({ key: "s" + i, group: x.group, q: x.q, a: x.a, html: false, icon: icons[names.indexOf(x.group)] || "info" }));
    },
    groups() {
      const out: { name: string; icon: string; items: any[] }[] = [];
      for (const x of this.items) {
        let g = out.find((y) => y.name === x.group);
        if (!g) out.push((g = { name: x.group, icon: x.icon, items: [] }));
        g.items.push(x);
      }
      return out;
    },
    contactRoute() {
      return window.$storefront.routes.SHOP_CONTACT_US;
    },
  },

  created() {
    this.setPageTitle?.(t("domino.rd.faq", "FAQ"));
    withRetry(() => window.axios.get(window.XAPI.GET_FAQ(this.theShop.name), { params: { offset: 0, limit: 50 } }))
      .then(({ data }: any) => (this.faqs = data?.faqs || []))
      .catch(() => (this.faqs = []))
      .finally(() => (this.busy = false));
  },

  methods: {
    t,
    jump(i: number) {
      const el = document.getElementById("fq" + i);
      el?.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth", block: "start" });
      (el?.querySelector("summary") as HTMLElement | null)?.focus({ preventScroll: true });
    },
  },
};
</script>
