<!--
  Pralino — how the order is paid (pages-buy.js order, the Payment card):
  the big line ("Pay on delivery $14.89", "Pay at pickup", "Paid", "To pay",
  "Nothing to pay") and the way under it with the shop's own words (its
  cash gateway's description, the card that paid, gift cards, cashback);
  "Pay now" and "Use another way to pay" while an online payment waits.
  KalioOrderReceipt's script reads Selldone's payment and transactions.
-->
<template>
  <div class="od-c pr-od-pay">
    <h2 class="co-h">{{ t("pralino.od.payment", "Payment") }}</h2>
    <p :class="['pay-big', 'pr-' + pay.tone]">
      <span>{{ bigWord }}</span><b class="money">{{ money(total) }}</b>
    </p>
    <ul class="ils sm">
      <pr-ic-line :icon="lineIcon" :text="lineText" :title="pay.title" />
      <pr-ic-line v-for="card in basket.gift_cards || []" :key="card.number" :text="money(card.amount, card.currency)" :title="t('pralino.od.giftCard', 'Gift card {number}', { number: lastFour(card.number) })" icon="gift" />
      <pr-ic-line v-if="basket.cashback_order" :text="basket.cashback_order.cashback?.title || ''" :title="t('pralino.od.cashback', '{amount} comes back to you', { amount: money(basket.cashback_order.amount_cashback, basket.cashback_order.currency) })" icon="cash" />
    </ul>
    <div v-if="pay.canPay || pay.canSwitch" class="pr-od-acts">
      <button v-if="pay.canPay" class="btn sm" type="button" @click="payNow"><pr-icon name="lock" />{{ t("pralino.od.payNow", "Pay now") }}</button>
      <button v-if="pay.canSwitch" class="qlink" type="button" @click="switchWay">{{ t("pralino.od.payOther", "Use another way to pay") }}</button>
    </div>
  </div>
</template>

<script>
import KalioOrderReceipt from "../../kalio/order/KalioOrderReceipt.vue";
import PrIcon from "../PrIcon.vue";
import PrIcLine from "../ui/PrIcLine.vue";
import { shopFacts } from "../pr";
import { isPickupWay } from "../buy/pr-cart";
import { money } from "../../region-switcher/region";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrOrderPay",
  extends: KalioOrderReceipt,
  components: { PrIcon, PrIcLine },
  inject: { $shop: { default: null } },
  computed: {
    pickup() {
      return isPickupWay(this.basket?.delivery_info);
    },
    paidOnDelivery() {
      return this.pay.tone === "ok" && this.basket?.status !== "Payed";
    },
    bigWord() {
      if (this.pay.tone === "off") return t("pralino.od.nothing", "Nothing to pay");
      if (this.basket?.status === "Payed") return t("pralino.od.paid", "Paid");
      if (this.paidOnDelivery) return this.pickup ? t("pralino.od.payAtPickup", "Pay at pickup") : t("pralino.od.payOnDelivery", "Pay on delivery");
      return t("pralino.od.toPay", "To pay");
    },
    lineIcon() {
      if (this.basket?.status === "Payed") return "check";
      if (this.pay.tone === "off") return "close";
      if (this.paidOnDelivery) return "cash";
      return this.pay.canPay ? "lock" : "clock";
    },
    /* Cash on delivery: the shop's own words for its gateway, as the
       mockup ("The buyer pays the courier when the order is delivered");
       at the counter, the counter. */
    lineText() {
      if (this.paidOnDelivery) {
        if (this.pickup) return t("pralino.od.payAtCounter", "You pay in cash at the counter when you collect it.");
        return shopFacts(this.$shop).gateway?.description || this.pay.note || "";
      }
      return this.pay.note || "";
    },
  },
  methods: {
    t,
    money(amount, currency) {
      return money(Number(amount) || 0, currency || this.basket?.currency);
    },
  },
};
</script>
