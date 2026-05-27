/**
 * Объединяет catalog.json + catalog-scraped.json (без дублей по slug)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const base = JSON.parse(
  fs.readFileSync(path.join(root, "data", "catalog.json"), "utf8"),
);
const scrapedPath = path.join(root, "data", "catalog-scraped.json");
const scraped = fs.existsSync(scrapedPath)
  ? JSON.parse(fs.readFileSync(scrapedPath, "utf8"))
  : { products: [] };

const bySlug = new Map();
for (const p of base.products) bySlug.set(p.slug, p);
for (const p of scraped.products) {
  if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
}

const products = [...bySlug.values()].map((p, i) => ({
  ...p,
  id: String(i + 1),
}));

fs.writeFileSync(
  path.join(root, "data", "catalog.json"),
  JSON.stringify({ products }, null, 2),
);
console.log(`Merged catalog: ${products.length} products (${scraped.products.length} scraped)`);
