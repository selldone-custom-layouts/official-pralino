/*
 * Pralino — the photo slots (pralino-design/photos/, generated with Magnific (Freepik) for Bakio under the
 * owner's Premium plan).
 *
 * The only shop-specific files in the Layout are the photos in assets/pralino/:
 *
 * - the eight Pralino slots, by name: pralino-hero-back, pralino-hero-inset, pralino-about, pralino-how,
 *   pralino-offer, pralino-parallax, pralino-journal, pralino-footer;
 * - one photo per collection, pralino-col-<slug>.webp, where <slug> is made from the collection's title
 *   ("Danish Pastries" -> danish-pastries); the collection's own address name is tried too.
 *
 * import.meta.glob lists only the files that exist at build time. A slot without its file never shows a
 * caption or a file name: PrPhoto.vue draws the designed fallback (the family tint with the mockup's line
 * art, or live cut-outs of the shop's own pastries), and a collection without a photo gets its own best
 * sellers on a plate. So a cloned shop, a new collection or a missing photo never shows an empty box.
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

/** A slug made from a title: "Danish Pastries" -> "danish-pastries". */
export function slugOf(title: string | null | undefined): string {
  return String(title || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The collection's photo (pralino-col-<slug of its title>.webp, else of its address name), or null. */
export function collectionPhoto(category: any): string | null {
  if (!category) return null;
  for (const key of [slugOf(category.title), slugOf(category.name)]) {
    const url = key && BY_NAME.get("pralino-col-" + key);
    if (url) return url;
  }
  return null;
}
