/*
 * Pralino Cocoa Patisserie — the theme switcher's config (the footer's Theme
 * row: the owner's rules: colour palettes, a custom colour and Light / Dark,
 * a click changes the whole site; the same shared package in every Layout,
 * components/theme-switcher/).
 *
 * Pralino is light first (pralino-design/home-b.html, set B "Cocoa &
 * Pistachio"): a cream ground, cocoa ink and header, a pistachio accent.
 * Dark is the cocoa night version. Both sets of grounds, lines and words
 * are in style/pralino-theme.scss (:root = light, html.pr-dark = dark); this
 * config writes only the palette's action colours (--pr-act*) and Vuetify's
 * theme, and keeps the inherited names (--bk-act*, which Vuetify's
 * --v-theme-primary and the not-yet-ported pages read) on the same colour.
 *
 * The palettes are the mockup's (pralino-design/src/pralino.js PRESETS):
 * Pistachio (the brand, with the mockup's hand-set values), Cherry, Caramel
 * and Blueberry, each built by paletteFromColor() with Pralino's surfaces
 * (the same function the Custom swatch uses), exactly as the mockup's
 * palVars() builds them. "dk" is the palette's light shade for words on the
 * cocoa header and footer (the mockup's --act-dk: the dark mode's text).
 *
 * Contrast (WCAG 2.1, paletteFromColor against the surfaces below): white
 * on each light primary 4.5:1 or more (Pistachio #5a7440 5.30); the dark
 * primaries keep their words (Pistachio's dark #a9c584 carries cocoa words
 * #1a1310, 9.4:1).
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

/** The surfaces every palette is made readable on (the mockup's SURF). */
const LIGHT_SURFACES = ["#f7f1ea", "#efe5d9", "#fffaf4"];
const DARK_SURFACES = ["#1a1310", "#231a15", "#2d221b"];

export const PRALINO_THEME: ThemeSwitcherConfig = {
  /* The merchant's choice: pralino-theme.settings.ts, the one file to edit. */
  settings: THEME_SETTINGS,

  /* The owner (9 November 2026): a merchant who imports the Layout into their
     own shop must not see the switcher. With themeSwitcher "showcase" it
     shows only on these shops (window.shop.id, else <meta name="shop-name">). */
  showcaseShops: [
    { id: 15740, name: "bakio" }, // Bakio: Bakini Noir, Pralino
    { id: 15549, name: "digini-hzgablru" }, // Digini: Digito, Besti, Argon, Senso, Medio
    { id: 15645, name: "molino" }, // Molino: Molino, Tario, Walio, Dino, Valero
  ],

  storageKey: "pralino-theme",
  darkClass: "pr-dark",
  defaultMode: "light",

  palettes: [
    pal(
      "pistachio",
      () => t("pralino.palette.pistachio", "Pistachio"),
      { primary: "#5a7440", deep: "#465b31", soft: "#e5ecd8", onPrimary: "#ffffff", text: "#4d6436" },
      { primary: "#a9c584", deep: "#bdd69c", soft: "#2a3321", onPrimary: "#1a1310", text: "#b7d192" },
    ),
    pal(
      "cherry",
      () => t("pralino.palette.cherry", "Cherry"),
      { primary: "#a43c4c", deep: "#8d2639", soft: "#ffeaeb", onPrimary: "#ffffff", text: "#a43c4c" },
      { primary: "#b54c5a", deep: "#a43c4c", soft: "#4b1d23", onPrimary: "#ffffff", text: "#ff909c" },
    ),
    pal(
      "caramel",
      () => t("pralino.palette.caramel", "Caramel"),
      { primary: "#98571a", deep: "#814400", soft: "#ffecdf", onPrimary: "#ffffff", text: "#98571a" },
      { primary: "#a05f24", deep: "#915010", soft: "#472301", onPrimary: "#ffffff", text: "#e8a169" },
    ),
    pal(
      "blueberry",
      () => t("pralino.palette.blueberry", "Blueberry"),
      { primary: "#4f5f9f", deep: "#3d4b89", soft: "#ebf0ff", onPrimary: "#ffffff", text: "#4f5f9f" },
      { primary: "#5a6aac", deep: "#4c5c9b", soft: "#222b51", onPrimary: "#ffffff", text: "#9aaef5" },
    ),
  ],

  /* Palette value -> the variables that carry it. --pr-* are Pralino's own
     (style/pralino-theme.scss); --bk-act* are the inherited names that
     Vuetify's primary (kalio-tokens.scss) and the pages not yet ported read. */
  tokens: {
    "--pr-act": "primary",
    "--pr-act-deep": "deep",
    "--pr-act-soft": "soft",
    "--pr-act-on": "onPrimary",
    "--pr-act-text": "text",
    "--pr-act-dk": "dark.text",
    "--pr-act-rgb": "primary:rgb",
    "--bk-act": "primary",
    "--bk-act-deep": "deep",
    "--bk-act-soft": "soft",
    "--bk-act-on": "onPrimary",
    "--bk-act-text": "text",
    "--bk-act-rgb": "primary:rgb",
    "--bk-act-on-rgb": "onPrimary:rgb",
  },

  /* The grounds, lines and words of each mode are in pralino-theme.scss
     (:root and html.pr-dark), so nothing is written inline for a mode. */
  dark: {},
  light: {},

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary", "on-primary": "onPrimary" },
    /* The cocoa night: Selldone's fields, menus, dialogs and sheets are dark too. */
    darkColors: {
      background: "#1a1310",
      surface: "#2d221b",
      "surface-bright": "#352920",
      "surface-variant": "#3e3129",
      "on-background": "#f3e9de",
      "on-surface": "#f3e9de",
      "on-surface-variant": "#e4d6c8",
      secondary: "#b7d192",
      "on-secondary": "#1a1310",
      error: "#f2a07f",
      info: "#b7d192",
      success: "#a9c584",
      warning: "#f2c27f",
    },
    lightColors: {
      background: "#f7f1ea",
      surface: "#fffaf4",
      "on-background": "#3a2a22",
      "on-surface": "#3a2a22",
      secondary: "#3a2a22",
      "on-secondary": "#f7f1ea",
      error: "#c4122f",
    },
  },

  /* The browser's own bar: the page's ground, not the action colour. */
  metaThemeColor: false,
  /* The row sits on the cocoa footer in both modes (style/pralino-layout.scss). */
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

  /* "Custom colour" (the owner, 9 November 2026): any colour, made readable
     by paletteFromColor() against Pralino's own surfaces (the mockup's SURF).
     No band carries the action colour under words, so 4.5:1. */
  custom: {
    headerContrast: 4.5,
    lightSurfaces: LIGHT_SURFACES,
    darkSurfaces: DARK_SURFACES,
    darkText: "#1a1310",
  },
};
