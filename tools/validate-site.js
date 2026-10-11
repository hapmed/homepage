"use strict";

const fs = require("fs");
const path = require("path");

const site = process.argv[2] || "site";
const pages = ["index.html", "404.html"];
let errors = 0;
const ok = (m) => console.log("  OK   " + m);
const bad = (m) => { console.log("  FAIL " + m); errors++; };

for (const page of pages) {
  const full = path.join(site, page);
  if (!fs.existsSync(full)) { bad(page + " no existe"); continue; }
  const html = fs.readFileSync(full, "utf8");
  console.log("\n== " + page + " ==");

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  const broken = anchors.filter((a) => a && !ids.has(a));
  if (broken.length) bad("anclas rotas: " + [...new Set(broken)].join(", "));
  else ok("anclas internas (" + anchors.length + ") resuelven");

  const srcs = [...html.matchAll(/(?:href|src)="([^"#:][^":]*\.(?:css|js|svg|ico|png|jpg|jpeg|webp|xml|txt))"/g)].map((m) => m[1]);
  const missing = srcs.filter((s) => (s.startsWith("/") ? !fs.existsSync(path.join(site, s.slice(1))) : !fs.existsSync(path.join(site, s))));
  if (missing.length) bad("recursos faltantes: " + [...new Set(missing)].join(", "));
  else ok("recursos locales existen (" + new Set(srcs).size + ")");

  for (const j of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(j[1]); ok("JSON-LD válido"); } catch (e) { bad("JSON-LD inválido: " + e.message); }
  }

  if (!/<html lang="es">/.test(html)) bad("falta lang=es"); else ok("lang=es presente");
  if (page === "index.html") { if (!/<h1[ >]/.test(html)) bad("falta h1"); else ok("h1 presente"); }
}

console.log("\nRESULTADO: " + (errors === 0 ? "SIN ERRORES" : errors + " error(es)"));
process.exit(errors === 0 ? 0 : 1);
