<!--
  Pralino: the shop's privacy page (PrLegal: the shop's own text when it has
  written one, else sample copy from its facts, labelled as sample).
-->
<template>
  <pr-legal kind="privacy" />
</template>

<script lang="ts">
import PrLegal from "@app-storefront/components/pralino/read/PrLegal.vue";

export default {
  name: "StorefrontPageOfficialPrivacy",
  components: { PrLegal },
};
</script>
