/**
 * Собирает товары стеллажей с safe.ru → data/catalog-scraped.json
 * node scripts/scrape-safe-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

const CATEGORY_PAGES = [
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/ms-standart-500-kg-na-sektsiyu/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/ms-strong-750-kg-na-sektsiyu/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/ms-hard-1000-kg-na-sektsiyu/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/ms-pro-1500-kg-na-sektsiyu/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/stellazh-srednegruzovoy-sb-500-kg/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/stellazh-legkiy-es-200-kg/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/stellazh-srednegruzovoy-sbe/",
  "https://www.safe.ru/catalog/metallicheskie-stellazhi/",
];

function slugFromSafeRu(safeRuSlug) {
  return safeRuSlug
    .replace(/^stellazh-(metallicheskiy-)?/, "stellazh-")
    .replace(/standart-/, "ms-")
    .replace(/ms-standart-/, "ms-")
    .replace(/ms-ms-/, "ms-")
    .replace(/-black$/, "");
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  return res.text();
}

function extractProductSlugs(html) {
  const re = /href="(?:https:\/\/www\.safe\.ru)?\/products\/([a-z0-9-]+)\/?"/gi;
  const slugs = new Set();
  let m;
  while ((m = re.exec(html)) !== null) {
    const s = m[1];
    if (s.includes("stellazh") || s.includes("stoyka-ms")) slugs.add(s);
  }
  return [...slugs];
}

function parseProductPage(html, safeRuSlug) {
  const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const priceMatch = html.match(/(\d[\d\s]*)\s*руб/i);
  const name = nameMatch?.[1]?.trim() ?? safeRuSlug;

  let price = 0;
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/\s/g, ""), 10) || 0;
  }

  const specs = {};
  const dimMatch = html.match(
    /Размеры внешние[^<]*<\/td>\s*<td[^>]*>([^<]+)/i,
  );
  if (dimMatch) specs["Размеры"] = dimMatch[1].trim().replace(/x/gi, "×");

  const shelfMatch = html.match(/Количество полок[^<]*<\/td>\s*<td[^>]*>(\d+)/i);
  if (shelfMatch) specs["Полок"] = shelfMatch[1];

  const weightMatch = html.match(/Вес[^<]*<\/td>\s*<td[^>]*>([\d.,]+)/i);
  if (weightMatch) specs["Вес"] = `${weightMatch[1]} кг`;

  specs["Гарантия"] = "2 года";
  specs["Серия"] = name.includes("Strong")
    ? "MS Strong"
    : name.includes("Hard")
      ? "MS Hard"
      : name.includes("Pro")
        ? "MS Pro"
        : name.includes("SBE")
          ? "SBE"
          : name.includes(" ES")
            ? "ES"
            : "MS Standart";

  return { name, price, specs };
}

async function main() {
  const allSlugs = new Set();

  for (const url of CATEGORY_PAGES) {
    process.stdout.write(`Category: ${url.slice(-40)}... `);
    const html = await fetchHtml(url);
    if (!html) {
      console.log("FAIL");
      continue;
    }
    const slugs = extractProductSlugs(html);
    slugs.forEach((s) => allSlugs.add(s));
    console.log(`${slugs.length} links`);
    await new Promise((r) => setTimeout(r, 400));
  }

  // pagination pages
  for (let p = 2; p <= 8; p++) {
    const url = `https://www.safe.ru/catalog/metallicheskie-stellazhi/?PAGEN_1=${p}`;
    const html = await fetchHtml(url);
    if (!html) break;
    const slugs = extractProductSlugs(html);
    if (slugs.length === 0) break;
    slugs.forEach((s) => allSlugs.add(s));
    console.log(`Page ${p}: +${slugs.length}`);
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nUnique product slugs: ${allSlugs.size}\n`);

  const products = [];
  let id = 100;
  const slugsArr = [...allSlugs].slice(0, 120);

  for (const safeRuSlug of slugsArr) {
    const url = `https://www.safe.ru/products/${safeRuSlug}/`;
    process.stdout.write(`  ${safeRuSlug.slice(0, 45)}... `);
    const html = await fetchHtml(url);
    if (!html) {
      console.log("skip");
      continue;
    }
    const { name, price, specs } = parseProductPage(html, safeRuSlug);
    const slug = slugFromSafeRu(safeRuSlug);
    products.push({
      id: String(id++),
      slug,
      safeRuSlug,
      name,
      categorySlug: "stellazhi",
      price: price > 0 ? Math.round(price * 0.88) : 5000,
      inStock: 50,
      specs,
    });
    console.log("OK");
    await new Promise((r) => setTimeout(r, 250));
  }

  const out = path.join(root, "data", "catalog-scraped.json");
  fs.writeFileSync(out, JSON.stringify({ products }, null, 2));
  console.log(`\nSaved ${products.length} → ${out}`);
}

main();
