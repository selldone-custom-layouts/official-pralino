<!-- Pralino — one line of an icon list (shell.js icLine()): the icon in its
     own column, the bold title, the words under it. Every icon of a list
     starts on the same edge, with the same box and gap. -->
<template>
  <li class="il">
    <span class="il-ic"><pr-icon :name="icon" /></span>
    <div class="il-tx">
      <b><slot name="title">{{ title }}</slot></b><span v-if="text || $slots.default"><slot>{{ text }}</slot></span>
    </div>
  </li>
</template>

<script>
import PrIcon from "../PrIcon.vue";

export default {
  name: "PrIcLine",
  components: { PrIcon },
  props: {
    icon: { type: String, required: true },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
  },
};
</script>
