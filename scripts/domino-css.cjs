// domino-css.cjs: ports the B mockup's stylesheets (domino-design/src/domino.css
// and b.css, set B "Cocoa & Pistachio") into the Layout as style/domino/*.css,
// unchanged in look:
//
//   node scripts/domino-css.cjs [<path to domino-design/src>]
//
// - Every rule is scoped to Domino's own markup: the first compound of each
//   selector gets :is(.dm, .dm *) (a bare element rule gets :where()), so a
//   rule matches only an element that is (inside) an element with class "dm"
//   (every Domino component wraps its markup in one); Selldone's and
//   Vuetify's parts outside .dm are never touched, and a later-loaded reset
//   of the same weight (Vuetify's [type=button]) cannot win over a named rule.
// - Custom properties take the --dm- prefix; the token blocks (:root, the
//   modes) are left out because style/domino-theme.scss holds them.
// - [data-mode="dark"] -> html.dm-dark (the theme switcher's dark class).
// - body -> the .dm root itself; body.has-buybar -> html.dm-buybar (the
//   product page sets it); html.locked is left out (the layers lock the page
//   themselves); html keeps only its scroll padding.
// - The mockup's footer theme band (.ts-*) -> .dts-* (the kit's
//   ThemeSwitcherRow owns .ts-*); keyframes -> dm-*.
// - pages.css (the inner pages, 13 November 2026) comes last, as in the mockup.
// Re-run after the mockup changes; style/domino/ is generated, never edited.
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const sp = require("postcss-selector-parser");

const SRC = process.argv[2] || path.resolve(__dirname, "../../domino-design/src");
const OUT = path.resolve(__dirname, "../style/domino");
const FILES = ["domino", "b", "pages"];
const KEYFRAMES = new Map();

const renameVars = (v) => v.replace(/var\(\s*--(?!dm-)([\w-]+)/g, "var(--dm-$1");

function scopeSelector(sel) {
  sel = sel
    .replace(/body\.has-buybar/g, "html.dm-buybar")
    .replace(/:root\[data-mode=["']?dark["']?\]/g, "html.dm-dark")
    .replace(/\[data-mode=["']?dark["']?\]/g, "html.dm-dark")
    .replace(/\.ts-/g, ".dts-");
  if (/^\s*(:root|html)\s*$/.test(sel)) return sel;
  return sp((root) => {
    root.each((selector) => {
      const nodes = selector.nodes;
      const first = nodes[0];
      let i = 0;
      // html… prefix (html.dm-dark .x): keep it, scope what follows.
      if (first && first.type === "tag" && first.value === "html") {
        while (i < nodes.length && nodes[i].type !== "combinator") i++;
        i++;
        if (i >= nodes.length) return;
      }
      // "body" is the scope root itself.
      if (first && first.type === "tag" && first.value === "body") {
        const scope = sp.pseudo({ value: ":where" });
        scope.append(sp.selector({ nodes: [sp.className({ value: "dm" })] }));
        first.replaceWith(scope);
        return;
      }
      // the end of the compound starting at i (before a pseudo-element)
      let j = i;
      let insertAt = -1;
      while (j < nodes.length && nodes[j].type !== "combinator") {
        if (nodes[j].type === "pseudo" && nodes[j].value.startsWith("::")) {
          insertAt = j;
          break;
        }
        j++;
      }
      if (insertAt < 0) insertAt = j;
      const compound = nodes.slice(i, insertAt);
      const named = compound.some((n) => n.type === "class" || n.type === "attribute" || n.type === "id");
      const where = sp.pseudo({ value: named ? ":is" : ":where" });
      where.append(sp.selector({ nodes: [sp.className({ value: "dm" })] }));
      where.append(sp.selector({ nodes: [sp.className({ value: "dm" }), sp.combinator({ value: " " }), sp.universal()] }));
      if (insertAt < nodes.length) selector.insertBefore(nodes[insertAt], where);
      else selector.append(where);
    });
  }).processSync(sel);
}

const out = [];
for (const name of FILES) {
  const file = path.join(SRC, `${name}.css`);
  const root = postcss.parse(fs.readFileSync(file, "utf8"), { from: file });
  root.walkAtRules("keyframes", (at) => {
    const n = `dm-${at.params.trim()}`;
    KEYFRAMES.set(at.params.trim(), n);
    at.params = n;
  });
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    const sels = rule.selectors || [];
    // The token blocks live in style/domino-theme.scss.
    if (sels.every((s) => /^\s*:root(\[data-mode=["']?(light|dark)["']?\])?\s*$/.test(s))) {
      rule.remove();
      return;
    }
    // The layers lock the page themselves.
    if (sels.some((s) => /^\s*html\.locked\s*$/.test(s))) {
      rule.remove();
      return;
    }
    // html keeps its scroll padding only (no smooth scrolling across the app's route changes).
    if (sels.length === 1 && /^\s*html\s*$/.test(sels[0])) {
      rule.walkDecls((d) => {
        if (d.prop !== "scroll-padding-top") d.remove();
      });
      if (!rule.nodes.length) rule.remove();
      return;
    }
    rule.selectors = sels.map(scopeSelector);
  });
  root.walkAtRules("media", (at) => {
    if (!at.nodes || !at.nodes.length) at.remove();
  });
  root.walkDecls((d) => {
    if (d.prop.startsWith("--") && !d.prop.startsWith("--dm-")) d.prop = "--dm-" + d.prop.slice(2);
    d.value = renameVars(d.value);
    if (/^animation(-name)?$/.test(d.prop)) for (const [a, b] of KEYFRAMES) d.value = d.value.replace(new RegExp(`\\b${a}\\b`, "g"), b);
  });
  const css = root.toString();
  fs.mkdirSync(OUT, { recursive: true });
  const head = `/* GENERATED by scripts/domino-css.cjs from domino-design/src/${name}.css (the B "Cocoa & Pistachio" mockup). Do not edit: change the mockup or style/domino-layout.scss, then re-run. */\n`;
  fs.writeFileSync(path.join(OUT, `${name}.css`), head + css);
  out.push(`${name}.css ${css.length}`);
}
console.log(out.join("\n"));
