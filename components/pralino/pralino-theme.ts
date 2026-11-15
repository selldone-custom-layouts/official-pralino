/*
 * Pralino Classic Patisserie — the theme switcher's config (the footer's Theme row: the owner's rules:
 * colour palettes, a custom colour and Light / Dark, a click changes the whole site; the same shared
 * package in every Layout, components/theme-switcher/).
 *
 * Pralino is light first (pralino-design/home-a.html, set A "Classic"): white and soft-tint bands, the
 * family's near-black ink, a tan accent. ONE COLOUR FAMILY: components/pralino/pralino-family.ts writes
 * every colour of the chosen palette's family (grounds, plates, lines, words, the dark bars) inline on
 * <html>; this config writes the action colour (--pr-act, -deep, -on, -text) and Vuetify's primary, and
 * keeps the inherited names (--bk-act*, which Vuetify's --v-theme-primary in kalio-tokens.scss and the
 * shared Kalio pages read) on the same colour.
 *
 * The palettes are the mockup's (pralino-design/src/tokens.js PRESETS): Tan (the brand), Rose, Sage,
 * Slate and Ink, each built by paletteFromColor() on its own family's surfaces, exactly as tokens.js
 * vars() builds them (the values below are its output). Contrast (WCAG 2.1): white on every light
 * primary 5.1:1 or more (Tan #8b6640 5.16); every link colour 4.6:1 or more on the white page, the tint
 * band and the plate; the dark primaries keep white words (5.1:1+) and their link colours read 7:1 on
 * the dark grounds.
 */
import type { ThemeSwitcherConfig } from "../theme-switcher/theme-switcher";
import { THEME_SETTINGS } from "./pralino-theme.settings";
import { t } from "../kalio/i18n/kalio-i18n";

/* One palette; the name is read when drawn, so it follows the visitor's language. */
function pal(id: string, name: () => string, light: Record<string, string>, dark: Record<string, string>) {
  return {
    id,
    get name() {
      return name();
    },
    light,
    dark,
  };
}

/* The surfaces a Custom colour is made readable on: every family's grounds sit at these lightnesses
   (white, the band L .985, the plate L .966; dark: page .17, band .195, card .225, plate .26). */
const LIGHT_SURFACES = ["#ffffff", "#fafafa", "#f4f4f4"];
const DARK_SURFACES = ["#0f0f0f", "#151515", "#1c1c1c", "#242424"];

export const PRALINO_THEME: ThemeSwitcherConfig = {
  /* The merchant's choice: pralino-theme.settings.ts, the one file to edit. */
  settings: THEME_SETTINGS,

  /* The owner (9 November 2026): a merchant who imports the Layout into their
     own shop must not see the switcher. With themeSwitcher "showcase" it
     shows only on these shops (window.shop.id, else <meta name="shop-name">). */
  showcaseShops: [
    { id: 15740, name: "bakio" }, // Bakio: Bakini Noir, Domino, Galio, Pralino
    { id: 15549, name: "digini-hzgablru" }, // Digini: Digito, Besti, Argon, Senso, Medio
    { id: 15645, name: "molino" }, // Molino: Molino, Tario, Walio, Dino, Valero
  ],

  storageKey: "pralino-theme",
  darkClass: "pr-dark",
  defaultMode: "light",

  palettes: [
    pal(
      "tan",
      () => t("pralino.palette.tan", "Tan"),
      { primary: "#8b6640", deep: "#76522d", soft: "#ffeddb", onPrimary: "#ffffff", text: "#8b6640" },
      { primary: "#8a653f", deep: "#7b5731", soft: "#3f2810", onPrimary: "#ffffff", text: "#d1a881" },
    ),
    pal(
      "rose",
      () => t("pralino.palette.rose", "Rose"),
      { primary: "#a15668", deep: "#8b4255", soft: "#ffeaee", onPrimary: "#ffffff", text: "#a15668" },
      { primary: "#a05668", deep: "#90475a", soft: "#43232a", onPrimary: "#ffffff", text: "#ea98aa" },
    ),
    pal(
      "sage",
      () => t("pralino.palette.sage", "Sage"),
      { primary: "#577652", deep: "#44623f", soft: "#e4f7e1", onPrimary: "#ffffff", text: "#577652" },
      { primary: "#567451", deep: "#476643", soft: "#1f341c", onPrimary: "#ffffff", text: "#99bb94" },
    ),
    pal(
      "slate",
      () => t("pralino.palette.slate", "Slate"),
      { primary: "#546f8e", deep: "#415b79", soft: "#e6f1ff", onPrimary: "#ffffff", text: "#546f8e" },
      { primary: "#55708f", deep: "#476280", soft: "#1a2f46", onPrimary: "#ffffff", text: "#96b3d5" },
    ),
    pal(
      "ink",
      () => t("pralino.palette.ink", "Ink"),
      { primary: "#4a4a4a", deep: "#383838", soft: "#f0f0f0", onPrimary: "#ffffff", text: "#4a4a4a" },
      { primary: "#6c6c6c", deep: "#5e5e5e", soft: "#2e2e2e", onPrimary: "#ffffff", text: "#b1b1b1" },
    ),
  ],

  /* Palette value -> the variables that carry it. --pr-* are Pralino's own
     (style/pralino-theme.scss); --bk-act* are the inherited names that
     Vuetify's primary (kalio-tokens.scss) and the pages not yet ported read. */
  /* Palette value -> the variables that carry it. --pr-act* are Pralino's own (the rest of the family:
     pralino-family.ts); --bk-act* are the inherited names that Vuetify's primary (kalio-tokens.scss)
     and the shared Kalio pages read. */
  tokens: {
    "--pr-act": "primary",
    "--pr-act-deep": "deep",
    "--pr-act-on": "onPrimary",
    "--pr-act-text": "text",
    "--pr-act-rgb": "primary:rgb",
    "--bk-act": "primary",
    "--bk-act-deep": "deep",
    "--bk-act-soft": "soft",
    "--bk-act-on": "onPrimary",
    "--bk-act-text": "text",
    "--bk-act-rgb": "primary:rgb",
    "--bk-act-on-rgb": "onPrimary:rgb",
  },

  /* The grounds, lines and words of each mode: pralino-family.ts (and pralino-theme.scss for the first paint). */
  dark: {},
  light: {},

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary", "on-primary": "onPrimary" },
    /* The Tan family's night (pralino-family.ts repaints these for the palette on the page). */
    darkColors: {
      background: "#130e0a",
      surface: "#221a13",
      "surface-bright": "#2e2114",
      "surface-variant": "#3a2a1b",
      "on-background": "#f8f1ea",
      "on-surface": "#f8f1ea",
      "on-surface-variant": "#cfc3b6",
      secondary: "#d6b08b",
      "on-secondary": "#130e0a",
      error: "#f1a497",
      info: "#d6b08b",
      success: "#9fbf8f",
      warning: "#e8c27f",
    },
    lightColors: {
      background: "#ffffff",
      surface: "#ffffff",
      "on-background": "#282017",
      "on-surface": "#282017",
      secondary: "#2b1c0c",
      "on-secondary": "#ffffff",
      error: "#a3322a",
    },
  },

  /* The browser's own bar: the page's ground, not the action colour. */
  metaThemeColor: false,
  /* The row sits on the family-dark footer in both modes (style/pralino-layout.scss). */
  ui: { ink: "var(--pr-dark-ink)", muted: "var(--pr-dark-muted)", line: "var(--pr-dark-line-2)", surface: "var(--pr-dark)", font: "var(--pr-sans)" },
  /* Read when drawn, so they follow the visitor's language (theme.* are the
     shared Kalio words). */
  labels: {
    get theme() {
      return t("theme.title", "Theme");
    },
    get palettes() {
      return t("theme.palettes", "Colour");
    },
    get mode() {
      return t("theme.mode", "Light or dark");
    },
    get modeTitle() {
      return t("theme.modeTitle", "Mode");
    },
    get light() {
      return t("theme.light", "Light");
    },
    get dark() {
      return t("theme.dark", "Dark");
    },
    get custom() {
      return t("theme.custom", "Custom colour");
    },
    get adjusted() {
      return t("theme.adjusted", "Adjusted for readability");
    },
    get brand() {
      return t("theme.brand", "Brand colour");
    },
  },

  /* "Custom colour" (the owner, 9 November 2026): any colour, made readable by paletteFromColor()
     against the lightnesses of Pralino's grounds (above). No band carries the action colour under
     words, so 4.5:1. */
  custom: {
    headerContrast: 4.5,
    lightSurfaces: LIGHT_SURFACES,
    darkSurfaces: DARK_SURFACES,
    darkText: "#111111",
  },
};
