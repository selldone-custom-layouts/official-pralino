<!-- Pralino — tells the shipping options inside it that they are drawn in the
     delivery sheet (delivery-b's rows), not on the checkout (its cards). -->
<template>
  <slot />
</template>

<script>
export default {
  name: "PrShipSheet",
  provide: { dmShipSheet: true },
};
</script>
