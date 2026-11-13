<!--
  Domino — a journal post (domino-design/article-b.html, pages-read.js
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
  <div class="dm dm-article">
    <template v-if="article">
      <dm-pt :crumbs="crumbs" :title="article.title" art="whisk" art2="croissant" cls="art-pt">
        <p class="art-m">
          <dm-icon name="cal" /><time v-if="article.created_at" :datetime="article.created_at">{{ fmtDate(article.created_at) }}</time
          ><template v-if="article.created_at"><span>·</span></template><span>{{ t("domino.rd.journalOf", "{shop} journal", { shop: shopName }) }}</span>
        </p>
      </dm-pt>
      <article :aria-label="article.title" class="artl">
        <div class="wrap">
          <figure :class="['art-cov', { 'dm-cov-none': !cover }]">
            <img v-if="cover" :src="cover" :srcset="coverSrcset" alt="" fetchpriority="high" height="900" sizes="(max-width: 1160px) 96vw, 1080px" width="1600" @error="dropSrcset" />
            <dm-art v-else name="whisk" wrap="dm-bc-art" />
          </figure>
          <div class="art-col">
            <p v-if="lede" class="art-lead">{{ lede }}</p>
            <div v-if="body" class="art-body" @click="bodyClick" v-html="body"></div>
            <dm-sample-tag v-else :text="t('domino.rd.onlySummary', 'Only this post’s summary is in the shop for now.')" />

            <section v-if="products.length" aria-labelledby="ap-h" class="ap">
              <div class="ap-hd">
                <div>
                  <p class="eyebrow">{{ t("domino.rd.named", "Named in this post") }}</p>
                  <h2 id="ap-h" class="ap-t">{{ t("domino.rd.shopPost", "Shop this post") }}</h2>
                </div>
                <button :aria-disabled="adding ? 'true' : undefined" class="btn sm" type="button" @click="adding || addAll()">
                  <dm-icon :name="added ? 'check' : 'bag'" /><span>{{ added ? t("domino.rd.inBag", "In your bag") : t("domino.rd.addAll", "Add all") }}</span>
                </button>
              </div>
              <ul class="ap-l">
                <li v-for="p in products" :key="p.id" class="apc">
                  <router-link :to="productTo(p)" aria-hidden="true" class="apc-pl" tabindex="-1"><img :src="productImage(p)" alt="" loading="lazy" /></router-link>
                  <router-link :to="productTo(p)" class="apc-n">{{ p.title }}</router-link>
                  <p class="apc-p">
                    <span class="now money">{{ money(pv(p).now) }}</span><template v-if="pv(p).was">{{ " " }}<s class="was money">{{ money(pv(p).was) }}</s></template>
                  </p>
                  <div class="apc-a"><dm-add :label="t('domino.rd.add', 'Add')" :product="p" /></div>
                </li>
              </ul>
            </section>

            <div :aria-label="t('domino.rd.share', 'Share')" class="share" role="group">
              <span class="share-k">{{ t("domino.rd.share", "Share") }}</span>
              <button class="btn quiet sm" type="button" @click="copyLink">
                <dm-icon :name="copied ? 'check' : 'link'" />{{ copied ? t("domino.rd.copied", "Link copied") : t("domino.rd.copy", "Copy link") }}
              </button>
              <a :href="mailto" class="btn quiet sm"><dm-icon name="mail" />{{ t("domino.rd.email", "Email") }}</a>
              <button v-if="canShare" class="btn quiet sm" type="button" @click="shareMore"><dm-icon name="share" />{{ t("domino.rd.more", "More") }}</button>
            </div>

            <div class="auth">
              <dm-mark />
              <div>
                <b>{{ t("domino.rd.journalOf", "{shop} journal", { shop: shopName }) }}</b>
                <p>{{ counterLine }}</p>
                <router-link :to="journalRoute()" class="qlink">{{ t("domino.rd.allPosts", "All posts") }}<dm-icon cls="flip-rtl" name="arrow" /></router-link>
              </div>
            </div>

            <section aria-labelledby="cm-h" class="cmts">
              <h2 id="cm-h" class="ap-t">{{ t("domino.rd.comments", "Comments") }}</h2>
              <s-article-comments :article-id="article.id" :article-user-id="article.user_id" class="dm-comments" is-selldone is-shop>
                <template v-slot:login>
                  <dm-empty :text="t('domino.rd.comFirstP', 'Sign in to leave the first comment on this post.')" :title="t('domino.rd.comFirstT', 'No comments yet')" icon="chat">
                    <template #acts
                      ><button class="btn sm" type="button" @click="signIn">{{ t("domino.rd.comSignIn", "Sign in to comment") }}</button></template
                    >
                  </dm-empty>
                </template>
              </s-article-comments>
            </section>
          </div>
        </div>
      </article>
    </template>

    <template v-else-if="busy">
      <dm-pt :crumbs="[{ label: t('domino.rd.journal', 'Journal'), to: journalRoute() }, { label: t('domino.rd.post', 'Post') }]" art="whisk" art2="croissant" cls="art-pt" />
      <div class="artl" role="status">
        <div class="wrap"><div class="art-cov dm-cov-none"></div></div>
      </div>
    </template>

    <template v-else>
      <dm-pt :crumbs="[{ label: t('domino.rd.journal', 'Journal'), to: journalRoute() }, { label: t('domino.rd.post', 'Post') }]" :title="t('domino.rd.goneT', 'We can’t find this post')" art="whisk" art2="croissant" cls="compact" />
      <section class="sec-s">
        <div class="wrap">
          <dm-empty :text="t('domino.rd.goneP', 'The link may be old, or the post has moved. Every other post is in the journal.')" :title="t('domino.rd.goneT', 'We can’t find this post')" cls="boxed" icon="search" tag="h2">
            <template #acts
              ><router-link :to="journalRoute()" class="btn">{{ t("domino.rd.backJournal", "Back to the journal") }}</router-link></template
            >
          </dm-empty>
        </div>
      </section>
    </template>

    <section v-if="more.length" aria-labelledby="mp-h" class="sec-s more-p">
      <div class="wrap">
        <header class="sec-hd sm">
          <p class="eyebrow">{{ t("domino.rd.keepReading", "Keep reading") }}</p>
          <h2 id="mp-h" class="h2">{{ t("domino.rd.moreH", "More from the journal") }}</h2>
        </header>
        <div class="bgrid">
          <dm-post v-for="b in more" :key="b.id" :post="b" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import SArticleComments from "@selldone/components-vue/article/comment/SArticleComments.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { StorefrontSeo } from "../../../helpers/StorefrontSeo";
import DmIcon from "@app-storefront/components/domino/DmIcon.vue";
import DmArt from "@app-storefront/components/domino/DmArt.vue";
import DmAdd from "@app-storefront/components/domino/DmAdd.vue";
import DmPost from "@app-storefront/components/domino/read/DmPost.vue";
import DmPt from "@app-storefront/components/domino/ui/DmPt.vue";
import DmEmpty from "@app-storefront/components/domino/ui/DmEmpty.vue";
import DmMark from "@app-storefront/components/domino/ui/DmMark.vue";
import DmSampleTag from "@app-storefront/components/domino/ui/DmSampleTag.vue";
import { dm, fmtDate, loadDm, money, priceView, productImage, productTo, shopFacts } from "@app-storefront/components/domino/dm";
import { plainText, shortAddress } from "@app-storefront/components/domino/read/rd";
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
  components: { SArticleComments, DmIcon, DmArt, DmAdd, DmPost, DmPt, DmEmpty, DmMark, DmSampleTag },
  inject: ["$shop"],

  data: () => ({
    article: null as any,
    busy: false,
    more: [] as any[],
    adding: false,
    added: false,
    copied: false,
    dm,
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
      const byId = new Map(this.dm.products.map((p: any) => [p.id, p]));
      const linked = linkedIds(this.article.body)
        .map((id) => byId.get(id))
        .filter(Boolean)
        .slice(0, 4);
      if (linked.length) return linked;
      return productsIn(this.article.body, this.dm.products, 4);
    },
    shopName() {
      const n = String(this.shop?.title || "");
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    crumbs() {
      return [{ label: t("domino.rd.journal", "Journal"), to: journalRoute() }, { label: t("domino.rd.post", "Post") }];
    },
    /* "Notes from the counter at 1 The Embarcadero, San Francisco." */
    counterLine() {
      const at = shortAddress(shopFacts(this.shop));
      return at ? t("domino.rd.notesAt", "Notes from the counter at {place}.", { place: at }) : t("domino.rd.notes", "Notes from the counter.");
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
