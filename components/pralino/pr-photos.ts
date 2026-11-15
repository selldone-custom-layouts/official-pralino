/*
 * Pralino — the photo slots (pralino-design/CODEX-PROMPTS.md).
 *
 * The only shop-specific files in the Layout are photos in assets/pralino/:
 *
 * - the eight Pralino slots, by name: pralino-hero-back, pralino-hero-inset,
 *   pralino-about, pralino-how, pralino-offer, pralino-parallax, pralino-journal,
 *   pralino-footer (the owner's Codex photos, dropped in later with exactly
 *   these names);
 * - one portrait photo per collection, hero-<collection name>.webp (shared
 *   with Bakini Noir), matched by the collection's own `name` (its address
 *   slug).
 *
 * import.meta.glob lists only the files that exist at build time. A slot
 * without its file never shows a caption or a file name: PrPhoto.vue draws
 * the designed fallback (the tinted surface with the mockup's line art, or
 * live cut-outs of the shop's own pastries), and a collection without a
 * photo gets its own best sellers on a plate. So a cloned shop, a new
 * collection or a missing photo never shows an empty or broken box.
 */
const FILES = import.meta.glob("../../assets/pralino/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const BY_NAME = new Map<string, string>(Object.entries(FILES).map(([path, url]) => [path.split("/").pop()!.replace(/\.\w+$/, ""), url]));

/** The slot's photo ("pralino-about"), or null (then its fallback shows). */
export function slotPhoto(name: string): string | null {
  return BY_NAME.get(name) || null;
}

/** The collection's portrait photo (hero-<name>.webp), or null. */
export function collectionPhoto(category: any): string | null {
  const slug = category?.name;
  return (slug && BY_NAME.get(`hero-${slug}`)) || null;
}
