<!--
  Pralino: the shop's terms page (PrLegal: the shop's own text when it has
  written one, else sample copy from its facts, labelled as sample).
-->
<template>
  <pr-legal kind="terms" />
</template>

<script lang="ts">
import PrLegal from "@app-storefront/components/pralino/read/PrLegal.vue";

export default {
  name: "StorefrontPageOfficialTerms",
  components: { PrLegal },
};
</script>
