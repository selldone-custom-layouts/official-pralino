<!--
  Pralino — a journal post (pralino-design/article-b.html, pages-read.js
  article): the title band (Home · Journal · Post; the post's title; the
  date and "<shop> journal"), the cover rising out of the band, then one
  centred reading column: the post's own description as the lead, its text
  (its links are the only underlined words on the site), ONE panel with
  the pastries the post links to (its /product/<id> links, read live; at
  most four, "Add all" in the panel's head), the Share row (Copy link,
  Email, More), the journal's card with the shop's mark, the comments
  (Selldone's; signing in opens the sheet), and "More from the journal".
-->
<template>
  <div class="pr pr-article">
    <template v-if="article">
      <pr-pt :crumbs="crumbs" :title="article.title" art="whisk" art2="croissant" cls="art-pt">
        <p class="art-m">
          <pr-icon name="cal" /><time v-if="article.created_at" :datetime="article.created_at">{{ fmtDate(article.created_at) }}</time
          ><template v-if="article.created_at"><span>·</span></template><span>{{ t("pralino.rd.journalOf", "{shop} journal", { shop: shopName }) }}</span>
        </p>
      </pr-pt>
      <article :aria-label="article.title" class="artl">
        <div class="wrap">
          <figure :class="['art-cov', { 'pr-cov-none': !cover }]">
            <img v-if="cover" :src="cover" :srcset="coverSrcset" alt="" fetchpriority="high" height="900" sizes="(max-width: 1160px) 96vw, 1080px" width="1600" @error="dropSrcset" />
            <pr-art v-else name="whisk" wrap="pr-bc-art" />
          </figure>
          <div class="art-col">
            <p v-if="lede" class="art-lead">{{ lede }}</p>
            <div v-if="body" class="art-body" @click="bodyClick" v-html="body"></div>
            <pr-sample-tag v-else :text="t('pralino.rd.onlySummary', 'Only this post’s summary is in the shop for now.')" />

            <section v-if="products.length" aria-labelledby="ap-h" class="ap">
              <div class="ap-hd">
                <div>
                  <p class="eyebrow">{{ t("pralino.rd.named", "Named in this post") }}</p>
                  <h2 id="ap-h" class="ap-t">{{ t("pralino.rd.shopPost", "Shop this post") }}</h2>
                </div>
                <button :aria-disabled="adding ? 'true' : undefined" class="btn sm" type="button" @click="adding || addAll()">
                  <pr-icon :name="added ? 'check' : 'bag'" /><span>{{ added ? t("pralino.rd.inBag", "In your bag") : t("pralino.rd.addAll", "Add all") }}</span>
                </button>
              </div>
              <ul class="ap-l">
                <li v-for="p in products" :key="p.id" class="apc">
                  <router-link :to="productTo(p)" aria-hidden="true" class="apc-pl" tabindex="-1"><img :src="productImage(p)" alt="" loading="lazy" /></router-link>
                  <router-link :to="productTo(p)" class="apc-n">{{ p.title }}</router-link>
                  <p class="apc-p">
                    <span class="now money">{{ money(pv(p).now) }}</span><template v-if="pv(p).was">{{ " " }}<s class="was money">{{ money(pv(p).was) }}</s></template>
                  </p>
                  <div class="apc-a"><pr-add :label="t('pralino.rd.add', 'Add')" :product="p" /></div>
                </li>
              </ul>
            </section>

            <div :aria-label="t('pralino.rd.share', 'Share')" class="share" role="group">
              <span class="share-k">{{ t("pralino.rd.share", "Share") }}</span>
              <button class="btn quiet sm" type="button" @click="copyLink">
                <pr-icon :name="copied ? 'check' : 'link'" />{{ copied ? t("pralino.rd.copied", "Link copied") : t("pralino.rd.copy", "Copy link") }}
              </button>
              <a :href="mailto" class="btn quiet sm"><pr-icon name="mail" />{{ t("pralino.rd.email", "Email") }}</a>
              <button v-if="canShare" class="btn quiet sm" type="button" @click="shareMore"><pr-icon name="share" />{{ t("pralino.rd.more", "More") }}</button>
            </div>

            <div class="auth">
              <pr-mark />
              <div>
                <b>{{ t("pralino.rd.journalOf", "{shop} journal", { shop: shopName }) }}</b>
                <p>{{ counterLine }}</p>
                <router-link :to="journalRoute()" class="qlink">{{ t("pralino.rd.allPosts", "All posts") }}<pr-icon cls="flip-rtl" name="arrow" /></router-link>
              </div>
            </div>

            <section aria-labelledby="cm-h" class="cmts">
              <h2 id="cm-h" class="ap-t">{{ t("pralino.rd.comments", "Comments") }}</h2>
              <s-article-comments :article-id="article.id" :article-user-id="article.user_id" class="pr-comments" is-selldone is-shop>
                <template v-slot:login>
                  <pr-empty :text="t('pralino.rd.comFirstP', 'Sign in to leave the first comment on this post.')" :title="t('pralino.rd.comFirstT', 'No comments yet')" icon="chat">
                    <template #acts
                      ><button class="btn sm" type="button" @click="signIn">{{ t("pralino.rd.comSignIn", "Sign in to comment") }}</button></template
                    >
                  </pr-empty>
                </template>
              </s-article-comments>
            </section>
          </div>
        </div>
      </article>
    </template>

    <template v-else-if="busy">
      <pr-pt :crumbs="[{ label: t('pralino.rd.journal', 'Journal'), to: journalRoute() }, { label: t('pralino.rd.post', 'Post') }]" art="whisk" art2="croissant" cls="art-pt" />
      <div class="artl" role="status">
        <div class="wrap"><div class="art-cov pr-cov-none"></div></div>
      </div>
    </template>

    <template v-else>
      <pr-pt :crumbs="[{ label: t('pralino.rd.journal', 'Journal'), to: journalRoute() }, { label: t('pralino.rd.post', 'Post') }]" :title="t('pralino.rd.goneT', 'We can’t find this post')" art="whisk" art2="croissant" cls="compact" />
      <section class="sec-s">
        <div class="wrap">
          <pr-empty :text="t('pralino.rd.goneP', 'The link may be old, or the post has moved. Every other post is in the journal.')" :title="t('pralino.rd.goneT', 'We can’t find this post')" cls="boxed" icon="search" tag="h2">
            <template #acts
              ><router-link :to="journalRoute()" class="btn">{{ t("pralino.rd.backJournal", "Back to the journal") }}</router-link></template
            >
          </pr-empty>
        </div>
      </section>
    </template>

    <section v-if="more.length" aria-labelledby="mp-h" class="sec-s more-p">
      <div class="wrap">
        <header class="sec-hd sm">
          <p class="eyebrow">{{ t("pralino.rd.keepReading", "Keep reading") }}</p>
          <h2 id="mp-h" class="h2">{{ t("pralino.rd.moreH", "More from the journal") }}</h2>
        </header>
        <div class="bgrid">
          <pr-post v-for="b in more" :key="b.id" :post="b" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import SArticleComments from "@selldone/components-vue/article/comment/SArticleComments.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { StorefrontSeo } from "../../../helpers/StorefrontSeo";
import PrIcon from "@app-storefront/components/pralino/PrIcon.vue";
import PrArt from "@app-storefront/components/pralino/PrArt.vue";
import PrAdd from "@app-storefront/components/pralino/PrAdd.vue";
import PrPost from "@app-storefront/components/pralino/read/PrPost.vue";
import PrPt from "@app-storefront/components/pralino/ui/PrPt.vue";
import PrEmpty from "@app-storefront/components/pralino/ui/PrEmpty.vue";
import PrMark from "@app-storefront/components/pralino/ui/PrMark.vue";
import PrSampleTag from "@app-storefront/components/pralino/ui/PrSampleTag.vue";
import { pr, fmtDate, loadDm, money, priceView, productImage, productTo, shopFacts } from "@app-storefront/components/pralino/pr";
import { plainText, shortAddress } from "@app-storefront/components/pralino/read/rd";
import { addCount, basketLine, mayBuy } from "@app-storefront/components/kalio/kalio-basket";
import { dropSrcset, photoSrcset } from "@app-storefront/components/kalio/kalio-catalog";
import { journalPage, journalPost, journalRoute, productsIn } from "@app-storefront/components/kalio/pages/kalio-journal";
import { currentCurrency } from "@app-storefront/components/region-switcher/region";
import { t } from "@app-storefront/components/kalio/i18n/kalio-i18n";

/** The product ids a story's text links to, in order, once each. */
function linkedIds(html: string): number[] {
  const ids: number[] = [];
  for (const m of String(html || "").matchAll(/href="[^"]*\/product\/(\d+)[^"]*"/g)) {
    const id = Number(m[1]);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

export default {
  name: "StorefrontPageBlogsView",
  components: { SArticleComments, PrIcon, PrArt, PrAdd, PrPost, PrPt, PrEmpty, PrMark, PrSampleTag },
  inject: ["$shop"],

  data: () => ({
    article: null as any,
    busy: false,
    more: [] as any[],
    adding: false,
    added: false,
    copied: false,
    pr,
    canShare: typeof navigator !== "undefined" && !!navigator.share,
    seoNavigation: StorefrontSeo.captureNavigation(),
  }),

  computed: {
    blogId() {
      return this.$route.params.blog_id;
    },
    shop() {
      return this.$store.getters.getShop;
    },
    /* The shop's text, with the editor's leftovers taken out. */
    body() {
      return String(this.article?.body || "")
        .replace(/\scontenteditable="[^"]*"/g, "")
        .replace(/src="http:/g, 'src="');
    },
    /* The cover, unless the text opens with the same picture. */
    cover() {
      const image = this.article?.image;
      if (!image) return null;
      const file = String(image).split("/").pop()!.split("?")[0].slice(0, 40);
      const first = /<img[^>]+src="([^"]+)"/.exec(this.article.body || "");
      if (first && file && first[1].includes(file)) return null;
      return window.CDN.GET_SHOP_IMAGE_PATH(image, null);
    },
    coverSrcset() {
      return photoSrcset(this.cover);
    },
    /* The description, unless it is only the first words of the text. */
    lede() {
      const d = plainText(this.article?.description);
      if (!d) return "";
      const start = plainText(this.article?.body).slice(0, 40);
      return start && d.startsWith(start) ? "" : d;
    },
    /* The pastries the story links to (else the ones it names), at most four. */
    products() {
      if (!this.article) return [];
      const byId = new Map(this.pr.products.map((p: any) => [p.id, p]));
      const linked = linkedIds(this.article.body)
        .map((id) => byId.get(id))
        .filter(Boolean)
        .slice(0, 4);
      if (linked.length) return linked;
      return productsIn(this.article.body, this.pr.products, 4);
    },
    shopName() {
      const n = String(this.shop?.title || "");
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    crumbs() {
      return [{ label: t("pralino.rd.journal", "Journal"), to: journalRoute() }, { label: t("pralino.rd.post", "Post") }];
    },
    /* "Notes from the counter at 1 The Embarcadero, San Francisco." */
    counterLine() {
      const at = shortAddress(shopFacts(this.shop));
      return at ? t("pralino.rd.notesAt", "Notes from the counter at {place}.", { place: at }) : t("pralino.rd.notes", "Notes from the counter.");
    },
    mailto() {
      return `mailto:?subject=${encodeURIComponent(this.article?.title || "")}&body=${encodeURIComponent(location.href)}`;
    },
  },

  watch: {
    blogId() {
      this.load();
    },
    "$route.fullPath"() {
      this.seoNavigation = StorefrontSeo.captureNavigation();
    },
  },

  created() {
    loadDm();
    this.load();
  },

  methods: {
    t,
    money,
    fmtDate,
    productImage,
    productTo,
    journalRoute,
    dropSrcset,
    pv(p: any) {
      void currentCurrency();
      return priceView(this.shop, p);
    },
    load() {
      const asked = this.blogId;
      this.busy = true;
      this.article = null;
      this.more = [];
      journalPost(asked)
        .then((data: any) => {
          if (asked !== this.blogId) return;
          this.article = data.article;
          this.setPageTitle?.(data.article.title);
          StorefrontSeo.updateArticle(data.article, this.$store.getters.getShop, this.seoNavigation);
          journalPage({ page: 1, limit: 4 })
            .then(({ articles }: any) => {
              if (asked === this.blogId) this.more = (articles || []).filter((a: any) => a.id !== data.article.id).slice(0, 3);
            })
            .catch(() => {});
        })
        .catch(() => {})
        .finally(() => {
          if (asked === this.blogId) this.busy = false;
        });
    },
    /* A link inside the story to this shop opens in the app. */
    bodyClick(e: MouseEvent) {
      const a = (e.target as HTMLElement)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      let url: URL;
      try {
        url = new URL(a.getAttribute("href") || "", location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      const m = /\/product\/(\d+)/.exec(url.pathname);
      e.preventDefault();
      if (m) this.$router.push(productTo({ id: Number(m[1]) }));
      else this.$router.push(url.pathname + url.search + url.hash).catch(() => {});
    },
    async addAll() {
      if (!mayBuy(this)) return;
      this.adding = true;
      try {
        for (const p of this.products) {
          if (!(p.quantity > 0)) continue;
          if (basketLine(this, p)?.count > 0) continue;
          await addCount(this, p, null, 1);
        }
        this.added = true;
        setTimeout(() => (this.added = false), 1500);
      } finally {
        this.adding = false;
      }
    },
    copyLink() {
      const done = () => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      };
      try {
        navigator.clipboard?.writeText(location.href).then(done, done);
      } catch {
        done();
      }
    },
    shareMore() {
      navigator.share?.({ title: document.title, url: location.href }).catch(() => {});
    },
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
