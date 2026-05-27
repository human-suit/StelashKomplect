/**
 * Объединяет catalog.json + manifest.json → src/data/products.generated.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "data", "catalog.json"), "utf8"),
);
const manifestPath = path.join(
  root,
  "public",
  "images",
  "products",
  "manifest.json",
);
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

const products = catalog.products.map(
  ({ safeRuSlug: _, ...p }) => ({
    ...p,
    image: manifest[p.slug] ?? `/images/products/${p.slug}.jpg`,
  }),
);

const out = path.join(root, "src", "data", "products.generated.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ products }, null, 2));
console.log(`Wrote ${products.length} products → ${out}`);
