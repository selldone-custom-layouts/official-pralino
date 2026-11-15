<!--
  Pralino — a photo slot (pralino-design/CODEX-PROMPTS.md; the mockup's ph()).
  With assets/pralino/<name>.webp in the build it shows that photo (cover),
  with the mockup's soft scrim under words on a deep slot. Without it, the
  designed fallback: the tinted surface (light or deep) with the mockup's
  line art, or whatever the "fallback" slot draws (live cut-outs of the
  shop's own pastries). Never a caption, a file name or a size. The default
  slot is the slot's own words and links (they sit over the photo).
-->
<template>
  <div :class="['ph', { deep, 'has-photo': !!src }]" :data-photo="name">
    <img v-if="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" :src="src" class="ph-img" decoding="async" draggable="false" />
    <template v-else>
      <slot name="fallback">
        <span aria-hidden="true" class="ph-art"><pr-art :name="art" /></span>
      </slot>
    </template>
    <slot />
  </div>
</template>

<script>
import PrArt from "./PrArt.vue";
import { slotPhoto } from "./pr-photos";

export default {
  name: "PrPhoto",
  components: { PrArt },
  props: {
    /** The slot's name: assets/pralino/<name>.webp. */
    name: { type: String, required: true },
    /** The deep (cocoa) surface: a slot with light words over it. */
    deep: { type: Boolean, default: false },
    /** The fallback's line art (pr-icons.ts ART). */
    art: { type: String, default: "croissant" },
    alt: { type: String, default: "" },
    eager: { type: Boolean, default: false },
  },
  computed: {
    src() {
      return slotPhoto(this.name);
    },
  },
};
</script>
