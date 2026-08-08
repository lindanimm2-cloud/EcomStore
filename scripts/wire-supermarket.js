const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "lib", "products.ts");
let t = fs.readFileSync(file, "utf8");

// Remove all supermarket product object lines
t = t.replace(/\n?\s*\{ id: "sm-[^"]+", storeSlug: "supermarket",[\s\S]*?\},?/g, "");

// Clean leftover supermarket section comments
t = t.replace(/\n\s*\/\/[^\n]*[Ss]upermarket[^\n]*/g, "");
t = t.replace(/\n\s*\/\/ (Dairy|Bakery|Fresh Produce|Household|Pantry|Beverages|Meat|Frozen|Snacks|Personal Care)\s*/g, "\n");

if (!t.includes('from "./supermarket-products"')) {
  t = t.replace(
    'import { Product } from "./types";',
    'import { Product } from "./types";\nimport { SUPERMARKET_PRODUCTS } from "./supermarket-products";'
  );
}

if (!t.includes("...SUPERMARKET_PRODUCTS")) {
  t = t.replace(
    "export const PRODUCTS: Product[] = [",
    "export const PRODUCTS: Product[] = [\n  ...SUPERMARKET_PRODUCTS,"
  );
}

// Collapse excessive blank lines
t = t.replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(file, t);
const smInline = (t.match(/storeSlug: "supermarket"/g) || []).length;
console.log("inline supermarket refs:", smInline);
console.log("has spread:", t.includes("...SUPERMARKET_PRODUCTS"));
