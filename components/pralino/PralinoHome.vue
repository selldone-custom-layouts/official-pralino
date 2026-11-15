<!--
  Pralino — the home (pralino-design/home-a.html and src/home.js; set A "Classic"). Every section from
  the shop's live data; nothing names a product, price, collection, address or delivery way.

   1. Hero: the shop's name and line; the counter photo (pralino-hero-back) bleeding to the window edge,
      the framed photo across the seam (pralino-hero-inset) with the best seller as its caption, and the
      three most-ordered collections on the photo's dark corner (under the photo on a phone).
   2. About (tint band): the shop in numbers (collections, the saving, the ways to receive an order, the
      counter's days and hours — never a product count) beside the slot pralino-about and the shop's facts.
   3. The four collections people order most (rows: the collection's photo, numeral, line, best sellers).
   4. How ordering works (tint band; the slot pralino-how bleeding to the left edge; the courier's card).
   5. Counters, the offer card (the slot pralino-offer) and every way to receive an order.
   6. The gallery of the collections around the most-ordered one.
   7. Today's selection (tint band): best sellers, mixed across collections, as numbered rows, one button style.
   8. The photo band (the slot pralino-parallax).
   9. The marquee of the collections.
  10. The journal (tint band): the four newest posts beside the slot pralino-journal (last).
  A slot without its photo shows its designed fallback (PrPhoto, PrCuts); never a caption or file name.
-->
<template>
  <div class="pr pr-home">
    <!-- 1 · Hero -->
    <section aria-labelledby="hero-h" class="hero">
      <div class="hero-in">
        <div class="hero-copy">
          <h1 id="hero-h" class="hero-h">
            <span class="l1"><bdi>{{ shopName }}</bdi></span><span class="l2">{{ t("pralino.home.tagline", "Pastry, one by one") }}</span>
          </h1>
          <div class="hero-sub">
            <p class="eyebrow">{{ t("pralino.home.heroEyebrow", "What we bake") }}</p>
            <h2 class="h2">{{ t("pralino.home.heroH", "Every pastry, sold on its own") }}</h2>
            <p v-if="ready && heroLead" class="lead">{{ heroLead }}</p>
            <a class="btn" href="#collections" @click.prevent="jump('collections')">{{ t("pralino.home.heroBtn", "Shop the collections") }}</a>
          </div>
        </div>
        <div class="hero-media">
          <pr-photo :alt="t('pralino.home.heroAlt', 'The counter')" art="cake" class="hero-back" deep eager name="pralino-hero-back" pos="64% 50%">
            <template v-if="bandPieces.length" #fallback><pr-cuts :products="bandPieces.slice(0, 3)" kind="trio" /></template>
          </pr-photo>
          <figure class="hero-inset">
            <pr-photo art="cupcake" class="hi-ph" eager name="pralino-hero-inset">
              <template v-if="insetPiece" #fallback><pr-cuts :products="[insetPiece]" kind="one" /></template>
            </pr-photo>
            <figcaption v-if="best[0]" class="hi-cap">
              <span class="hi-k">{{ t("pralino.home.mostOrdered", "Most ordered") }}</span>
              <router-link :to="productTo(best[0])" class="hi-n">{{ best[0].title }}</router-link>
              <span class="hi-p"><span class="now money">{{ money(pv(best[0]).now) }}</span><template v-if="pv(best[0]).was">{{ " " }}<s class="was money">{{ money(pv(best[0]).was) }}</s></template></span>
            </figcaption>
          </figure>
        </div>
        <ul v-if="rank.length" :aria-label="t('pralino.home.heroWords', 'Most ordered collections')" class="hero-words" data-over-photo>
          <li v-for="x in rank.slice(0, 3)" :key="x.c.id">
            <router-link :to="catTo(x.c)"><bdi>{{ catTitle(x.c) }}</bdi></router-link>
          </li>
        </ul>
      </div>
    </section>

    <!-- 2 · About + the shop in numbers (tint band) -->
    <section id="about" aria-labelledby="about-h" class="sec about band">
      <div class="wrap about-in">
        <div v-if="nums.length" class="about-nums">
          <p class="eyebrow">{{ t("pralino.home.numsEyebrow", "{shop} in numbers", { shop: shopName }) }}</p>
          <dl class="nums">
            <div v-for="n in nums" :key="n.k" class="num">
              <dt>{{ n.label }}</dt>
              <dd>
                <span class="nv">{{ n.value }}</span><span v-if="n.unit" class="nu">{{ n.unit }}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div class="about-main">
          <p class="eyebrow">{{ t("pralino.home.aboutEyebrow2", "Explore the counter") }}</p>
          <h2 id="about-h" class="h2">{{ t("pralino.home.aboutH", "Discover more about {shop}", { shop: shopName }) }}</h2>
          <div class="about-row">
            <pr-photo :alt="t('pralino.home.aboutAlt', 'Pastries on the counter')" art="croissant" class="about-ph" name="pralino-about">
              <template v-if="spread.length" #fallback><pr-cuts :products="spread" kind="spread" /></template>
            </pr-photo>
            <div class="about-copy">
              <template v-if="ready">
                <p>{{ aboutP1 }}</p>
                <p v-if="aboutP2">{{ aboutP2 }}</p>
              </template>
            </div>
          </div>
          <ul v-if="ready" class="about-links">
            <li v-if="facts.ways.length">
              <a href="#ways" @click.prevent="jump('ways')"><span>{{ t("pralino.home.linkDelivery", "Delivery") }}</span><pr-icon cls="chev" name="right" /></a>
            </li>
            <li v-if="facts.pickup">
              <router-link :to="contactTo"><span>{{ t("pralino.home.linkPickup", "Pickup") }}</span><pr-icon cls="chev" name="right" /></router-link>
            </li>
            <li v-if="facts.gateway">
              <a href="#how" @click.prevent="jump('how')"><span>{{ t("pralino.home.linkPayment", "Payment") }}</span><pr-icon cls="chev" name="right" /></a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 3 · The collections people order most -->
    <section v-if="topCols.length" id="collections" aria-labelledby="cols-h" class="sec cols">
      <div class="wrap">
        <header class="sec-hd">
          <p class="eyebrow">{{ t("pralino.home.colsEyebrow", "Tailored for you") }}</p>
          <h2 id="cols-h" class="h2">{{ colsTitle }}</h2>
        </header>
        <div :class="['ccs', 'n' + topCols.length]">
          <article v-for="(x, i) in topCols" :key="x.c.id" :class="['cc', { flip: i % 2 }]">
            <div class="cc-txt">
              <svg aria-hidden="true" class="numeral" focusable="false" viewBox="0 0 132 84"><text x="2" y="74">{{ (i < 9 ? "0" : "") + (i + 1) }}</text></svg>
              <h3 class="cc-t">
                <router-link :to="catTo(x.c)"><bdi>{{ catTitle(x.c) }}</bdi></router-link>
              </h3>
              <p v-if="x.c.description" class="cc-d"><bdi>{{ x.c.description }}</bdi></p>
              <ul class="checks">
                <li v-for="p in x.ps.slice(0, 3)" :key="p.id">
                  <span class="ck"><pr-icon name="check" /></span><router-link :to="productTo(p)">{{ p.title }}</router-link
                  ><span class="ck-pr"
                    ><span class="now money">{{ money(pv(p).now) }}</span><template v-if="pv(p).was">{{ " " }}<s class="was money">{{ money(pv(p).was) }}</s></template></span
                  >
                </li>
              </ul>
              <router-link :to="catTo(x.c)" class="btn sm">{{ t("pralino.home.shopCol", "Shop {name}", { name: catTitle(x.c) }) }}</router-link>
            </div>
            <router-link :to="catTo(x.c)" aria-hidden="true" class="cc-ph" tabindex="-1">
              <img v-if="colPhoto(x.c)" :src="colPhoto(x.c)" alt="" decoding="async" height="1050" loading="lazy" width="1400" />
              <pr-cuts v-else :products="x.ps" kind="trio" />
            </router-link>
          </article>
        </div>
      </div>
    </section>

    <!-- 4 · How ordering works (tint band) -->
    <section id="how" aria-labelledby="how-h" class="sec how band">
      <div class="how-in">
        <pr-photo :alt="t('pralino.home.howAlt', 'A box of pastries by the window')" art="tart" class="how-ph" name="pralino-how" pos="50% 30%" />
        <div class="how-txt">
          <p class="eyebrow">{{ t("pralino.home.howEyebrow", "Smart and simple") }}</p>
          <h2 id="how-h" class="h2">{{ t("pralino.home.howH", "How ordering works") }}</h2>
          <p v-if="ready" class="lead">{{ howLead }}</p>
          <ul v-if="ready" class="feats">
            <li v-for="f in feats" :key="f.k" class="feat">
              <pr-art :name="f.art" cls="feat-ic" />
              <h3>{{ f.title }}</h3>
              <p>{{ f.text }}</p>
            </li>
          </ul>
          <div v-if="facts.courier" class="how-card">
            <router-link v-if="howPlate" :to="productTo(howPlate)" aria-hidden="true" class="hc-ph" tabindex="-1"><img :src="img(howPlate)" alt="" loading="lazy" /></router-link>
            <div class="hc-tx">
              <h3>{{ facts.courier.title }}</h3>
              <p>{{ courierNote }}</p>
              <ul class="checks">
                <li v-for="c in courierChecks" :key="c">
                  <span class="ck"><pr-icon name="check" /></span>{{ c }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5 · Counters, the offer, the ways -->
    <section id="ways" aria-labelledby="focus-h" class="sec focus">
      <div :class="['wrap', 'focus-in', { 'no-fnums': !fnums.length }]">
        <dl v-if="fnums.length" class="fnums">
          <div v-for="n in fnums" :key="n.k" class="fnum">
            <dt>{{ n.label }}</dt>
            <dd>
              <span class="nv">{{ n.value }}</span><span v-if="n.unit" class="nu">{{ n.unit }}</span>
            </dd>
          </div>
        </dl>
        <pr-photo art="macaron" class="offer" deep name="pralino-offer" pos="50% 30%">
          <template v-if="offerPiece" #fallback><pr-cuts :products="[offerPiece]" kind="one" /></template>
          <div v-if="ready" class="offer-tx" data-over-photo>
            <p class="offer-e">{{ offLine ? t("pralino.home.rightNow", "Right now") : t("pralino.home.everyDay", "Every day") }}</p>
            <h3>{{ offLine ? capital(offLine) : t("pralino.home.soldOne", "Sold one by one") }}</h3>
            <p v-if="fromPrice">{{ t("pralino.home.fromLine", "Every pastry on the counter, from {price}", { price: fromPrice }) }}</p>
            <router-link :to="offLine ? dealsTo : allTo" class="btn sm">{{ offLine ? t("pralino.home.seeDeals", "See the deals") : t("pralino.home.shopAll", "Shop every pastry") }}</router-link>
          </div>
        </pr-photo>
        <div class="focus-txt">
          <p class="eyebrow">{{ t("pralino.home.waysEyebrow", "Your next step") }}</p>
          <h2 id="focus-h" class="h2">{{ waysTitle }}</h2>
          <ul class="ways">
            <li v-for="(w, i) in facts.ways" :key="w.id" :class="['way', { alt: i === 1 }]">
              <span class="cb"><pr-icon :name="wayIcon(w)" /></span>
              <div>
                <h3>{{ w.title }}</h3>
                <p v-if="wayNote(w)">{{ wayNote(w) }}</p>
                <p class="way-fee">{{ feeText(w) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6 · Gallery -->
    <section v-if="gallery" aria-labelledby="gal-h" class="sec gal">
      <div class="wrap">
        <header class="sec-hd">
          <p class="eyebrow">{{ t("pralino.home.galEyebrow", "Creative by nature") }}</p>
          <h2 id="gal-h" class="h2">{{ t("pralino.home.galH", "{n} collections at the counter", { n: capital(numWord(cats.length)) }) }}</h2>
        </header>
        <div class="g">
          <div v-for="col in gallery.cols" :key="col.k" :class="['gc', col.k]">
            <template v-for="tile in col.tiles" :key="tile.key">
              <router-link v-if="tile.cat" :class="['gt', tile.r]" :to="catTo(tile.cat)">
                <img v-if="colPhoto(tile.cat)" :src="colPhoto(tile.cat)" alt="" decoding="async" loading="lazy" />
                <pr-cuts v-else :products="bySells(inCat(tile.cat.id))" kind="trio" />
                <span class="g-lb"><bdi>{{ catTitle(tile.cat) }}</bdi></span>
              </router-link>
              <router-link v-else :class="['gt', 'plate', tile.r]" :to="productTo(tile.p)">
                <span class="pl"><img :src="img(tile.p)" alt="" loading="lazy" /></span>
                <span class="g-lb">{{ tile.p.title }}</span>
              </router-link>
            </template>
            <router-link v-if="col.centre" :to="catTo(col.centre)" class="gt centre">
              <img v-if="colPhoto(col.centre)" :src="colPhoto(col.centre)" alt="" decoding="async" loading="lazy" />
              <pr-cuts v-else :products="bySells(inCat(col.centre.id))" kind="trio" />
              <span class="g-frame">
                <span class="g-e"><bdi>{{ catTitle(col.centre) }}</bdi></span>
                <span class="g-h">{{ t("pralino.home.galFrame", "{n} collections, sold one by one", { n: capital(numWord(cats.length)) }) }}</span>
                <span class="g-more">{{ t("pralino.home.shopCol", "Shop {name}", { name: catTitle(col.centre) }) }}<pr-icon name="arrow" /></span>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 7 · Today's selection (tint band, one button style) -->
    <section v-if="selection.length" id="selection" aria-labelledby="sel-h" class="sec sel band">
      <div class="wrap">
        <header class="sec-hd">
          <p class="eyebrow">{{ t("pralino.home.selEyebrow", "Driven by what sells") }}</p>
          <h2 id="sel-h" class="h2">{{ t("pralino.home.selH", "Today’s selection") }}</h2>
        </header>
        <ol class="srows">
          <li v-for="(p, i) in selection" :key="p.id" class="srow">
            <div class="s-idx">
              <span class="s-n">{{ (i < 9 ? "0" : "") + (i + 1) }}</span><span class="s-c"><bdi>{{ catTitle(catOf(p.category_id)) }}</bdi></span>
            </div>
            <div class="s-main">
              <router-link :to="productTo(p)" aria-hidden="true" class="s-th" tabindex="-1"><img :src="thumb(p)" alt="" loading="lazy" /></router-link>
              <div>
                <router-link :to="productTo(p)" class="s-t">{{ p.title }}</router-link>
                <p class="s-m">{{ selMeta(p) }}</p>
              </div>
            </div>
            <p class="s-pr">
              <span class="now money">{{ money(pv(p).now) }}</span><template v-if="pv(p).was">{{ " " }}<s class="was money">{{ money(pv(p).was) }}</s></template>
            </p>
            <div class="s-act"><pr-add :product="p" /></div>
          </li>
        </ol>
      </div>
    </section>

    <!-- 8 · Photo band -->
    <section :aria-label="t('pralino.home.bandAria', 'Photo band')" class="pband">
      <pr-photo :alt="t('pralino.home.bandAlt', 'Pastries in the warm light of the shop')" art="croissant" class="pb-ph" deep name="pralino-parallax">
        <template v-if="bandPieces.length" #fallback><pr-cuts :products="bandPieces" kind="row" /></template>
        <a :aria-label="t('pralino.home.toMarquee', 'Scroll to the collections')" class="pb-down" href="#marquee" @click.prevent="jump('marquee')"><pr-icon name="down" /></a>
      </pr-photo>
    </section>

    <!-- 9 · Marquee -->
    <section v-if="cats.length" id="marquee" :aria-label="t('pralino.home.marqAria', 'Collections')" class="marq">
      <div class="mq-track">
        <ul v-for="copy in [0, 1]" :key="copy" :aria-hidden="copy ? 'true' : undefined" class="mq-list">
          <li v-for="c in cats" :key="c.id">
            <span aria-hidden="true" class="mq-h">·</span><router-link :tabindex="copy ? -1 : undefined" :to="catTo(c)"><bdi>{{ catTitle(c) }}</bdi></router-link>
          </li>
        </ul>
      </div>
    </section>

    <!-- 10 · Journal (tint band, last) -->
    <section v-if="posts.length" aria-labelledby="j-h" class="journal band">
      <div class="j-in">
        <pr-photo :alt="t('pralino.home.journalAlt', 'A café table by the window')" art="whisk" class="j-ph" name="pralino-journal">
          <span aria-hidden="true" class="j-word" data-over-photo>{{ t("pralino.home.journalWord", "Journal") }}</span>
        </pr-photo>
        <div class="j-txt">
          <p class="eyebrow">{{ t("pralino.home.jEyebrow", "Inspired by the counter") }}</p>
          <h2 id="j-h" class="h2">{{ t("pralino.home.jH", "Notes from the {shop} journal", { shop: shopName }) }}</h2>
          <p class="lead">{{ t("pralino.home.jLead", "Guides to the collections, and plain answers about ordering, delivery and pickup.") }}</p>
          <ul class="posts">
            <li v-for="b in posts" :key="b.id">
              <router-link :to="postRoute(b)" class="post">
                <span class="p-th"><img v-if="postImg(b)" :src="postImg(b)" :srcset="photoSrcset(postImg(b))" alt="" loading="lazy" sizes="112px" @error="dropSrcset" /></span>
                <span class="p-tx"
                  ><span v-if="b.created_at" class="p-m"><pr-icon name="cal" /><time :datetime="b.created_at">{{ fmtDate(b.created_at) }}</time></span
                  ><span class="p-t">{{ b.title }}</span></span
                >
                <pr-icon cls="chev" name="right" />
              </router-link>
            </li>
          </ul>
          <router-link :to="blogTo" class="btn sm">{{ t("pralino.home.allPosts", "All journal posts") }}</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import PrIcon from "./PrIcon.vue";
import PrArt from "./PrArt.vue";
import PrPhoto from "./PrPhoto.vue";
import PrCuts from "./PrCuts.vue";
import PrAdd from "./PrAdd.vue";
import { collectionPhoto } from "./pr-photos";
import { bySells, catOf, catTitle, catTo, pr, fmtDate, inCat, loadDm, mixed, money, priceView, productImage, productTo, scrollBehavior, shopFacts, unitOf } from "./pr";
import { catalogueRoute, dealsRoute, dropSrcset, percentOff, photoSrcset } from "../kalio/kalio-catalog";
import { journalPage, journalRoute, postRoute } from "../kalio/pages/kalio-journal";
import { currentCurrency } from "../region-switcher/region";
import { t } from "../kalio/i18n/kalio-i18n";
import { isEnglish } from "./product/pd";
import { windowWord } from "./buy/pr-cart";

const lang = () => document.documentElement.lang || "en";
const list = (items, type = "conjunction") => {
  try {
    return new Intl.ListFormat(lang(), { style: "long", type }).format(items);
  } catch {
    return items.join(", ");
  }
};
const NUM_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

export default {
  name: "PralinoHome",
  components: { PrIcon, PrArt, PrPhoto, PrCuts, PrAdd },

  data: () => ({ pr, posts: [] }),

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    currency() {
      return currentCurrency();
    },
    facts() {
      return shopFacts(this.shop);
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    cats() {
      return this.pr.cats;
    },
    products() {
      return this.pr.products;
    },
    /* The collections with products, by pieces sold (ties keep the shop's order). */
    rank() {
      return this.cats
        .map((c, i) => {
          const ps = bySells(inCat(c.id));
          return { c, i, ps, sold: ps.reduce((s, p) => s + (p.sells || 0), 0) };
        })
        .filter((x) => x.ps.length)
        .sort((a, b) => b.sold - a.sold || a.i - b.i);
    },
    best() {
      return bySells(this.products);
    },
    /* The saving: "25% off every piece" when every piece saves the same, else "Up to 30% off". */
    offs() {
      void this.currency;
      return this.products.map((p) => percentOff(this.shop, p)).filter((x) => x > 0);
    },
    offMax() {
      return this.offs.length ? Math.max(...this.offs) : 0;
    },
    offEvery() {
      return !!this.offs.length && this.offs.length === this.products.length && Math.min(...this.offs) === this.offMax;
    },
    offLine() {
      if (!this.offMax) return "";
      return this.offEvery ? t("pralino.home.offEvery", "{off}% off every piece", { off: this.offMax }) : t("pralino.home.offUpTo", "Up to {off}% off", { off: this.offMax });
    },
    fromPrice() {
      void this.currency;
      const now = this.products.filter((p) => p.quantity > 0).map((p) => this.pv(p).now);
      return now.length ? money(Math.min(...now)) : "";
    },
    street() {
      const p = this.facts.pickupPoint;
      return p?.address || String(this.facts.address || "").split(",")[0];
    },
    heroLead() {
      const f = this.facts;
      const n = this.cats.length;
      if (!n) return "";
      const count = t("pralino.home.nCollections", { one: "{n} collection", other: "{n} collections" }, { n });
      const where = this.street ? t("pralino.home.leadWhere", "{count} from the counter at {place}", { count, place: [this.street, f.city].filter(Boolean).join(", ") }) : count;
      const how = [];
      if (f.courier) how.push(t("pralino.home.leadCourier", "brought by the {courier}", { courier: f.courier.title }));
      if (f.shipping) how.push(t("pralino.home.leadShipped", "shipped"));
      if (f.pickup) how.push(t("pralino.home.leadPicked", "picked up"));
      const off = this.offLine ? ` — ${this.offLine.toLowerCase()}` : "";
      return how.length ? `${where}${off}, ${list(how, "disjunction")}.` : `${where}${off}.`;
    },
    insetPiece() {
      const top = this.rank[0];
      return top ? top.ps[1] || top.ps[0] : null;
    },
    /* Four counters (or two): no product count (the owner's rule), only the
       shop's real facts. */
    /* The shop's details, its collections and its catalogue are all in. Every sentence built from them
       (the hero's line, About, How ordering works, the offer card, the counters) waits for this, so
       none is drawn half-made and then rewritten ("Every day" turning into "Right now", "0 days"). */
    ready() {
      return this.facts.ready && this.pr.ready && this.pr.catsReady;
    },
    nums() {
      const f = this.facts;
      if (!this.ready) return [];
      const out = [];
      if (this.cats.length) out.push({ k: "c", value: this.cats.length, unit: "", label: t("pralino.home.numCols", { one: "collection", other: "collections" }, { n: this.cats.length }) });
      if (this.offMax) out.push({ k: "o", value: this.offMax, unit: "%", label: this.offEvery ? t("pralino.home.numOffEvery", "off every piece") : t("pralino.home.numOffMost", "off, at most") });
      if (f.days.length) out.push({ k: "d", value: f.days.length, unit: "", label: f.hours ? t("pralino.home.numDaysHours", { one: "day a week, {hours}", other: "days a week, {hours}" }, { n: f.days.length, hours: f.hours }) : t("pralino.home.numDays", { one: "day a week", other: "days a week" }, { n: f.days.length }) });
      if (f.ways.length) out.push({ k: "w", value: f.ways.length, unit: "", label: t("pralino.home.numWays", { one: "way to receive an order", other: "ways to receive an order" }, { n: f.ways.length }) });
      return out.length >= 4 ? out.slice(0, 4) : out.length >= 2 ? out.slice(0, 2) : out;
    },
    /* About, in the shop's own facts. */
    aboutP1() {
      const f = this.facts;
      const names = list(this.cats.map((c) => catTitle(c).toLowerCase()));
      const at = this.street
        ? t("pralino.home.aboutAt", "{shop} is a bakery counter at {street} in {city}.", { shop: this.shopName, street: this.street, city: f.city || "" }).replace(" in .", ".")
        : t("pralino.home.aboutIs", "{shop} is a bakery counter.", { shop: this.shopName });
      const unit = this.units[0];
      const sold = names
        ? unit
          ? t("pralino.home.aboutCols", "Its collections — {names} — are sold one piece at a time, so an order can be as small as a single {unit}.", { names, unit })
          : t("pralino.home.aboutCols0", "Its collections — {names} — are sold one piece at a time.", { names })
        : "";
      return [at, sold].filter(Boolean).join(" ");
    },
    aboutP2() {
      const f = this.facts;
      const how = [];
      if (f.courier) how.push(t("pralino.home.aboutCourier", "travel with the {courier}", { courier: f.courier.title }));
      if (f.shipping) how.push(t("pralino.home.aboutShip", "ship further away"));
      if (f.pickup) how.push(t("pralino.home.aboutPickup", "wait at the counter for pickup"));
      if (!how.length) return "";
      const pay = f.gateway?.name ? t("pralino.home.aboutPay", ", and they are paid by {gateway}", { gateway: f.gateway.name.toLowerCase() }) : "";
      return t("pralino.home.aboutHow", "Orders {how}{pay}.", { how: list(how, "disjunction"), pay });
    },
    /* The units the collections sell by ("croissant", "tart", "mini cake"). */
    units() {
      return [...new Set(this.rank.map((x) => unitOf(x.ps[0]).toLowerCase()))];
    },
    /* Up to five pieces, one per collection first (the About stand-in). */
    spread() {
      const out = [];
      const used = new Set();
      for (const p of this.best) if (out.length < 5 && !used.has(p.category_id)) out.push(p) && used.add(p.category_id);
      for (const p of this.best) if (out.length < 5 && !out.includes(p)) out.push(p);
      return out;
    },
    /* The top four collections (or two, or one: the 2 × 2 grid stays full). */
    topCols() {
      const n = this.rank.length >= 4 ? 4 : this.rank.length >= 2 ? 2 : this.rank.length;
      return this.rank.slice(0, n);
    },
    colsTitle() {
      const n = this.topCols.length;
      if (n === 1) return t("pralino.home.colsH1", "The collection people order most");
      return t("pralino.home.colsH", "The {n} collections people order most", { n: this.numWord(n) });
    },
    howLead() {
      return this.facts.gateway?.cod
        ? t("pralino.home.howLeadCod", "Choose the pieces, choose how they reach you, and pay when they arrive. Nothing is charged online.")
        : t("pralino.home.howLead", "Choose the pieces, choose how they reach you, and pay at checkout.");
    },
    /* The four features (an even number, so the 2 × 2 grid stays full). */
    feats() {
      const f = this.facts;
      const u = this.units;
      const out = [];
      out.push({
        k: "piece",
        art: "croissant",
        title: t("pralino.home.featPiece", "Piece by piece"),
        text: u.length >= 3
          ? t("pralino.home.featPieceP3", "Every pastry is sold on its own — one {a}, one {b} or a single {c}.", { a: u[0], b: u[1], c: u[2] })
          : t("pralino.home.featPieceP", "Every pastry is sold on its own, so you choose exactly the pieces you want."),
      });
      if (f.courier && f.courier.windows.length)
        out.push({ k: "win", art: "clock", title: t("pralino.home.featWindow", "Pick a window"), text: t("pralino.home.featWindowP", "The {courier} comes in the window you choose: {windows}.", { courier: f.courier.title, windows: list(f.courier.windows, "disjunction") }) });
      if (f.gateway) out.push({ k: "pay", art: "cash", title: f.gateway.name, text: f.gateway.description || t("pralino.home.featPayP", "Pay when the order reaches you.") });
      if (f.pickup)
        out.push({
          k: "pick",
          art: "awning",
          title: t("pralino.home.featPickup", "Or pick it up"),
          text: this.street
            ? f.hours
              ? f.everyDay
                ? t("pralino.home.featPickupP", "At the counter, {street}, every day {hours}.", { street: this.street, hours: f.hours })
                : t("pralino.home.featPickupPh", "At the counter, {street}, {hours}.", { street: this.street, hours: f.hours })
              : t("pralino.home.featPickupPs", "At the counter, {street}.", { street: this.street })
            : t("pralino.home.featPickupP0", "At the counter."),
        });
      if (f.shipping)
        out.push({
          k: "ship",
          art: "cake",
          title: t("pralino.home.featShip", "Or have it shipped"),
          text: f.shipping.freeOver ? t("pralino.home.featShipFree", "{way}, free on orders over {amount}.", { way: f.shipping.title, amount: money(f.shipping.freeOver, true) }) : t("pralino.home.featShipP", "{way}.", { way: f.shipping.title }),
        });
      const n = out.length >= 4 ? 4 : out.length >= 2 ? 2 : out.length;
      return out.slice(0, n);
    },
    howPlate() {
      const x = this.rank[1] || this.rank[0];
      return x ? x.ps[0] : null;
    },
    courierNote() {
      const c = this.facts.courier;
      if (!c) return "";
      return c.distance ? t("pralino.home.courierWithin", "Local delivery within {km} km of the bakery.", { km: c.distance }) : t("pralino.home.courierLocal", "Local delivery.");
    },
    courierChecks() {
      const c = this.facts.courier;
      if (!c) return [];
      const out = [];
      if (c.days.length) out.push(c.days.length >= 7 ? t("pralino.home.everyDayCap", "Every day") : list(c.days.map((d) => String(d).slice(0, 3))));
      out.push(c.fee ? t("pralino.home.deliveryFee", "Delivery {fee}", { fee: money(c.fee) }) : t("pralino.home.noFee", "No delivery fee"));
      out.push(c.cod ? t("pralino.home.payCourier", "Pay the courier in cash") : t("pralino.home.paidCheckout", "Paid at checkout"));
      return out;
    },
    /* The courier's windows, its radius, free shipping from. */
    fnums() {
      const f = this.facts;
      const out = [];
      if (f.courier?.windows.length) out.push({ k: "w", value: f.courier.windows.length, unit: "", label: t("pralino.home.fnWindows", { one: "Courier window", other: "Courier windows" }, { n: f.courier.windows.length }) });
      if (f.courier?.distance) out.push({ k: "r", value: f.courier.distance, unit: t("pralino.home.km", "km"), label: t("pralino.home.fnRadius", "Courier radius") });
      if (f.shipping?.freeOver) out.push({ k: "s", value: money(f.shipping.freeOver, true), unit: "", label: t("pralino.home.fnFree", "Free shipping from") });
      return out;
    },
    /* The biggest saving, standing in for the offer card's photo. */
    offerPiece() {
      const list = this.products.filter((p) => p.quantity > 0 && p.icon);
      if (!list.length) return null;
      return [...list].sort((a, b) => this.pv(b).save - this.pv(a).save || (b.sells || 0) - (a.sells || 0))[0];
    },
    waysTitle() {
      const n = this.facts.ways.length;
      if (n === 1) return t("pralino.home.waysH1", "One way to receive it");
      return t("pralino.home.waysH", "{n} ways to receive it", { n: this.capital(this.numWord(n)) });
    },
    /* The gallery: the most-ordered collection in the middle, the others
       around it, product plates wherever a collection is missing (every
       slot is always filled). */
    gallery() {
      if (!this.rank.length) return null;
      const centre = this.rank[0].c;
      const others = this.cats.filter((c) => c.id !== centre.id && inCat(c.id).length);
      /* The plates: best sellers of the collections that sit farthest from
         them (the last tiles first), so a plate never stands next to its
         own collection's tile; then any best seller. */
      const plates = [];
      const seen = new Set();
      for (const c of [...others].reverse()) {
        const p = bySells(inCat(c.id))[0];
        if (p && !seen.has(p.id)) {
          plates.push(p);
          seen.add(p.id);
        }
      }
      for (const p of this.best) if (!seen.has(p.id)) plates.push(p) && seen.add(p.id);
      let oi = 0;
      let pi = 0;
      const tile = (r) => (oi < others.length ? { key: "c" + others[oi].id, cat: others[oi++], r } : { key: "p" + (plates[pi] || {}).id, p: plates[pi++], r });
      const plate = (r) => ({ key: "p" + (plates[pi] || {}).id, p: plates[pi++], r });
      const c1 = [tile("r45"), plate("r11")];
      const c2 = [plate("r11"), tile("r45")];
      const c4 = [tile("r43"), tile("r43"), tile("r43")];
      const ok = (arr) => arr.every((x) => x.cat || x.p);
      if (!ok(c1) || !ok(c2) || !ok(c4)) return null;
      return {
        cols: [
          { k: "c1", tiles: c1 },
          { k: "c2", tiles: c2 },
          { k: "c3", tiles: [], centre },
          { k: "c4", tiles: c4 },
        ],
      };
    },
    /* Best sellers, mixed across collections (never one kind only), in stock. */
    selection() {
      return mixed(bySells(this.products.filter((p) => p.quantity > 0))).slice(0, 6);
    },
    /* The photo band's stand-in: the best seller of each collection. */
    bandPieces() {
      return this.rank.map((x) => x.ps[0]).filter(Boolean).slice(0, 5);
    },
    r() {
      return window.$storefront.routes;
    },
    dealsTo() {
      return dealsRoute();
    },
    allTo() {
      return catalogueRoute({});
    },
    blogTo() {
      return journalRoute();
    },
    contactTo() {
      return { name: this.r.SHOP_CONTACT_US };
    },
  },

  created() {
    loadDm();
  },

  mounted() {
    journalPage({ page: 1, limit: 8 })
      .then(({ articles }) => {
        const list = (articles || []).slice().sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
        this.posts = list.slice(0, 4);
      })
      .catch(() => (this.posts = []));
  },

  methods: {
    t,
    money,
    catOf,
    catTitle,
    catTo,
    bySells,
    inCat,
    unitOf,
    productTo,
    postRoute,
    fmtDate,
    photoSrcset,
    dropSrcset,
    pv(p) {
      void this.currency;
      return priceView(this.shop, p);
    },
    img(p) {
      return productImage(p);
    },
    thumb(p) {
      return productImage(p, 128);
    },
    colPhoto(c) {
      return collectionPhoto(c);
    },
    postImg(b) {
      return b.image ? window.CDN.GET_SHOP_IMAGE_PATH(b.image, null) : null;
    },
    capital(s) {
      s = String(s || "");
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    /* "six" in English; the number itself in a language without the word. */
    numWord(n) {
      return isEnglish() && n >= 0 && n < NUM_WORDS.length ? NUM_WORDS[n] : String(n);
    },
    /* the way's own line icon (the courier, shipping, pickup), else a tick */
    wayIcon(w) {
      if (w.pickup) return "store";
      if (w.type === "Global" || w.type === "Post") return "plane";
      if (w.type === "Motorbike" || w.type === "Car" || w.type === "Bicycle" || w.type === "Truck") return "bike";
      return "check";
    },
    feeText(w) {
      if (!w.fee) return t("pralino.home.free", "Free");
      return w.freeOver ? t("pralino.home.feeFreeOver", "{fee} · free over {amount}", { fee: money(w.fee), amount: money(w.freeOver, true) }) : money(w.fee);
    },
    /* A way's line from its own data: the courier's radius and windows, the
       shipping's free threshold, the pickup counter's own note. */
    wayNote(w) {
      if (w.pickup) return this.facts.pickupNote || (w.windows.length ? list(w.windows.map(windowWord)) : "");
      if (w.type === "Global" || w.type === "Post") return w.freeOver ? t("pralino.home.shipsFree", "Ships anywhere; free on orders over {amount}", { amount: money(w.freeOver, true) }) : t("pralino.home.ships", "Ships anywhere");
      const near = w.distance ? t("pralino.home.courierWithinShort", "Local delivery within {km} km of the bakery", { km: w.distance }) : t("pralino.home.courierLocalShort", "Local delivery");
      return w.windows.length ? `${near} · ${list(w.windows.map(windowWord))}` : near;
    },
    selMeta(p) {
      const v = this.pv(p);
      const parts = [t("pralino.home.perUnit", "Per {unit}", { unit: unitOf(p) })];
      if (v.off > 0) parts.push(t("pralino.home.offPct", "{off}% off", { off: v.off }));
      parts.push(p.quantity > 0 && p.quantity <= 5 ? t("pralino.home.onlyLeft", "only {n} left", { n: p.quantity }) : t("pralino.home.inStock", "in stock"));
      return parts.join(" · ");
    },
    jump(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    },
  },
};
</script>
