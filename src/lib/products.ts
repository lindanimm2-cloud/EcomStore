import { Product } from "./types";

export const PRODUCTS: Product[] = [
  // Supermarket
  { id: "sm-1", storeSlug: "supermarket", name: "Fresh Milk 2L", category: "Dairy", price: 28.99, unit: "each", image: "🥛", badge: "Special", inStock: 120, description: "Full cream fresh milk, locally sourced." },
  { id: "sm-2", storeSlug: "supermarket", name: "White Bread Loaf", category: "Bakery", price: 14.99, unit: "each", image: "🍞", inStock: 85, description: "Freshly baked daily in-store." },
  { id: "sm-3", storeSlug: "supermarket", name: "Golden Delicious Apples", category: "Fresh Produce", price: 24.99, unit: "/kg", image: "🍎", badge: "Fresh", inStock: 45, description: "Crisp and sweet, perfect for snacking." },
  { id: "sm-4", storeSlug: "supermarket", name: "Sunlight Dishwashing Liquid 750ml", category: "Household", price: 32.99, unit: "each", image: "🧴", inStock: 60, description: "Tough on grease, gentle on hands." },
  { id: "sm-5", storeSlug: "supermarket", name: "Tastic Rice 2kg", category: "Pantry", price: 39.99, unit: "each", image: "🍚", badge: "Best Value", inStock: 200, description: "Premium long grain rice." },
  { id: "sm-6", storeSlug: "supermarket", name: "Clover Classic Cheese 400g", category: "Dairy", price: 54.99, unit: "each", image: "🧀", inStock: 40, description: "Rich and creamy cheddar cheese." },
  { id: "sm-7", storeSlug: "supermarket", name: "Coca-Cola 2L", category: "Beverages", price: 22.99, unit: "each", image: "🥤", inStock: 150, description: "Ice cold refreshment." },
  { id: "sm-8", storeSlug: "supermarket", name: "Baby Potatoes 1.5kg", category: "Fresh Produce", price: 29.99, unit: "bag", image: "🥔", inStock: 35, description: "Washed and ready to cook." },
  { id: "sm-9", storeSlug: "supermarket", name: "Omo Auto Washing Powder 2kg", category: "Household", price: 89.99, unit: "each", image: "📦", badge: "Special", inStock: 55, description: "Stain removal power." },
  { id: "sm-10", storeSlug: "supermarket", name: "Fresh Chicken Whole", category: "Meat", price: 69.99, unit: "each", image: "🍗", inStock: 25, description: "Farm fresh whole chicken." },
  { id: "sm-11", storeSlug: "supermarket", name: "All Gold Tomato Sauce 700ml", category: "Pantry", price: 27.99, unit: "each", image: "🍅", inStock: 90, description: "SA favourite tomato sauce." },
  { id: "sm-12", storeSlug: "supermarket", name: "Bananas", category: "Fresh Produce", price: 19.99, unit: "/kg", image: "🍌", inStock: 70, description: "Ripe and ready to eat." },

  // PowerTrade
  { id: "pt-1", storeSlug: "powertrade", name: "Sunfoil Cooking Oil 5L", category: "Bulk Oils", price: 189.99, bulkPrice: 175.00, minQty: 6, unit: "each", image: "🫒", badge: "Trade Price", inStock: 300, description: "Case of 6 — trade discount applied." },
  { id: "pt-2", storeSlug: "powertrade", name: "Coca-Cola 2L (Case of 6)", category: "Beverages", price: 119.99, bulkPrice: 108.00, minQty: 4, unit: "case", image: "🥤", inStock: 180, description: "Wholesale case pricing." },
  { id: "pt-3", storeSlug: "powertrade", name: "White Star Maize Meal 10kg", category: "Bulk Grains", price: 89.99, bulkPrice: 82.00, minQty: 10, unit: "bag", image: "🌽", badge: "Best Seller", inStock: 500, description: "Staple maize meal for traders." },
  { id: "pt-4", storeSlug: "powertrade", name: "Sunlight Bar Soap (Box of 48)", category: "Household", price: 249.99, bulkPrice: 229.00, minQty: 5, unit: "box", image: "🧼", inStock: 120, description: "Bulk household soap box." },
  { id: "pt-5", storeSlug: "powertrade", name: "Koo Baked Beans 410g (Case of 24)", category: "Canned Goods", price: 399.99, bulkPrice: 365.00, minQty: 3, unit: "case", image: "🥫", inStock: 80, description: "Popular canned goods case." },
  { id: "pt-6", storeSlug: "powertrade", name: "Super Sun Maize Meal 12.5kg", category: "Bulk Grains", price: 109.99, bulkPrice: 99.00, minQty: 8, unit: "bag", image: "🌾", inStock: 400, description: "Large format maize meal." },
  { id: "pt-7", storeSlug: "powertrade", name: "Cremora Coffee Creamer 750g", category: "Beverages", price: 64.99, bulkPrice: 58.00, minQty: 12, unit: "each", image: "☕", inStock: 200, description: "Bulk coffee creamer." },
  { id: "pt-8", storeSlug: "powertrade", name: "All Gold Tomato Sauce 700ml (Case of 12)", category: "Sauces", price: 279.99, bulkPrice: 255.00, minQty: 4, unit: "case", image: "🍅", inStock: 95, description: "Case of 12 bottles." },

  // Grab n Go
  { id: "gg-1", storeSlug: "grabngo", name: "Butter Scone (2 pack)", category: "Bakery", price: 18.99, unit: "pack", image: "🥐", badge: "Customer Favourite", inStock: 40, description: "Soft, buttery, generously sized — a Greytown favourite." },
  { id: "gg-2", storeSlug: "grabngo", name: "Chicken Mayo Sandwich", category: "Sandwiches", price: 35.99, unit: "each", image: "🥪", inStock: 20, description: "Fresh made daily." },
  { id: "gg-3", storeSlug: "grabngo", name: "Beef & Cheese Panini", category: "Hot Meals", price: 49.99, unit: "each", image: "🫓", badge: "Hot", inStock: 15, description: "Grilled to order." },
  { id: "gg-4", storeSlug: "grabngo", name: "Cappuccino Large", category: "Coffee", price: 28.99, unit: "each", image: "☕", inStock: 999, description: "Aromatic barista coffee." },
  { id: "gg-5", storeSlug: "grabngo", name: "Beef Pie", category: "Hot Meals", price: 22.99, unit: "each", image: "🥧", inStock: 30, description: "Golden flaky pastry." },
  { id: "gg-6", storeSlug: "grabngo", name: "Chicken Salad Wrap", category: "Sandwiches", price: 42.99, unit: "each", image: "🌯", inStock: 18, description: "Fresh and healthy option." },
  { id: "gg-7", storeSlug: "grabngo", name: "Chocolate Croissant", category: "Bakery", price: 16.99, unit: "each", image: "🍫", inStock: 25, description: "Freshly baked pastry." },
  { id: "gg-8", storeSlug: "grabngo", name: "Full English Breakfast", category: "Hot Meals", price: 69.99, unit: "each", image: "🍳", badge: "Popular", inStock: 12, description: "Eggs, bacon, sausage, toast." },

  // Build & Save
  { id: "bs-1", storeSlug: "buildsave", name: "Cement 50kg", category: "Building Materials", price: 89.99, bulkPrice: 82.00, minQty: 10, unit: "bag", image: "🧱", badge: "Contractor", inStock: 200, description: "Premium Portland cement." },
  { id: "bs-2", storeSlug: "buildsave", name: "Hammer Drill 800W", category: "Tools", price: 899.99, unit: "each", image: "🔧", inStock: 15, description: "Professional grade hammer drill." },
  { id: "bs-3", storeSlug: "buildsave", name: "Interior Paint 20L White", category: "Paint", price: 649.99, unit: "each", image: "🎨", badge: "Special", inStock: 30, description: "Low VOC, washable finish." },
  { id: "bs-4", storeSlug: "buildsave", name: "Copper Wire 2.5mm (100m)", category: "Electrical", price: 1249.99, unit: "roll", image: "⚡", inStock: 12, description: "SABS approved electrical wire." },
  { id: "bs-5", storeSlug: "buildsave", name: "PVC Pipe 110mm (6m)", category: "Plumbing", price: 189.99, unit: "each", image: "🔩", inStock: 45, description: "Drainage pipe, 6 metre length." },
  { id: "bs-6", storeSlug: "buildsave", name: "Garden Hose 30m", category: "Garden", price: 299.99, unit: "each", image: "🌿", inStock: 25, description: "Reinforced garden hose with fittings." },

  // Foodworks
  { id: "fw-1", storeSlug: "foodworks", name: "Beef Mince Premium 1kg", category: "Meat", price: 89.99, memberPrice: 79.99, unit: "pack", image: "🥩", badge: "Member Price", inStock: 40, description: "Lean beef mince, freshly packed." },
  { id: "fw-2", storeSlug: "foodworks", name: "Pork Chops 1kg", category: "Meat", price: 79.99, unit: "pack", image: "🍖", inStock: 30, description: "Free-range pork chops." },
  { id: "fw-3", storeSlug: "foodworks", name: "Rotisserie Chicken", category: "Ready Meals", price: 69.99, unit: "each", image: "🍗", badge: "Hot", inStock: 20, description: "Whole rotisserie chicken, ready to eat." },
  { id: "fw-4", storeSlug: "foodworks", name: "Fresh Salmon Fillet", category: "Seafood", price: 149.99, unit: "/kg", image: "🐟", inStock: 15, description: "Atlantic salmon fillet." },
  { id: "fw-5", storeSlug: "foodworks", name: "Party Platter Large", category: "Deli", price: 299.99, unit: "each", image: "🧀", badge: "Weekend Special", inStock: 10, description: "Cheese, cold meats, crackers — serves 8-10." },
  { id: "fw-6", storeSlug: "foodworks", name: "Fresh Croissants (6 pack)", category: "Bakery", price: 45.99, unit: "pack", image: "🥐", inStock: 35, description: "Buttery French-style croissants." },
];

export function getProductsByStore(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.storeSlug === slug);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCategories(slug: string): string[] {
  const cats = new Set(getProductsByStore(slug).map((p) => p.category));
  return Array.from(cats);
}
