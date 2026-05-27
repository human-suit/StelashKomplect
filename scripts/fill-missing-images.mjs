import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "data", "catalog.json"), "utf8"),
);
const outDir = path.join(root, "public", "images", "products");
const manifestPath = path.join(outDir, "manifest.json");
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

const fallbacks = {
  stellazhi: "stellazh-ms-185kd-70x30-4",
  sejfy: "stellazh-ms-185kd-70x30-4",
  shkafy: "shkaf-praktik-ls-21-60",
  lokery: "shkaf-praktik-ls-21-60",
  verstaki: "stellazh-ms-185kd-70x30-4",
};

for (const p of catalog.products) {
  if (manifest[p.slug]) continue;
  const fb = fallbacks[p.categorySlug] ?? fallbacks.stellazhi;
  const fbPath = manifest[fb];
  if (!fbPath) continue;
  const ext = path.extname(fbPath);
  const src = path.join(root, "public", fbPath);
  const dest = path.join(outDir, `${p.slug}${ext}`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    manifest[p.slug] = `/images/products/${p.slug}${ext}`;
    console.log(`Fallback: ${p.slug} ← ${fb}`);
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log("Manifest updated.");
