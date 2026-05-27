/**
 * Генерирует ~80 стеллажей MS/ES/SBE для catalog-scraped.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** Конфиг: [высота, ширина, глубина, полок, базовая цена, серия] */
const CONFIGS = [
  // MS Standart — с stellazhkomplect.ru
  ["185KD", "70", "30", 4, 3650, "MS Standart"],
  ["185", "100", "30", 4, 3895, "MS Standart"],
  ["150KD", "75", "40", 4, 3960, "MS Standart"],
  ["200", "100", "30", 4, 4235, "MS Standart"],
  ["185", "100", "40", 4, 4480, "MS Standart"],
  ["200KD", "100", "50", 4, 5380, "MS Standart"],
  ["200", "100", "30", 6, 5280, "MS Standart"],
  ["220", "100", "30", 6, 5585, "MS Standart"],
  ["185", "100", "60", 4, 5715, "MS Standart"],
  ["200", "100", "40", 6, 6160, "MS Standart"],
  ["200KD", "100", "60", 4, 6320, "MS Standart"],
  ["220", "100", "40", 6, 6470, "MS Standart"],
  ["200", "100", "60", 6, 8010, "MS Standart"],
  ["220", "100", "60", 6, 8315, "MS Standart"],
  // Дополнительные MS Standart
  ["185KD", "75", "35", 4, 3780, "MS Standart"],
  ["185KD", "70", "40", 4, 3920, "MS Standart"],
  ["185KD", "100", "30", 4, 4100, "MS Standart"],
  ["185KD", "100", "40", 4, 4650, "MS Standart"],
  ["200KD", "70", "30", 4, 3990, "MS Standart"],
  ["200KD", "75", "40", 4, 4520, "MS Standart"],
  ["200KD", "100", "30", 4, 4890, "MS Standart"],
  ["200KD", "100", "40", 4, 5120, "MS Standart"],
  ["200", "70", "30", 4, 3750, "MS Standart"],
  ["200", "75", "40", 4, 4180, "MS Standart"],
  ["200", "100", "40", 4, 4680, "MS Standart"],
  ["200", "100", "50", 4, 5520, "MS Standart"],
  ["200", "100", "50", 6, 6890, "MS Standart"],
  ["220", "100", "30", 4, 4980, "MS Standart"],
  ["220", "100", "40", 4, 5420, "MS Standart"],
  ["220", "100", "50", 4, 5980, "MS Standart"],
  ["220", "100", "50", 6, 7450, "MS Standart"],
  ["255", "100", "40", 4, 5890, "MS Standart"],
  ["255", "100", "60", 4, 7120, "MS Standart"],
  ["150KD", "70", "30", 4, 3290, "MS Standart"],
  ["150KD", "100", "30", 4, 3650, "MS Standart"],
  ["185", "70", "30", 4, 3520, "MS Standart"],
  ["185", "75", "40", 4, 4050, "MS Standart"],
  ["185", "100", "50", 4, 5120, "MS Standart"],
  ["185", "100", "30", 6, 4850, "MS Standart"],
  ["200KD", "100", "30", 6, 5450, "MS Standart"],
  ["200KD", "100", "40", 6, 5980, "MS Standart"],
  ["200KD", "100", "50", 6, 6520, "MS Standart"],
  ["200KD", "100", "60", 6, 7890, "MS Standart"],
  // MS Strong
  ["200", "100", "50", 4, 6890, "MS Strong"],
  ["200", "100", "60", 4, 7450, "MS Strong"],
  ["220", "100", "60", 4, 8120, "MS Strong"],
  ["220", "100", "60", 6, 9450, "MS Strong"],
  ["200", "100", "50", 6, 8200, "MS Strong"],
  ["255", "100", "60", 6, 10200, "MS Strong"],
  // MS Hard
  ["200", "100", "60", 4, 8950, "MS Hard"],
  ["220", "100", "60", 4, 9580, "MS Hard"],
  ["200", "100", "60", 6, 10850, "MS Hard"],
  // ES лёгкие
  ["150KD", "75", "30", 3, 2890, "ES"],
  ["150KD", "75", "30", 4, 3190, "ES"],
  ["185KD", "75", "30", 4, 3450, "ES"],
  ["75KD", "75", "30", 3, 2490, "ES"],
  ["200", "100", "30", 4, 3890, "ES"],
  // SBE
  ["180KD", "75", "35", 5, 2800, "SBE"],
  ["180KD", "90", "40", 5, 3200, "SBE"],
  ["180KD", "90", "45", 5, 3450, "SBE"],
  ["180KD", "120", "40", 5, 3600, "SBE"],
  ["180KD", "120", "45", 5, 3900, "SBE"],
  // MS Pro
  ["200", "100", "60", 5, 9850, "MS Pro"],
  ["220", "100", "60", 5, 10500, "MS Pro"],
  // Чёрные
  ["185KD", "70", "30", 4, 3850, "MS Standart", "black"],
  ["200", "100", "40", 5, 4780, "MS Standart", "black"],
];

function configToSlug(h, w, d, shelves, series, variant) {
  const base = `${h.toLowerCase()}-${w}x${d}-${shelves}`;
  if (series === "ES") return `stellazh-es-${base}`;
  if (series === "SBE") return `stellazh-sbe-${base}`;
  if (series === "MS Strong") return `stellazh-ms-strong-${base}`;
  if (series === "MS Hard") return `stellazh-ms-hard-${base}`;
  if (series === "MS Pro") return `stellazh-ms-pro-${base}`;
  if (variant === "black") return `stellazh-ms-${base}-black`;
  return `stellazh-ms-${base}`;
}

function configToSafeRuCandidates(h, w, d, shelves, series) {
  const cfg = `${h.toLowerCase()}-${w}x${d}-${shelves}`.replace(/\//g, "-");
  const standart = [
    `stellazh-metallicheskiy-ms-standart-${cfg}`,
    `stellazh-ms-standart-${cfg}`,
    `stellazh-ms-${cfg}`,
  ];
  if (series === "ES")
    return [`stellazh-es-${cfg}`, `stellazh-metallicheskiy-es-${cfg}`, ...standart];
  if (series === "SBE")
    return [
      `stellazh-sbe-${cfg}-otsink`,
      `stellazh-sbe-${h.toLowerCase()}kd-${w}kh${d}-${shelves}`,
      ...standart,
    ];
  return standart;
}

function configToName(h, w, d, shelves, series) {
  const ser = series === "MS Standart" ? "MS Standart" : series;
  return `Стеллаж ${ser} ${h}/${w}x${d}/${shelves}`;
}

const products = CONFIGS.map((row, i) => {
  const [h, w, d, shelves, price, series, variant] = row;
  const slug = configToSlug(h, w, d, shelves, series, variant);
  return {
    id: `gen-${i + 1}`,
    slug,
    safeRuCandidates: configToSafeRuCandidates(h, w, d, shelves, series),
    safeRuSlug: configToSafeRuCandidates(h, w, d, shelves, series)[0],
    name: configToName(h, w, d, shelves, series),
    categorySlug: "stellazhi",
    price,
    inStock: 50,
    specs: {
      Размеры: `${h}/${w}×${d} мм`,
      Полок: String(shelves),
      Серия: series,
      Гарантия: "2 года",
    },
    isFeatured: i < 6,
  };
});

const out = path.join(root, "data", "catalog-scraped.json");
fs.writeFileSync(out, JSON.stringify({ products }, null, 2));
console.log(`Generated ${products.length} shelving products`);
