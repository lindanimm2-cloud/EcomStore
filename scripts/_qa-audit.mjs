import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Parse products.ts with regex — avoid TS import issues
const productsSrc = fs.readFileSync(path.join(root, "src/lib/products.ts"), "utf8");
const smProductsSrc = fs.readFileSync(path.join(root, "src/lib/supermarket-products.ts"), "utf8");
const taxSrc = fs.readFileSync(path.join(root, "src/lib/supermarket-taxonomy.ts"), "utf8");
const storefrontSrc = fs.readFileSync(path.join(root, "src/components/storefront-experience.tsx"), "utf8");

function extractProducts(src) {
  const products = [];
  const re =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?storeSlug:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"([\s\S]*?)(?=\n\s*\{|\n\];)/g;
  // simpler line-based
  const objRe =
    /id:\s*"([^"]+)"[\s\S]*?storeSlug:\s*"([^"]+)"[\s\S]*?(?:name:\s*"([^"]+)"[\s\S]*?)?category:\s*"([^"]+)"(?:[\s\S]*?department:\s*"([^"]+)")?/g;
  // better: match each object block
  const blocks = src.match(/\{\s*id:\s*"[^"]+"[\s\S]*?\},?/g) || [];
  for (const b of blocks) {
    const id = b.match(/id:\s*"([^"]+)"/)?.[1];
    const storeSlug = b.match(/storeSlug:\s*"([^"]+)"/)?.[1];
    const name = b.match(/name:\s*"([^"]+)"/)?.[1];
    const category = b.match(/category:\s*"([^"]+)"/)?.[1];
    const department = b.match(/department:\s*"([^"]+)"/)?.[1];
    if (id && storeSlug && category) products.push({ id, storeSlug, name, category, department });
  }
  return products;
}

function toPathSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const smProducts = extractProducts(smProductsSrc);
const otherProducts = extractProducts(productsSrc).filter((p) => p.storeSlug !== "supermarket");
const PRODUCTS = [...smProducts, ...otherProducts];

const taxDepts = [...taxSrc.matchAll(/name:\s*"([^"]+)"[\s\S]*?categories:\s*\[([\s\S]*?)\]/g)];
// simpler taxonomy parse
const deptNames = [...taxSrc.matchAll(/^\s+name:\s*"([^"]+)",$/gm)].map((m) => m[1]);
const catNamesInTax = [...taxSrc.matchAll(/\{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)"/g)].map((m) => m[1]);

const stores = ["supermarket", "powertrade", "buildsave", "foodworks", "grabngo"];

console.log("=== PRODUCT COUNTS ===");
for (const s of stores) {
  const items = PRODUCTS.filter((p) => p.storeSlug === s);
  const cats = [...new Set(items.map((p) => p.category))].sort();
  const depts = [...new Set(items.map((p) => p.department).filter(Boolean))].sort();
  console.log(`\n${s}: ${items.length} products, ${cats.length} categories`);
  console.log("  cats:", cats.join(" | "));
  if (depts.length) console.log("  depts:", depts.join(" | "));
}

// Promo targets from storefront-experience
const promoTargets = {
  supermarket: [
    { type: "dept", name: "Fruit & Vegetables" },
  ],
  powertrade: [
    { type: "cat", name: "Rice & Grains" },
    { type: "cat", name: "Packaging" },
  ],
  buildsave: [{ type: "cat", name: "Paint & Decorating" }],
  foodworks: [
    { type: "cat", name: "Meat & Poultry" },
    { type: "cat", name: "Fruit & Vegetables" },
  ],
  grabngo: [
    { type: "cat", name: "Hot Food" },
    { type: "cat", name: "Hot Drinks" },
  ],
};

console.log("\n=== PROMO BANNER TARGET VALIDATION ===");
for (const [store, targets] of Object.entries(promoTargets)) {
  const items = PRODUCTS.filter((p) => p.storeSlug === store);
  const cats = new Set(items.map((p) => p.category));
  const depts = new Set(items.map((p) => p.department).filter(Boolean));
  for (const t of targets) {
    const ok = t.type === "cat" ? cats.has(t.name) : depts.has(t.name);
    const slug = toPathSlug(t.name);
    const href =
      t.type === "cat"
        ? `/store/${store}/category/${slug}`
        : `/store/${store}/department/${slug}`;
    console.log(
      `${ok ? "OK " : "FAIL"} ${store.padEnd(12)} ${t.type.padEnd(4)} ${t.name.padEnd(22)} → ${href}`
    );
  }
}

// Extract all categoryPath(...) calls from storefront
console.log("\n=== ALL categoryPath CALLS IN STOREFRONT ===");
const cp = [...storefrontSrc.matchAll(/categoryPath\([^,]+,\s*"([^"]+)"\)/g)];
for (const m of cp) console.log(" ", m[1], "→", toPathSlug(m[1]));

// Recipe ingredient name checks
const recipesSrc = fs.readFileSync(path.join(root, "src/app/recipes/page.tsx"), "utf8");
const ingredients = [...recipesSrc.matchAll(/"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((s) =>
    [
      "Fresh Chicken",
      "Baby Potatoes",
      "All Gold",
      "Full English",
      "Cappuccino",
      "Golden Delicious",
      "Bananas",
      "White Bread",
    ].some((k) => s.includes(k.split(" ")[0]) || s.includes(k))
  );
const recipeUses = [...recipesSrc.matchAll(/uses:\s*\[([^\]]+)\]/g)].flatMap((m) =>
  [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
);
console.log("\n=== RECIPE INGREDIENT NAME MATCH ===");
for (const u of recipeUses) {
  const hit = PRODUCTS.find((p) => p.name === u);
  const fuzzy = PRODUCTS.filter((p) => p.name.toLowerCase().includes(u.toLowerCase().slice(0, 12)));
  console.log(
    hit
      ? `OK   ${u} → ${hit.id} (${hit.storeSlug})`
      : `MISS ${u} (fuzzy: ${fuzzy.slice(0, 3).map((p) => p.name).join("; ") || "none"})`
  );
}

// Specials CTA href
console.log("\n=== SPECIALS CTA ===");
const specialsSrc = fs.readFileSync(path.join(root, "src/app/specials/page.tsx"), "utf8");
const shopNow = specialsSrc.match(/href="([^"]+)"[^>]*>[\s\S]*?Shop now/);
console.log("Shop now href:", shopNow?.[1]);
console.log("Note: supermarket home is '/' not '/store/supermarket'");

// Departments button dead outside storefront
console.log("\n=== NAV DEPARTMENTS EVENT ===");
const layoutSrc = fs.readFileSync(path.join(root, "src/components/layout.tsx"), "utf8");
const hasDeptEvent = layoutSrc.includes("aheers:open-departments");
const listeners = [];
for (const f of [
  "src/components/storefront-experience.tsx",
  "src/components/catalogue-page.tsx",
  "src/components/departments-page.tsx",
  "src/app/home-client.tsx",
]) {
  const src = fs.readFileSync(path.join(root, f), "utf8");
  if (src.includes("aheers:open-departments")) listeners.push(f);
}
console.log("Dispatches from layout:", hasDeptEvent);
console.log("Listeners:", listeners.join(", ") || "NONE");

// Mobile shop link uses ?view=all on store home — check if handled
console.log("\n=== SEARCH / VIEW=ALL HANDLING ===");
for (const f of [
  "src/components/storefront-experience.tsx",
  "src/components/store-page-client.tsx",
  "src/app/home-client.tsx",
  "src/components/catalogue-page.tsx",
]) {
  const src = fs.readFileSync(path.join(root, f), "utf8");
  console.log(
    f,
    "view=all:",
    src.includes("view") && (src.includes("view=all") || src.includes('get("view")') || src.includes("searchParams")),
    "| q:",
    src.includes("searchParams") || src.includes("useSearchParams") || src.includes("?q=")
  );
}

// Count specials
const specials = PRODUCTS; // can't easily parse badges from regex for all
console.log("\nTotal products parsed:", PRODUCTS.length);
console.log("SM products:", smProducts.length);
console.log("Other:", otherProducts.length);
