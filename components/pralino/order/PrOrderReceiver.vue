<!--
  Pralino — who receives the order and how (pages-buy.js order, the Receiver
  card): icon lines as the mockup — the receiver and phone, the address
  (with "Change address" until it is sent: Selldone allows it then; the
  address sheet works with the map on or off), the way · window and its
  reach. A pickup shows the counter and "Directions". Then what Selldone
  adds when it has it: the time asked for, the courier, the carrier and
  tracking code, the billing details (changeable until sent), the shop's
  own checkout questions, "Has it arrived?" once it is sent, and the trip.
  KalioOrderDelivery's script: it writes Selldone's order.
-->
<template>
  <div class="od-c pr-od-rcv">
    <h2 class="co-h">{{ is_pickup ? t("pralino.od.pickup", "Pickup") : t("pralino.od.receiver", "Receiver") }}</h2>

    <div v-if="canConfirmReceived" class="pr-od-ask">
      <b>{{ is_pickup ? t("pralino.od.askPickup", "Picked it up?") : t("pralino.od.askArrived", "Has it arrived?") }}</b>
      <p>{{ t("pralino.od.askLede", "Let the shop know once your order is with you.") }}</p>
      <s-order-delivery-auto-complete :basket="basket" class="pr-od-auto" />
      <button :aria-disabled="busy_receive ? 'true' : undefined" class="btn sm" type="button" @click="busy_receive || confirmReceived()">
        <pr-icon name="check" />{{ is_pickup ? t("pralino.od.confirmPickup", "I’ve picked it up") : t("pralino.od.confirmArrived", "I’ve got my order") }}
      </button>
    </div>

    <p v-if="delivered" class="pr-od-done">
      <pr-icon name="check" /><span
        ><b>{{ is_pickup ? t("pralino.od.pickedUp", "Picked up") : t("pralino.od.delivered", "Delivered") }}</b
        ><template v-if="basket.delivery_at">{{ " · " + when(basket.delivery_at) }}</template></span
      >
    </p>

    <ul class="ils sm">
      <pr-ic-line v-if="!is_pickup && (receiver.name || receiver.phone)" :text="receiver.name ? receiver.phone || '' : ''" :title="receiver.name || receiver.phone" icon="user" />
      <pr-ic-line v-if="is_pickup && pickupContact" :text="pickupContact" :title="t('pralino.od.collectedBy', 'Collected by')" icon="user" />
      <li class="il">
        <span class="il-ic"><pr-icon :name="is_pickup ? 'store' : 'pin'" /></span>
        <div class="il-tx">
          <b>{{ addressTitle }}</b><span v-if="addressText">{{ addressText }}</span>
          <span v-if="receiver.message" class="pr-od-note">“{{ receiver.message }}”</span>
          <span v-if="canEditAddress || (is_pickup && directions)" class="pr-il-acts">
            <button v-if="canEditAddress" :aria-disabled="busy_address ? 'true' : undefined" class="qlink" type="button" @click="busy_address || (address_sheet = true)">
              <pr-icon name="edit" />{{ t("pralino.od.changeAddress", "Change address") }}
            </button>
            <a v-if="is_pickup && directions" :href="directions" class="qlink" rel="noopener" target="_blank"><pr-icon name="pin" />{{ t("pralino.od.directions", "Directions") }}</a>
          </span>
        </div>
      </li>
      <pr-ic-line v-if="methodLine" :icon="wayIcon(delivery_info?.type)" :text="reach || whenText || ''" :title="methodLine" />
      <pr-ic-line v-if="whenText && reach" :text="whenText" :title="t('pralino.od.when', 'When')" icon="cal" />
      <li v-if="courier" class="il">
        <span class="il-ic"><pr-icon name="bike" /></span>
        <div class="il-tx">
          <b>{{ courier.name }}</b><span>{{ t("pralino.od.courier", "Courier") }}</span>
          <span v-if="courier.phone" class="pr-il-acts"
            ><a :href="`tel:${courier.phone}`" class="qlink"><pr-icon name="phone" />{{ t("pralino.od.call", "Call {phone}", { phone: courier.phone }) }}</a></span
          >
        </div>
      </li>
      <pr-ic-line v-if="carrier" :text="t('pralino.od.carrier', 'Carrier')" :title="carrier" icon="box" />
      <li v-if="tracking.code || tracking.url" class="il">
        <span class="il-ic"><pr-icon name="link" /></span>
        <div class="il-tx">
          <b>{{ tracking.code || t("pralino.od.tracking", "Tracking") }}</b><span v-if="tracking.code">{{ t("pralino.od.tracking", "Tracking") }}</span>
          <span class="pr-il-acts">
            <button v-if="tracking.code" class="qlink" type="button" @click="copyCode"><pr-icon :name="copied ? 'check' : 'copy'" />{{ copied ? t("pralino.od.copied", "Copied") : t("pralino.od.copy", "Copy") }}</button>
            <a v-if="tracking.url" :href="tracking.url" class="qlink" rel="noopener" target="_blank"><pr-icon name="arrow" />{{ t("pralino.od.follow", "Follow the parcel") }}</a>
          </span>
        </div>
      </li>
      <li v-if="showBilling" class="il">
        <span class="il-ic"><pr-icon name="doc" /></span>
        <div class="il-tx">
          <template v-if="!edit_billing">
            <b>{{ billingWho }}</b><span v-if="billingLine">{{ billingLine }}</span
            ><span v-if="billing.tax_id">{{ t("pralino.od.taxId", "Tax ID {id}", { id: String(billing.tax_id) }) }}</span>
            <span v-if="canEditAddress" class="pr-il-acts"
              ><button class="qlink" type="button" @click="openBilling"><pr-icon name="edit" />{{ t("pralino.od.changeBilling", "Change billing") }}</button></span
            >
          </template>
          <form v-else class="pr-od-bill" @submit.prevent="saveBilling">
            <b>{{ t("pralino.od.billing", "Billing") }}</b>
            <div :aria-label="t('pralino.od.billing', 'Billing')" class="chips-r" role="radiogroup">
              <button :aria-checked="same_billing ? 'true' : 'false'" :class="['chip', { on: same_billing }]" role="radio" type="button" @click="same_billing = true">{{ t("pralino.od.billingSame", "Same as delivery") }}</button>
              <button :aria-checked="!same_billing ? 'true' : 'false'" :class="['chip', { on: !same_billing }]" role="radio" type="button" @click="same_billing = false">{{ t("pralino.od.billingOther", "Different details") }}</button>
            </div>
            <template v-if="!same_billing">
              <div class="fld">
                <label :for="'bl-n-' + basket.id" class="fl">{{ t("pralino.od.billingName", "Name on the receipt") }}</label>
                <input :id="'bl-n-' + basket.id" v-model="billing_name" autocomplete="name" class="inp" type="text" />
              </div>
              <div class="fld">
                <label :for="'bl-a-' + basket.id" class="fl">{{ t("pralino.od.billingAddress", "Billing address") }}</label>
                <input :id="'bl-a-' + basket.id" v-model="billing_address" autocomplete="street-address" class="inp" type="text" />
              </div>
            </template>
            <div class="pr-od-acts">
              <button :aria-disabled="busy_billing ? 'true' : undefined" class="btn sm" type="submit">{{ t("pralino.od.save", "Save") }}</button>
              <button class="qlink" type="button" @click="edit_billing = false">{{ t("pralino.od.cancel", "Cancel") }}</button>
            </div>
          </form>
        </div>
      </li>
      <pr-ic-line v-for="a in formAnswers" :key="a.name" :text="a.value || t('pralino.od.notGiven', 'Not given')" :title="a.label" icon="info" />
    </ul>

    <div v-if="trip.length" class="pr-od-trip">
      <p class="eyebrow">{{ t("pralino.od.trip", "The trip") }}</p>
      <ol>
        <li v-for="step in trip" :key="step.key" :class="'-' + step.tone">
          <span aria-hidden="true" class="pr-od-dot"></span>
          <span class="pr-od-tw"
            ><b>{{ step.title }}</b><small v-if="step.note">{{ step.note }}</small></span
          >
          <time v-if="step.at" :datetime="step.at">{{ step.time }}</time>
        </li>
      </ol>
    </div>

    <kalio-address-sheet
      v-if="canEditAddress"
      v-model="address_sheet"
      :center="receiver.location || null"
      :countries="$shop.countries?.length ? $shop.countries : null"
      :heading="t('pralino.od.sheetHeading', 'Change the address')"
      :lede="t('pralino.od.sheetLede', 'Until your order is sent, the shop delivers wherever you put the pin.')"
      :no-map="noMap"
      :receiver-info="receiver"
      @save="saveAddress"
    />
  </div>
</template>

<script>
import KalioOrderDelivery from "../../kalio/order/KalioOrderDelivery.vue";
import PrIcon from "../PrIcon.vue";
import PrIcLine from "../ui/PrIcLine.vue";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrOrderReceiver",
  extends: KalioOrderDelivery,
  components: { PrIcon, PrIcLine },
  computed: {
    addressTitle() {
      if (this.is_pickup) return this.addressLines[0] || t("pralino.od.pickAt", "Pick it up at the counter");
      return this.addressLines[0] || t("pralino.od.noAddress", "No address on this order");
    },
    addressText() {
      return this.addressLines.slice(1).join(", ");
    },
  },
  methods: { t },
};
</script>
