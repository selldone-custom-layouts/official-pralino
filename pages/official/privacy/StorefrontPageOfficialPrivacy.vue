<!--
  Domino: the shop's privacy page (DmLegal: the shop's own text when it has
  written one, else sample copy from its facts, labelled as sample).
-->
<template>
  <dm-legal kind="privacy" />
</template>

<script lang="ts">
import DmLegal from "@app-storefront/components/domino/read/DmLegal.vue";

export default {
  name: "StorefrontPageOfficialPrivacy",
  components: { DmLegal },
};
</script>
