const fs = require("fs");
const t = fs.readFileSync("src/lib/products.ts", "utf8");
console.log("emoji ok", t.includes("🌽"));
console.log("pt", (t.match(/storeSlug: "powertrade"/g) || []).length);
console.log("spread", t.includes("...SUPERMARKET_PRODUCTS"));
console.log(t.slice(0, 350));

// clean leftover aisle comments after spread
let cleaned = t.replace(
  /\[\n  \.\.\.SUPERMARKET_PRODUCTS,\n(?:\/\/[^\n]*\n)+/,
  "[\n  ...SUPERMARKET_PRODUCTS,\n\n"
);
fs.writeFileSync("src/lib/products.ts", cleaned);
console.log("cleaned");
