<!--
  Pralino — the order's messages (pages-buy.js order, aside.chat): the shop's
  mark, its name and opening hours; "Order placed · <date>", the Layout's
  own invitation in the shop's voice, then Selldone's messages (the shop's
  with its mark, the shopper's on the right, a day line when the day
  changes; the shopper can take back their own: "Delete?" twice); a few
  starters while the thread is empty; one line to write and Send.
  KalioOrderChat's script: it posts to Selldone's order chat.
-->
<template>
  <aside :aria-label="t('pralino.od.chatAria', 'Messages with {shop}', { shop: shopName })" class="chat">
    <div class="chat-hd">
      <pr-mark />
      <div>
        <b>{{ shopName }}</b><small v-if="hours">{{ hours }}</small>
      </div>
    </div>
    <ol ref="thread" aria-live="polite" class="msgs" role="log">
      <li class="msg sys">
        <span>{{ placedWord }}</span>
      </li>
      <li class="msg them">
        <pr-mark sm />
        <p>{{ t("pralino.od.chatHello", "Questions about this order? Write here and the bakery answers in this chat.") }}</p>
      </li>
      <template v-for="group in days" :key="group.key">
        <li class="msg sys">
          <span>{{ group.label }}</span>
        </li>
        <li v-for="m in group.items" :key="m.index" :class="['msg', m.mine ? 'me' : 'them', { 'pr-busy': deleting === m.index }]">
          <pr-mark v-if="!m.mine" sm />
          <p>
            {{ m.message.body }}<time :datetime="m.message.date" :title="full(m.message.date)" class="pr-msg-t">{{ time(m.message.date) }}</time>
          </p>
          <button
            v-if="m.mine"
            :aria-label="confirming === m.index ? t('pralino.od.chatDeleteThis', 'Delete this message') : t('pralino.od.chatDelete', 'Delete')"
            :class="['pr-msg-x', { '-ask': confirming === m.index }]"
            :disabled="deleting !== null"
            type="button"
            @blur="confirming = null"
            @click="askDelete(m)"
          >
            <template v-if="confirming === m.index">{{ t("pralino.od.chatDeleteAsk", "Delete?") }}</template><pr-icon v-else name="trash" />
          </button>
        </li>
      </template>
    </ol>
    <div v-if="!messages.length" class="pr-chat-st chips-r">
      <button v-for="s in starters" :key="s" class="chip" type="button" @click="useStarter(s)">{{ s }}</button>
    </div>
    <form class="chat-f" @submit.prevent="send">
      <label :for="'chat-in-' + basket.id" class="sr">{{ t("pralino.od.chatLabel", "Message to {shop}", { shop: shopName }) }}</label>
      <input
        :id="'chat-in-' + basket.id"
        ref="input"
        v-model="draft"
        :placeholder="t('pralino.od.chatPh', 'Write to {shop}…', { shop: shopName })"
        autocomplete="off"
        class="inp"
        maxlength="1000"
      />
      <button :aria-disabled="!ready ? 'true' : undefined" :aria-label="t('pralino.od.chatSend', 'Send')" class="ibtn send" type="submit"><pr-icon name="send" /></button>
    </form>
  </aside>
</template>

<script>
import KalioOrderChat from "../../kalio/order/KalioOrderChat.vue";
import PrIcon from "../PrIcon.vue";
import PrMark from "../ui/PrMark.vue";
import { openLine, shopFacts } from "../pr";
import { placedAt } from "./od";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrOrderChat",
  extends: KalioOrderChat,
  components: { PrIcon, PrMark },
  computed: {
    shopName() {
      const raw = String(this.$shop?.title || "");
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    },
    hours() {
      return openLine(shopFacts(this.$shop));
    },
    placedWord() {
      const at = placedAt(this.basket);
      return at ? t("pralino.od.chatPlaced", "Order placed · {date}", { date: at }) : t("pralino.od.chatPlacedNoDate", "Order placed");
    },
  },
  methods: {
    t,
    grow() {},
    useStarter(text) {
      this.draft = text;
      this.$nextTick(() => this.$refs.input?.focus());
    },
  },
};
</script>
