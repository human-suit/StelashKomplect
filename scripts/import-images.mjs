/**
 * Скачивает фото товаров с safe.ru (каталог Промет) в public/images/products/
 * Запуск: node scripts/import-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "data", "catalog.json");
const outDir = path.join(root, "public", "images", "products");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function extractImagePath(html) {
  const patterns = [
    /\/upload\/resize_cache\/iblock\/[^"'\\s]+preview_picture\.jpg/gi,
    /\/upload\/iblock\/[^"'\\s]+detail_picture\.jpg/gi,
    /\/upload\/iblock\/[^"'\\s]+preview_picture\.jpg/gi,
    /\/upload\/resize_cache\/iblock\/[^"'\\s]+additional_photo-0\.jpg/gi,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[0]) return m[0];
  }
  return null;
}

function slugCandidates(product) {
  const list = product.safeRuCandidates ?? [product.safeRuSlug];
  return list.filter(Boolean);
}

async function fetchImageForProduct(product) {
  for (const safeRuSlug of slugCandidates(product)) {
    const url = `https://www.safe.ru/products/${safeRuSlug}/`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) continue;
    const html = await res.text();
    const imgPath = extractImagePath(html);
    if (!imgPath) continue;
    const imgUrl = `https://www.safe.ru${imgPath}`;
    const imgRes = await fetch(imgUrl, { headers: { "User-Agent": UA } });
    if (!imgRes.ok) continue;
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const ext = path.extname(imgPath) || ".jpg";
    const file = path.join(outDir, `${product.slug}${ext}`);
    fs.writeFileSync(file, buf);
    return `/images/products/${product.slug}${ext}`;
  }
  console.warn(`  ⚠ ${product.slug}: no image from safe.ru`);
  return null;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const { products } = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const manifest = {};

  console.log(`Importing ${products.length} products...\n`);

  for (const p of products) {
    if (!p.safeRuSlug) continue;
    const existing = Object.entries(manifest).find(([slug]) => slug === p.slug);
    if (existing) {
      const ext = path.extname(existing[1]);
      const file = path.join(outDir, `${p.slug}${ext}`);
      if (fs.existsSync(file)) {
        console.log(`→ ${p.slug} — already exists, skip`);
        continue;
      }
    }
    process.stdout.write(`→ ${p.name.slice(0, 50)}... `);
    try {
      const imagePath = await fetchImageForProduct(p);
      if (imagePath) {
        manifest[p.slug] = imagePath;
        console.log("OK");
      } else {
        console.log("SKIP");
      }
    } catch (e) {
      console.log(`ERR ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`\nDone. ${Object.keys(manifest).length} images → manifest.json`);
}

main();
