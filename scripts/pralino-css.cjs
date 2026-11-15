// pralino-css.cjs: ports the A "Classic" mockup's stylesheets (pralino-design/src/base.css, pages.css and
// pralino.css) into the Layout as style/pralino/*.css, unchanged in look:
//
//   node scripts/pralino-css.cjs [<path to pralino-design/src>]
//
// - Every rule is scoped to Pralino's own markup: the first compound of each selector gets
//   :is(.pr, .pr *) (a bare element rule gets :where()), so a rule matches only an element that is
//   (inside) an element with class "pr" (every Pralino component wraps its markup in one); Selldone's
//   and Vuetify's parts outside .pr are never touched, and a later-loaded reset of the same weight
//   (Vuetify's [type=button]) cannot win over a named rule.
// - Custom properties take the --pr- prefix; the token blocks (:root, the modes) are left out because
//   style/pralino-theme.scss (type, shape) and components/pralino/pralino-family.ts (every colour) hold them.
// - [data-mode="dark"] -> html.pr-dark (the theme switcher's dark class).
// - body -> the .pr root itself; body.has-buybar -> html.pr-buybar (the product page sets it);
//   html.locked is left out (the layers lock the page themselves); html keeps only its scroll padding.
// - The mockup's footer theme band (.ts-*) -> .dts-* (the kit's ThemeSwitcherRow owns .ts-*);
//   keyframes -> pr-*.
// Re-run after the mockup changes; style/pralino/ is generated, never edited.
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const sp = require("postcss-selector-parser");

const SRC = process.argv[2] || path.resolve(__dirname, "../../pralino-design/src");
const OUT = path.resolve(__dirname, "../style/pralino");
const FILES = ["base", "pages", "pralino"];
const KEYFRAMES = new Map();

const renameVars = (v) => v.replace(/var\(\s*--(?!pr-)([\w-]+)/g, "var(--pr-$1");

function scopeSelector(sel) {
  sel = sel
    .replace(/body\.has-buybar/g, "html.pr-buybar")
    .replace(/:root\[data-mode=["']?dark["']?\]/g, "html.pr-dark")
    .replace(/\[data-mode=["']?dark["']?\]/g, "html.pr-dark")
    .replace(/\.ts-/g, ".dts-");
  if (/^\s*(:root|html)\s*$/.test(sel)) return sel;
  return sp((root) => {
    root.each((selector) => {
      const nodes = selector.nodes;
      const first = nodes[0];
      let i = 0;
      // html… prefix (html.pr-dark .x): keep it, scope what follows.
      if (first && first.type === "tag" && first.value === "html") {
        while (i < nodes.length && nodes[i].type !== "combinator") i++;
        i++;
        if (i >= nodes.length) return;
      }
      // "body" is the scope root itself.
      if (first && first.type === "tag" && first.value === "body") {
        const scope = sp.pseudo({ value: ":where" });
        scope.append(sp.selector({ nodes: [sp.className({ value: "pr" })] }));
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
      where.append(sp.selector({ nodes: [sp.className({ value: "pr" })] }));
      where.append(sp.selector({ nodes: [sp.className({ value: "pr" }), sp.combinator({ value: " " }), sp.universal()] }));
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
    const n = `pr-${at.params.trim()}`;
    KEYFRAMES.set(at.params.trim(), n);
    at.params = n;
  });
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    const sels = rule.selectors || [];
    // The token blocks live in style/pralino-theme.scss.
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
    if (d.prop.startsWith("--") && !d.prop.startsWith("--pr-")) d.prop = "--pr-" + d.prop.slice(2);
    d.value = renameVars(d.value);
    if (/^animation(-name)?$/.test(d.prop)) for (const [a, b] of KEYFRAMES) d.value = d.value.replace(new RegExp(`\\b${a}\\b`, "g"), b);
  });
  const css = root.toString();
  fs.mkdirSync(OUT, { recursive: true });
  const head = `/* GENERATED by scripts/pralino-css.cjs from pralino-design/src/${name}.css (the A "Classic" mockup). Do not edit: change the mockup or style/pralino-layout.scss, then re-run. */
`;
  fs.writeFileSync(path.join(OUT, `${name}.css`), head + css);
  out.push(`${name}.css ${css.length}`);
}
console.log(out.join("\n"));
