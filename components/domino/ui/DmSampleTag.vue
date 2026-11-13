<!-- Domino — the "Sample text" label on a page the shop has not written yet. -->
<template>
  <p class="sample-tag"><dm-icon name="info" />{{ text || t("domino.sample.default", "Sample text — the shop has not written this page yet") }}</p>
</template>

<script>
import DmIcon from "../DmIcon.vue";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "DmSampleTag",
  components: { DmIcon },
  props: { text: { type: String, default: "" } },
  methods: { t },
};
</script>
