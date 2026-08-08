const fs = require("fs");
const t = fs.readFileSync("src/lib/supermarket-products.ts", "utf8");
const depts = [...new Set([...t.matchAll(/department: "([^"]+)"/g)].map((m) => m[1]))];
console.log("departments", depts.length);
console.log(depts.join("\n"));
console.log("products", (t.match(/id: "sm-/g) || []).length);
