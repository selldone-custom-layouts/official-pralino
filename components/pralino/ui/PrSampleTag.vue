<!-- Pralino — the "Sample text" label on a page the shop has not written yet. -->
<template>
  <p class="sample-tag"><pr-icon name="info" />{{ text || t("pralino.sample.default", "Sample text — the shop has not written this page yet") }}</p>
</template>

<script>
import PrIcon from "../PrIcon.vue";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "PrSampleTag",
  components: { PrIcon },
  props: { text: { type: String, default: "" } },
  methods: { t },
};
</script>
