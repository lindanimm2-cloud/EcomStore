import { Product } from "./types";
import { SUPERMARKET_PRODUCTS } from "./supermarket-products";
import { SUPERMARKET_DEPARTMENTS } from "./supermarket-taxonomy";

export const PRODUCTS: Product[] = [
  ...SUPERMARKET_PRODUCTS,


  // ─── Bulk PowerTrade (wholesale / hybrid catalogue) ─────────────────────────
  // Rice & Grains
  { id: "pt-3", storeSlug: "powertrade", name: "White Star Maize Meal 10kg", category: "Rice & Grains", price: 89.99, bulkPrice: 82.00, minQty: 10, unit: "bag", image: "🌽", badge: "Best Seller", inStock: 500, description: "Staple maize meal for traders and stokvels." },
  { id: "pt-6", storeSlug: "powertrade", name: "Super Sun Maize Meal 12.5kg", category: "Rice & Grains", price: 109.99, bulkPrice: 99.00, minQty: 8, unit: "bag", image: "🌾", inStock: 400, description: "Large-format maize meal." },
  { id: "pt-22", storeSlug: "powertrade", name: "Iwisa Super Maize Meal 25kg", category: "Rice & Grains", price: 219.99, bulkPrice: 199.00, minQty: 5, unit: "bag", image: "🌽", badge: "Trade Price", inStock: 320, description: "Extra-large trader bag." },
  { id: "pt-12", storeSlug: "powertrade", name: "Spekko Rice 5kg", category: "Rice & Grains", price: 79.99, bulkPrice: 72.00, minQty: 8, unit: "bag", image: "🍚", inStock: 180, description: "Parboiled rice for resale." },
  { id: "pt-11", storeSlug: "powertrade", name: "Tastic Rice 10kg", category: "Rice & Grains", price: 149.99, bulkPrice: 138.00, minQty: 5, unit: "bag", image: "🍚", badge: "Trade Price", inStock: 250, description: "Wholesale long-grain rice." },
  { id: "pt-31", storeSlug: "powertrade", name: "Tastic Rice 25kg", category: "Rice & Grains", price: 349.99, bulkPrice: 325.00, minQty: 3, unit: "bag", image: "🍚", badge: "Trade Price", inStock: 140, description: "Bulk rice for spaza & tuckshops." },
  { id: "pt-32", storeSlug: "powertrade", name: "Samp 10kg", category: "Rice & Grains", price: 94.99, bulkPrice: 86.00, minQty: 6, unit: "bag", image: "🫘", inStock: 160, description: "Dried samp, wholesale bag." },

  // Flour & Baking
  { id: "pt-33", storeSlug: "powertrade", name: "Snowflake Cake Flour 10kg", category: "Flour & Baking", price: 119.99, bulkPrice: 109.00, minQty: 5, unit: "bag", image: "🌾", badge: "Trade Price", inStock: 200, description: "Bulk cake flour — bakery & trader staple." },
  { id: "pt-34", storeSlug: "powertrade", name: "Snowflake Cake Flour 25kg", category: "Flour & Baking", price: 259.99, bulkPrice: 239.00, minQty: 3, unit: "bag", image: "🌾", inStock: 120, description: "Catering flour bag." },
  { id: "pt-35", storeSlug: "powertrade", name: "Bread Flour 12.5kg", category: "Flour & Baking", price: 129.99, bulkPrice: 118.00, minQty: 4, unit: "bag", image: "🍞", inStock: 110, description: "Strong bread flour for bakers." },

  // Sugar
  { id: "pt-36", storeSlug: "powertrade", name: "Selati White Sugar 10kg", category: "Sugar", price: 189.99, bulkPrice: 175.00, minQty: 5, unit: "bag", image: "🍬", badge: "Trade Price", inStock: 280, description: "Wholesale white sugar bag." },
  { id: "pt-37", storeSlug: "powertrade", name: "Selati White Sugar 25kg", category: "Sugar", price: 429.99, bulkPrice: 399.00, minQty: 2, unit: "bag", image: "🍬", badge: "Best Seller", inStock: 150, description: "Industrial sugar bag for traders." },
  { id: "pt-38", storeSlug: "powertrade", name: "Brown Sugar 5kg", category: "Sugar", price: 99.99, bulkPrice: 92.00, minQty: 6, unit: "bag", image: "🟤", inStock: 90, description: "Bulk brown sugar." },

  // Cooking Oils
  { id: "pt-1", storeSlug: "powertrade", name: "Sunfoil Cooking Oil 5L", category: "Cooking Oils", price: 189.99, bulkPrice: 175.00, minQty: 6, unit: "each", image: "🫒", badge: "Trade Price", inStock: 300, description: "Case of 6 — trade discount applied." },
  { id: "pt-9", storeSlug: "powertrade", name: "B-Well Canola Oil 5L", category: "Cooking Oils", price: 199.99, bulkPrice: 185.00, minQty: 6, unit: "each", image: "🫙", badge: "Trade Price", inStock: 220, description: "Heart-healthy canola, trade pack." },
  { id: "pt-10", storeSlug: "powertrade", name: "Cooking Oil 20L Drum", category: "Cooking Oils", price: 549.99, bulkPrice: 510.00, minQty: 2, unit: "drum", image: "🛢️", inStock: 80, description: "Catering drum for foodservice." },
  { id: "pt-39", storeSlug: "powertrade", name: "Vinegar White 5L", category: "Cooking Oils", price: 69.99, bulkPrice: 62.00, minQty: 6, unit: "each", image: "🧴", inStock: 130, description: "Bulk white vinegar jerry." },
  { id: "pt-40", storeSlug: "powertrade", name: "Rajah Curry Powder 1kg", category: "Cooking Oils", price: 89.99, bulkPrice: 82.00, minQty: 8, unit: "each", image: "🌶️", inStock: 100, description: "Catering spice tub." },

  // Pasta & Noodles
  { id: "pt-41", storeSlug: "powertrade", name: "Spaghetti 5kg", category: "Pasta & Noodles", price: 109.99, bulkPrice: 99.00, minQty: 4, unit: "bag", image: "🍝", badge: "Trade Price", inStock: 140, description: "Bulk pasta bag." },
  { id: "pt-42", storeSlug: "powertrade", name: "Macaroni 10kg", category: "Pasta & Noodles", price: 189.99, bulkPrice: 175.00, minQty: 3, unit: "bag", image: "🍝", inStock: 95, description: "Wholesale macaroni." },
  { id: "pt-43", storeSlug: "powertrade", name: "2-Minute Noodles (Case of 48)", category: "Pasta & Noodles", price: 249.99, bulkPrice: 229.00, minQty: 3, unit: "case", image: "🍜", badge: "Popular", inStock: 160, description: "Assorted flavour noodle case." },

  // Canned Foods
  { id: "pt-5", storeSlug: "powertrade", name: "Koo Baked Beans 410g (Case of 24)", category: "Canned Foods", price: 399.99, bulkPrice: 365.00, minQty: 3, unit: "case", image: "🥫", inStock: 80, description: "Popular canned goods case." },
  { id: "pt-15", storeSlug: "powertrade", name: "Lucky Star Pilchards 400g (Case of 24)", category: "Canned Foods", price: 529.99, bulkPrice: 485.00, minQty: 2, unit: "case", image: "🐟", badge: "Best Seller", inStock: 70, description: "Tomato sauce pilchards case." },
  { id: "pt-16", storeSlug: "powertrade", name: "All Gold Chakalaka 410g (Case of 12)", category: "Canned Foods", price: 219.99, bulkPrice: 199.00, minQty: 4, unit: "case", image: "🥫", inStock: 65, description: "Mild chakalaka relish cases." },
  { id: "pt-8", storeSlug: "powertrade", name: "All Gold Tomato Sauce 700ml (Case of 12)", category: "Canned Foods", price: 279.99, bulkPrice: 255.00, minQty: 4, unit: "case", image: "🍅", inStock: 95, description: "Case of 12 bottles." },
  { id: "pt-19", storeSlug: "powertrade", name: "Nando's Peri-Peri Sauce 250ml (Case of 12)", category: "Canned Foods", price: 349.99, bulkPrice: 320.00, minQty: 3, unit: "case", image: "🌶️", badge: "Popular", inStock: 75, description: "Mild peri-peri sauce cases." },
  { id: "pt-44", storeSlug: "powertrade", name: "Sweetcorn 410g (Case of 24)", category: "Canned Foods", price: 349.99, bulkPrice: 319.00, minQty: 3, unit: "case", image: "🌽", inStock: 60, description: "Wholesale sweetcorn cases." },
{ id: "pt-28", storeSlug: "powertrade", name: "Simba Chips Assorted 120g (Case of 24)", category: "Snacks", price: 399.99, bulkPrice: 365.00, minQty: 3, unit: "case", image: "🥔", badge: "Popular", inStock: 90, description: "Mixed flavour chip cases." },
  { id: "pt-27", storeSlug: "powertrade", name: "Safari Mixed Nuts 400g (Case of 12)", category: "Snacks", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "case", image: "🥜", badge: "New", inStock: 55, description: "Salted mixed nuts for resale." },
  { id: "pt-45", storeSlug: "powertrade", name: "Willards Flings (Case of 48)", category: "Snacks", price: 429.99, bulkPrice: 395.00, minQty: 2, unit: "case", image: "🌽", inStock: 70, description: "Cheese curls wholesale case." },

  // Biscuits
  { id: "pt-46", storeSlug: "powertrade", name: "Bakers Tennis Biscuits (Case of 24)", category: "Biscuits", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "case", image: "🍪", badge: "Trade Price", inStock: 80, description: "Wholesale coconut biscuits." },
  { id: "pt-47", storeSlug: "powertrade", name: "Marie Biscuits (Carton of 24)", category: "Biscuits", price: 289.99, bulkPrice: 265.00, minQty: 3, unit: "carton", image: "🍪", inStock: 95, description: "Plain marie cartons for traders." },

  // Sweets & Confectionery
  { id: "pt-48", storeSlug: "powertrade", name: "Beacon Assorted Sweets 5kg", category: "Sweets & Confectionery", price: 299.99, bulkPrice: 275.00, minQty: 3, unit: "bag", image: "🍬", badge: "Trade Price", inStock: 60, description: "Bulk sweets bag for spaza." },
  { id: "pt-49", storeSlug: "powertrade", name: "Cadbury Dairy Milk (Case of 24)", category: "Sweets & Confectionery", price: 399.99, bulkPrice: 365.00, minQty: 3, unit: "case", image: "🍫", inStock: 85, description: "Chocolate slab case." },
  { id: "pt-50", storeSlug: "powertrade", name: "Fizzers Assorted (Case of 48)", category: "Sweets & Confectionery", price: 249.99, bulkPrice: 229.00, minQty: 4, unit: "case", image: "🍭", badge: "Popular", inStock: 100, description: "Classic SA sweets case." },

  // Drinks
  { id: "pt-2", storeSlug: "powertrade", name: "Coca-Cola 2L (Case of 6)", category: "Drinks", price: 119.99, bulkPrice: 108.00, minQty: 4, unit: "case", image: "🥤", badge: "Best Seller", inStock: 180, description: "Wholesale 6 × 2L case." },
  { id: "pt-13", storeSlug: "powertrade", name: "Jive Soft Drink 2L (Case of 6)", category: "Drinks", price: 89.99, bulkPrice: 82.00, minQty: 5, unit: "case", image: "🧃", badge: "Best Value", inStock: 160, description: "Assorted flavoured soft drink cases." },
  { id: "pt-51", storeSlug: "powertrade", name: "Assorted Soft Drinks 6 × 2L", category: "Drinks", price: 109.99, bulkPrice: 99.00, minQty: 5, unit: "case", image: "🥤", badge: "Special", inStock: 200, description: "Bulk assorted 2L drinks case." },
  { id: "pt-52", storeSlug: "powertrade", name: "Still Water 500ml (Case of 24)", category: "Drinks", price: 129.99, bulkPrice: 118.00, minQty: 4, unit: "case", image: "💧", inStock: 220, description: "Wholesale bottled water." },
  { id: "pt-53", storeSlug: "powertrade", name: "Fruit Juice 1.5L (Case of 12)", category: "Drinks", price: 279.99, bulkPrice: 255.00, minQty: 3, unit: "case", image: "🍊", inStock: 90, description: "Assorted juice cases." },

  // Tea & Coffee
  { id: "pt-26", storeSlug: "powertrade", name: "Five Roses Tea 100s (Case of 12)", category: "Tea & Coffee", price: 389.99, bulkPrice: 355.00, minQty: 3, unit: "case", image: "🍵", inStock: 85, description: "Tagless tea bags bulk." },
  { id: "pt-14", storeSlug: "powertrade", name: "Nestlé Ricoffy 750g (Case of 6)", category: "Tea & Coffee", price: 449.99, bulkPrice: 415.00, minQty: 3, unit: "case", image: "☕", badge: "Trade Price", inStock: 90, description: "Instant coffee blend, wholesale." },
  { id: "pt-7", storeSlug: "powertrade", name: "Cremora Coffee Creamer 1kg", category: "Tea & Coffee", price: 79.99, bulkPrice: 72.00, minQty: 10, unit: "each", image: "☕", inStock: 200, description: "Bulk coffee creamer." },
  { id: "pt-25", storeSlug: "powertrade", name: "Nestlé Milo 400g (Case of 12)", category: "Tea & Coffee", price: 529.99, bulkPrice: 485.00, minQty: 2, unit: "case", image: "🍫", badge: "Hot", inStock: 70, description: "Chocolate malt drink, wholesale." },
  { id: "pt-54", storeSlug: "powertrade", name: "Rooibos Tea 200s (Case of 6)", category: "Tea & Coffee", price: 349.99, bulkPrice: 319.00, minQty: 3, unit: "case", image: "🍵", inStock: 75, description: "Bulk rooibos catering packs." },

  // Cleaning
  { id: "pt-20", storeSlug: "powertrade", name: "Handy Andy Cleaner 750ml (Case of 12)", category: "Cleaning", price: 259.99, bulkPrice: 238.00, minQty: 4, unit: "case", image: "✨", badge: "Trade Price", inStock: 110, description: "Multi-surface cleaner bulk." },
  { id: "pt-21", storeSlug: "powertrade", name: "Jik Bleach 5L", category: "Cleaning", price: 89.99, bulkPrice: 82.00, minQty: 6, unit: "each", image: "🧪", inStock: 100, description: "Bulk bleach jerry can." },
  { id: "pt-30", storeSlug: "powertrade", name: "Omo Auto 2kg (Case of 6)", category: "Cleaning", price: 489.99, bulkPrice: 449.00, minQty: 3, unit: "case", image: "📦", badge: "Special", inStock: 60, description: "Washing powder wholesale cases." },
  { id: "pt-29", storeSlug: "powertrade", name: "Doom Insect Killer 300ml (Case of 12)", category: "Cleaning", price: 279.99, bulkPrice: 255.00, minQty: 4, unit: "case", image: "🦟", badge: "Trade Price", inStock: 75, description: "Household insect spray bulk." },
  { id: "pt-55", storeSlug: "powertrade", name: "Sunlight Dishwashing Liquid 5L", category: "Cleaning", price: 149.99, bulkPrice: 135.00, minQty: 4, unit: "each", image: "🧴", inStock: 120, description: "Catering dishwashing liquid." },

  // Toiletries
  { id: "pt-4", storeSlug: "powertrade", name: "Sunlight Bar Soap (Box of 48)", category: "Toiletries", price: 249.99, bulkPrice: 229.00, minQty: 5, unit: "box", image: "🧼", inStock: 120, description: "Bulk household soap box." },
  { id: "pt-17", storeSlug: "powertrade", name: "Twinsaver Toilet Tissue (24-pack)", category: "Toiletries", price: 189.99, bulkPrice: 175.00, minQty: 6, unit: "pack", image: "🧻", badge: "Trade Price", inStock: 140, description: "Bulk bathroom tissue case." },
  { id: "pt-56", storeSlug: "powertrade", name: "Colgate Toothpaste (Case of 24)", category: "Toiletries", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "case", image: "🪥", inStock: 70, description: "Wholesale toothpaste case." },
  { id: "pt-57", storeSlug: "powertrade", name: "Facial Tissues (Carton of 36)", category: "Toiletries", price: 329.99, bulkPrice: 299.00, minQty: 3, unit: "carton", image: "🤧", inStock: 55, description: "Tissue cartons for resale." },

  // Baby
  { id: "pt-58", storeSlug: "powertrade", name: "Nappies Size 4 (Case)", category: "Baby", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "case", image: "🍼", badge: "Trade Price", inStock: 50, description: "Wholesale nappy case." },
  { id: "pt-59", storeSlug: "powertrade", name: "Baby Wipes (Case of 12)", category: "Baby", price: 299.99, bulkPrice: 275.00, minQty: 3, unit: "case", image: "🧻", inStock: 65, description: "Multi-pack wipe cases." },
  { id: "pt-60", storeSlug: "powertrade", name: "Baby Formula 900g (Case of 6)", category: "Baby", price: 899.99, bulkPrice: 849.00, minQty: 2, unit: "case", image: "🍼", inStock: 40, description: "Wholesale formula case." },

  // Health & Beauty
  { id: "pt-61", storeSlug: "powertrade", name: "Vaseline Petroleum Jelly (Case of 12)", category: "Health & Beauty", price: 349.99, bulkPrice: 319.00, minQty: 3, unit: "case", image: "🫙", badge: "Popular", inStock: 80, description: "Bulk petroleum jelly." },
  { id: "pt-62", storeSlug: "powertrade", name: "Body Lotion Assorted (Case of 12)", category: "Health & Beauty", price: 399.99, bulkPrice: 365.00, minQty: 3, unit: "case", image: "🧴", inStock: 70, description: "Assorted lotion cases." },
  { id: "pt-63", storeSlug: "powertrade", name: "Hair Food / Oil Multipack (Case of 24)", category: "Health & Beauty", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "case", image: "💇", inStock: 55, description: "Popular haircare for traders." },

  // Pet Food
  { id: "pt-64", storeSlug: "powertrade", name: "Dry Dog Food 20kg", category: "Pet Food", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "bag", image: "🐕", badge: "Trade Price", inStock: 60, description: "Bulk dry dog food." },
  { id: "pt-65", storeSlug: "powertrade", name: "Cat Litter 10kg", category: "Pet Food", price: 129.99, bulkPrice: 118.00, minQty: 4, unit: "bag", image: "🐱", inStock: 45, description: "Wholesale cat litter." },
  { id: "pt-66", storeSlug: "powertrade", name: "Wet Cat Food (Case of 24)", category: "Pet Food", price: 279.99, bulkPrice: 255.00, minQty: 3, unit: "case", image: "🐱", inStock: 50, description: "Pouch/can case for resale." },

  // Frozen Foods
  { id: "pt-67", storeSlug: "powertrade", name: "Frozen Chicken Portions 10kg", category: "Frozen Foods", price: 549.99, bulkPrice: 509.00, minQty: 2, unit: "box", image: "🍗", badge: "Trade Price", inStock: 40, description: "IQF chicken portions carton." },
  { id: "pt-68", storeSlug: "powertrade", name: "Frozen Chips 5kg", category: "Frozen Foods", price: 149.99, bulkPrice: 135.00, minQty: 4, unit: "bag", image: "🍟", inStock: 70, description: "Catering oven chips." },
  { id: "pt-69", storeSlug: "powertrade", name: "Frozen Mixed Vegetables 2.5kg (Case of 6)", category: "Frozen Foods", price: 329.99, bulkPrice: 299.00, minQty: 3, unit: "case", image: "🥦", inStock: 55, description: "Bulk frozen veg cases." },

  // Meat & Butchery
  { id: "pt-70", storeSlug: "powertrade", name: "Whole Chickens (Case of 10)", category: "Meat & Butchery", price: 649.99, bulkPrice: 599.00, minQty: 2, unit: "case", image: "🍗", badge: "Trade Price", inStock: 35, description: "Fresh/frozen whole birds for traders." },
  { id: "pt-71", storeSlug: "powertrade", name: "Beef Mince 5kg Tray", category: "Meat & Butchery", price: 449.99, bulkPrice: 415.00, minQty: 2, unit: "tray", image: "🥩", inStock: 28, description: "Bulk mince for foodservice." },
  { id: "pt-72", storeSlug: "powertrade", name: "Boerewors 5kg Pack", category: "Meat & Butchery", price: 399.99, bulkPrice: 365.00, minQty: 3, unit: "pack", image: "🌭", badge: "Popular", inStock: 40, description: "Wholesale boerewors pack." },

  // Bakery
  { id: "pt-23", storeSlug: "powertrade", name: "Albany Superior White Bread (Case of 10)", category: "Bakery", price: 129.99, bulkPrice: 118.00, minQty: 4, unit: "case", image: "🍞", badge: "Popular", inStock: 150, description: "Wholesale sliced white loaves." },
  { id: "pt-73", storeSlug: "powertrade", name: "Brown Bread (Case of 10)", category: "Bakery", price: 139.99, bulkPrice: 128.00, minQty: 4, unit: "case", image: "🍞", inStock: 120, description: "Wholewheat loaf cases." },
  { id: "pt-74", storeSlug: "powertrade", name: "Rolls Tray (48)", category: "Bakery", price: 89.99, bulkPrice: 82.00, minQty: 5, unit: "tray", image: "🥖", inStock: 80, description: "Catering roll tray." },

  // Packaging (traders / spaza)
  { id: "pt-18", storeSlug: "powertrade", name: "Serviette Pack 500s (Carton of 10)", category: "Packaging", price: 299.99, bulkPrice: 275.00, minQty: 3, unit: "carton", image: "📄", inStock: 55, description: "Catering napkin cartons." },
  { id: "pt-75", storeSlug: "powertrade", name: "Plastic Shopping Bags (Pack of 1000)", category: "Packaging", price: 149.99, bulkPrice: 135.00, minQty: 5, unit: "pack", image: "🛍️", badge: "Trade Price", inStock: 200, description: "Spaza carrier bags." },
  { id: "pt-76", storeSlug: "powertrade", name: "Takeaway Containers (Case of 500)", category: "Packaging", price: 349.99, bulkPrice: 319.00, minQty: 2, unit: "case", image: "📦", inStock: 70, description: "Foam/plastic takeaway packs." },
  { id: "pt-77", storeSlug: "powertrade", name: "Cling Wrap Catering Roll", category: "Packaging", price: 119.99, bulkPrice: 109.00, minQty: 4, unit: "roll", image: "🎞️", inStock: 90, description: "Heavy-duty cling wrap." },

  // Party & Occasions
  { id: "pt-78", storeSlug: "powertrade", name: "Party Cups & Plates (Case)", category: "Party & Occasions", price: 199.99, bulkPrice: 185.00, minQty: 3, unit: "case", image: "🎉", inStock: 60, description: "Disposable partyware case." },
  { id: "pt-79", storeSlug: "powertrade", name: "Balloons Assorted (Pack of 100)", category: "Party & Occasions", price: 79.99, bulkPrice: 72.00, minQty: 6, unit: "pack", image: "🎈", inStock: 85, description: "Bulk balloons for events." },
  { id: "pt-80", storeSlug: "powertrade", name: "Wrapping Paper & Gift Bags (Carton)", category: "Party & Occasions", price: 249.99, bulkPrice: 229.00, minQty: 2, unit: "carton", image: "🎁", inStock: 45, description: "Occasion packaging carton." },

  // Daily Essentials
  { id: "pt-24", storeSlug: "powertrade", name: "Clover Fresh Milk 2L (Case of 9)", category: "Daily Essentials", price: 249.99, bulkPrice: 229.00, minQty: 3, unit: "case", image: "🥛", badge: "Trade Price", inStock: 100, description: "Full cream milk cases." },
  { id: "pt-81", storeSlug: "powertrade", name: "Matches & Lighters (Carton)", category: "Daily Essentials", price: 149.99, bulkPrice: 135.00, minQty: 4, unit: "carton", image: "🔥", inStock: 110, description: "Spaza everyday essentials carton." },
  { id: "pt-82", storeSlug: "powertrade", name: "Batteries AA/AAA Multipack (Case)", category: "Daily Essentials", price: 279.99, bulkPrice: 255.00, minQty: 3, unit: "case", image: "🔋", inStock: 75, description: "Wholesale battery cases." },
  { id: "pt-83", storeSlug: "powertrade", name: "Candles Household (Case of 48)", category: "Daily Essentials", price: 189.99, bulkPrice: 175.00, minQty: 4, unit: "case", image: "🕯️", inStock: 90, description: "Bulk household candles." },

  // ─── Hardware (buildsave) ─────────────────────────────────────────────────
  { id: "bs-14", storeSlug: "buildsave", name: "LED Light Bulbs 9W (Pack of 4)", category: "Electrical", price: 99.99, unit: "pack", image: "💡", inStock: 80, description: "Warm white LED bulbs, E27 base.", badge: "Best Value" },
  { id: "bs-4", storeSlug: "buildsave", name: "Electrical Wire 2.5mm (100m)", category: "Electrical", price: 1249.99, unit: "roll", image: "⚡", inStock: 12, description: "SABS approved copper electrical wire.", badge: "Contractor" },
  { id: "bs-15", storeSlug: "buildsave", name: "Extension Lead 10m", category: "Electrical", price: 189.99, unit: "each", image: "🔌", inStock: 35, description: "Heavy-duty outdoor rated extension lead." },
  { id: "bs-31", storeSlug: "buildsave", name: "AA Batteries (Pack of 8)", category: "Electrical", price: 49.99, unit: "pack", image: "🔋", inStock: 90, description: "Long-life alkaline AA batteries." },
  { id: "bs-32", storeSlug: "buildsave", name: "Multi-Plug 4-Way", category: "Electrical", price: 79.99, unit: "each", image: "🔌", inStock: 55, description: "Surge-protected multi-plug adaptor.", badge: "Popular" },
  { id: "bs-27", storeSlug: "buildsave", name: "Light Switch Single Lever", category: "Electrical", price: 39.99, unit: "each", image: "💡", inStock: 70, description: "White single-lever light switch." },
  { id: "bs-10", storeSlug: "buildsave", name: "Claw Hammer 16oz", category: "Hand Tools", price: 149.99, unit: "each", image: "🔨", inStock: 40, description: "Steel shaft claw hammer with rubber grip." },
  { id: "bs-11", storeSlug: "buildsave", name: "Tape Measure 8m", category: "Hand Tools", price: 89.99, unit: "each", image: "📏", inStock: 60, description: "Locking steel blade tape measure.", badge: "Best Value" },
  { id: "bs-2", storeSlug: "buildsave", name: "Screwdriver Set (6 piece)", category: "Hand Tools", price: 129.99, unit: "set", image: "🪛", inStock: 45, description: "Phillips and flat-head screwdriver set.", badge: "Popular" },
  { id: "bs-25", storeSlug: "buildsave", name: "Combination Pliers 200mm", category: "Hand Tools", price: 99.99, unit: "each", image: "🔧", inStock: 50, description: "Chrome-vanadium combination pliers." },
  { id: "bs-33", storeSlug: "buildsave", name: "Adjustable Spanner 250mm", category: "Hand Tools", price: 119.99, unit: "each", image: "🔧", inStock: 38, description: "Heavy-duty adjustable spanner." },
  { id: "bs-34", storeSlug: "buildsave", name: "Spirit Level 600mm", category: "Hand Tools", price: 149.99, unit: "each", image: "📐", inStock: 28, description: "Aluminium spirit level with three vials." },
  { id: "bs-20", storeSlug: "buildsave", name: "Wood Screws Assorted Box", category: "Fasteners", price: 89.99, unit: "box", image: "🔩", inStock: 100, description: "Mixed wood screws, 500 pieces.", badge: "Best Value" },
  { id: "bs-21", storeSlug: "buildsave", name: "Nail Assortment 1kg", category: "Fasteners", price: 59.99, unit: "box", image: "📌", inStock: 85, description: "Wire nails mixed lengths." },
  { id: "bs-35", storeSlug: "buildsave", name: "Wall Plugs Assorted Pack", category: "Fasteners", price: 34.99, unit: "pack", image: "🔩", inStock: 120, description: "Rawl plugs mixed sizes." },
  { id: "bs-36", storeSlug: "buildsave", name: "Bolts & Nuts Mixed Box", category: "Fasteners", price: 79.99, unit: "box", image: "⚙️", inStock: 65, description: "Assorted metric bolts, nuts and washers." },
  { id: "bs-5", storeSlug: "buildsave", name: "PVC Pipe 110mm (6m)", category: "Plumbing", price: 189.99, unit: "each", image: "🔩", inStock: 45, description: "Drainage PVC pipe, 6 metre length." },
  { id: "bs-16", storeSlug: "buildsave", name: "PVC Elbows & Connectors Pack", category: "Plumbing", price: 69.99, unit: "pack", image: "🔧", inStock: 70, description: "PVC elbows, tees and couplings mix." },
  { id: "bs-28", storeSlug: "buildsave", name: "Teflon Tape (Pack of 10)", category: "Plumbing", price: 39.99, unit: "pack", image: "🧵", inStock: 95, description: "Plumbing thread seal tape.", badge: "Best Value" },
  { id: "bs-17", storeSlug: "buildsave", name: "Flexible Tap Hose Pair", category: "Plumbing", price: 89.99, unit: "pair", image: "🚿", inStock: 40, description: "Stainless flexible tap connectors.", badge: "Special" },
  { id: "bs-37", storeSlug: "buildsave", name: "Garden Hose Connectors Set", category: "Plumbing", price: 49.99, unit: "set", image: "💧", inStock: 55, description: "Quick-connect hose fittings and nozzle." },
  { id: "bs-3", storeSlug: "buildsave", name: "Interior Paint 20L White", category: "Paint & Decorating", price: 649.99, unit: "each", image: "🎨", inStock: 30, description: "Low VOC washable interior paint.", bulkPrice: 599, minQty: 4, badge: "Special" },
  { id: "bs-12", storeSlug: "buildsave", name: "Exterior Weatherproof Paint 5L", category: "Paint & Decorating", price: 449.99, unit: "each", image: "🖌️", inStock: 25, description: "UV-resistant acrylic exterior paint." },
  { id: "bs-13", storeSlug: "buildsave", name: "Paint Roller & Tray Set", category: "Paint & Decorating", price: 79.99, unit: "set", image: "🎨", inStock: 55, description: "Tray, roller and spare sleeve." },
  { id: "bs-26", storeSlug: "buildsave", name: "Sandpaper Assorted Pack", category: "Paint & Decorating", price: 29.99, unit: "pack", image: "📎", inStock: 80, description: "Mixed grit sandpaper sheets." },
  { id: "bs-38", storeSlug: "buildsave", name: "Masking Tape 48mm (3 pack)", category: "Paint & Decorating", price: 44.99, unit: "pack", image: "🧻", inStock: 70, description: "Painter masking tape multipack." },
  { id: "bs-39", storeSlug: "buildsave", name: "Super Glue (Pack of 3)", category: "Adhesives & Sealants", price: 29.99, unit: "pack", image: "🧴", inStock: 90, description: "Instant cyanoacrylate glue tubes." },
  { id: "bs-40", storeSlug: "buildsave", name: "Silicone Sealant Clear", category: "Adhesives & Sealants", price: 49.99, unit: "each", image: "🧴", inStock: 60, description: "Waterproof silicone for bathrooms.", badge: "Popular" },
  { id: "bs-41", storeSlug: "buildsave", name: "Wood Glue 500ml", category: "Adhesives & Sealants", price: 54.99, unit: "each", image: "🪵", inStock: 45, description: "PVA wood adhesive." },
  { id: "bs-42", storeSlug: "buildsave", name: "Duct Tape Heavy Duty", category: "Adhesives & Sealants", price: 39.99, unit: "each", image: "📦", inStock: 75, description: "Silver duct tape roll." },
  { id: "bs-43", storeSlug: "buildsave", name: "Padlock Laminated 50mm", category: "Security", price: 69.99, unit: "each", image: "🔒", inStock: 50, description: "Hardened steel padlock with keys." },
  { id: "bs-44", storeSlug: "buildsave", name: "Door Lock Cylinder", category: "Security", price: 149.99, unit: "each", image: "🔐", inStock: 28, description: "Euro-profile door lock cylinder.", badge: "Contractor" },
  { id: "bs-45", storeSlug: "buildsave", name: "Gate Hinge Pair Heavy Duty", category: "Security", price: 119.99, unit: "pair", image: "🚪", inStock: 35, description: "Galvanised gate hinges." },
  { id: "bs-46", storeSlug: "buildsave", name: "Hasp & Staple Set", category: "Security", price: 49.99, unit: "set", image: "🔒", inStock: 42, description: "Security hasp with staples." },
  { id: "bs-6", storeSlug: "buildsave", name: "Garden Hose 30m", category: "Gardening", price: 299.99, unit: "each", image: "🌿", inStock: 25, description: "Reinforced garden hose with fittings." },
  { id: "bs-19", storeSlug: "buildsave", name: "Wheelbarrow Heavy Duty", category: "Gardening", price: 799.99, unit: "each", image: "🛒", inStock: 18, description: "Steel tray, pneumatic tyre.", bulkPrice: 749, minQty: 3, badge: "Contractor" },
  { id: "bs-29", storeSlug: "buildsave", name: "Spade Digging Steel", category: "Gardening", price: 189.99, unit: "each", image: "🪓", inStock: 40, description: "Hardwood shaft digging spade." },
  { id: "bs-18", storeSlug: "buildsave", name: "Secateurs Pruning Shears", category: "Gardening", price: 89.99, unit: "each", image: "✂️", inStock: 48, description: "Bypass pruning secateurs.", badge: "Popular" },
  { id: "bs-47", storeSlug: "buildsave", name: "Plant Pots Assorted (5 pack)", category: "Gardening", price: 59.99, unit: "pack", image: "🪴", inStock: 60, description: "Plastic plant pots mixed sizes." },
  { id: "bs-48", storeSlug: "buildsave", name: "Engine Oil 5W-30 5L", category: "Automotive", price: 289.99, unit: "each", image: "🛢️", inStock: 35, description: "Semi-synthetic motor oil.", badge: "Popular" },
  { id: "bs-49", storeSlug: "buildsave", name: "Coolant Premix 5L", category: "Automotive", price: 99.99, unit: "each", image: "🧊", inStock: 40, description: "Ready-to-use engine coolant." },
  { id: "bs-50", storeSlug: "buildsave", name: "Jumper Cables 600A", category: "Automotive", price: 249.99, unit: "each", image: "🔋", inStock: 22, description: "Heavy-duty booster cables.", badge: "Special" },
  { id: "bs-51", storeSlug: "buildsave", name: "Car Shampoo 1L", category: "Automotive", price: 49.99, unit: "each", image: "🚗", inStock: 55, description: "Foam car wash shampoo." },
  { id: "bs-52", storeSlug: "buildsave", name: "Microfibre Cloths (Pack of 5)", category: "Automotive", price: 59.99, unit: "pack", image: "🧽", inStock: 70, description: "Soft detailing microfibre cloths." },
  { id: "bs-53", storeSlug: "buildsave", name: "Broom Soft Bristle", category: "Household Hardware", price: 79.99, unit: "each", image: "🧹", inStock: 45, description: "Indoor soft-bristle broom." },
  { id: "bs-54", storeSlug: "buildsave", name: "Mop & Bucket Set", category: "Household Hardware", price: 149.99, unit: "set", image: "🪣", inStock: 30, description: "Spin mop with bucket.", badge: "Best Value" },
  { id: "bs-55", storeSlug: "buildsave", name: "Storage Boxes Stackable (3 pack)", category: "Household Hardware", price: 129.99, unit: "pack", image: "📦", inStock: 40, description: "Clear stackable storage boxes." },
  { id: "bs-56", storeSlug: "buildsave", name: "Clothes Pegs (Pack of 50)", category: "Household Hardware", price: 29.99, unit: "pack", image: "🧺", inStock: 80, description: "Plastic clothes pegs." },
  { id: "bs-23", storeSlug: "buildsave", name: "Work Gloves Leather Pair", category: "Household Hardware", price: 79.99, unit: "pair", image: "🧤", inStock: 75, description: "Reinforced palm work gloves." },
  { id: "bs-57", storeSlug: "buildsave", name: "Tarpaulin 3×4m", category: "Household Hardware", price: 159.99, unit: "each", image: "🏕️", inStock: 25, description: "Waterproof heavy-duty tarpaulin.", badge: "Contractor" },

  // ─── Foodworks ────────────────────────────────────────────────────────────
  { id: "fw-29", storeSlug: "foodworks", name: "Golden Delicious Apples", category: "Fruit & Vegetables", price: 24.99, unit: "/kg", image: "🍎", inStock: 45, description: "Crisp sweet apples.", badge: "Fresh" },
  { id: "fw-30", storeSlug: "foodworks", name: "Bananas", category: "Fruit & Vegetables", price: 19.99, unit: "/kg", image: "🍌", inStock: 70, description: "Ripe ready-to-eat bananas.", badge: "Best Value" },
  { id: "fw-31", storeSlug: "foodworks", name: "Tomatoes on the Vine", category: "Fruit & Vegetables", price: 32.99, unit: "/kg", image: "🍅", inStock: 40, description: "Ripe vine tomatoes.", badge: "Fresh" },
  { id: "fw-32", storeSlug: "foodworks", name: "Baby Potatoes 1.5kg", category: "Fruit & Vegetables", price: 29.99, unit: "bag", image: "🥔", inStock: 35, description: "Washed baby potatoes." },
  { id: "fw-33", storeSlug: "foodworks", name: "Avocados (2 pack)", category: "Fruit & Vegetables", price: 34.99, unit: "pack", image: "🥑", inStock: 28, description: "Ready-to-eat Hass avocados." },
  { id: "fw-34", storeSlug: "foodworks", name: "Fresh Herbs Mix Pack", category: "Fruit & Vegetables", price: 18.99, unit: "pack", image: "🌿", inStock: 32, description: "Parsley, coriander and basil.", badge: "Fresh" },
  { id: "fw-35", storeSlug: "foodworks", name: "Naartjies 1kg", category: "Fruit & Vegetables", price: 27.99, unit: "bag", image: "🍊", inStock: 40, description: "Sweet South African naartjies." },
  { id: "fw-1", storeSlug: "foodworks", name: "Beef Mince Premium 1kg", category: "Meat & Poultry", price: 89.99, unit: "pack", image: "🥩", inStock: 40, description: "Lean beef mince, freshly packed.", memberPrice: 79.99, badge: "Member Price" },
  { id: "fw-19", storeSlug: "foodworks", name: "Aged Rump Steak 400g", category: "Meat & Poultry", price: 119.99, unit: "pack", image: "🥩", inStock: 22, description: "21-day aged rump, thick cut.", badge: "Popular" },
  { id: "fw-8", storeSlug: "foodworks", name: "Chicken Braai Pack 2kg", category: "Meat & Poultry", price: 99.99, unit: "pack", image: "🍗", inStock: 35, description: "Mixed chicken pieces for the braai.", badge: "Special" },
  { id: "fw-2", storeSlug: "foodworks", name: "Pork Chops 1kg", category: "Meat & Poultry", price: 79.99, unit: "pack", image: "🍖", inStock: 30, description: "Free-range pork chops.", badge: "Fresh" },
  { id: "fw-7", storeSlug: "foodworks", name: "Lamb Chops 1kg", category: "Meat & Poultry", price: 159.99, unit: "pack", image: "🍖", inStock: 22, description: "Karoo lamb loin chops.", memberPrice: 144.99, badge: "Member Price" },
  { id: "fw-18", storeSlug: "foodworks", name: "Boerewors 1kg", category: "Meat & Poultry", price: 89.99, unit: "pack", image: "🌭", inStock: 28, description: "Traditional SA boerewors.", badge: "Special" },
  { id: "fw-21", storeSlug: "foodworks", name: "Beef Short Rib 1kg", category: "Meat & Poultry", price: 129.99, unit: "pack", image: "🥩", inStock: 20, description: "Meaty short rib for slow cook.", memberPrice: 114.99, badge: "Member Price" },
  { id: "fw-26", storeSlug: "foodworks", name: "Bacon Streaky 500g", category: "Meat & Poultry", price: 69.99, unit: "pack", image: "🥓", inStock: 35, description: "Smoked streaky bacon." },
  { id: "fw-36", storeSlug: "foodworks", name: "Chicken Breasts Filleted 1kg", category: "Meat & Poultry", price: 94.99, unit: "pack", image: "🍗", inStock: 30, description: "Skinless chicken breast fillets.", badge: "Fresh" },
  { id: "fw-4", storeSlug: "foodworks", name: "Fresh Salmon Fillet", category: "Fish & Seafood", price: 149.99, unit: "/kg", image: "🐟", inStock: 15, description: "Atlantic salmon fillet.", badge: "Fresh" },
  { id: "fw-9", storeSlug: "foodworks", name: "Kingklip Fillet", category: "Fish & Seafood", price: 129.99, unit: "/kg", image: "🐟", inStock: 18, description: "Firm white fish, skinless." },
  { id: "fw-10", storeSlug: "foodworks", name: "Prawns Medium 500g", category: "Fish & Seafood", price: 119.99, unit: "pack", image: "🦐", inStock: 20, description: "Cleaned and deveined prawns.", memberPrice: 109.99, badge: "Member Price" },
  { id: "fw-11", storeSlug: "foodworks", name: "Calamari Tubes & Tentacles 400g", category: "Fish & Seafood", price: 89.99, unit: "pack", image: "🦑", inStock: 16, description: "Ready for frying or grilling." },
  { id: "fw-22", storeSlug: "foodworks", name: "Hake Medallions 500g", category: "Fish & Seafood", price: 79.99, unit: "pack", image: "🐟", inStock: 24, description: "Portioned hake medallions.", badge: "Fresh" },
  { id: "fw-27", storeSlug: "foodworks", name: "Smoked Snoek Fillet", category: "Fish & Seafood", price: 99.99, unit: "/kg", image: "🐠", inStock: 10, description: "Cape smoked snoek, ready to flake.", badge: "New" },
  { id: "fw-37", storeSlug: "foodworks", name: "Full-Cream Milk 2L", category: "Dairy & Eggs", price: 28.99, unit: "each", image: "🥛", inStock: 80, description: "Fresh full-cream milk.", badge: "Fresh" },
  { id: "fw-38", storeSlug: "foodworks", name: "Cheddar Cheese 400g", category: "Dairy & Eggs", price: 54.99, unit: "each", image: "🧀", inStock: 40, description: "Mature cheddar block.", memberPrice: 49.99, badge: "Member Price" },
  { id: "fw-39", storeSlug: "foodworks", name: "Large Eggs (Pack of 18)", category: "Dairy & Eggs", price: 49.99, unit: "pack", image: "🥚", inStock: 55, description: "Farm large eggs.", badge: "Best Value" },
  { id: "fw-40", storeSlug: "foodworks", name: "Greek Yogurt 500g", category: "Dairy & Eggs", price: 34.99, unit: "each", image: "🥣", inStock: 45, description: "Thick creamy Greek yogurt." },
  { id: "fw-41", storeSlug: "foodworks", name: "Butter Salted 500g", category: "Dairy & Eggs", price: 64.99, unit: "each", image: "🧈", inStock: 38, description: "Salted farm butter.", badge: "Special" },
  { id: "fw-6", storeSlug: "foodworks", name: "Fresh Croissants (6 pack)", category: "Bakery", price: 45.99, unit: "pack", image: "🥐", inStock: 35, description: "Buttery French-style croissants.", badge: "Fresh" },
  { id: "fw-16", storeSlug: "foodworks", name: "Sourdough Loaf", category: "Bakery", price: 39.99, unit: "each", image: "🍞", inStock: 20, description: "Artisan sourdough, baked daily." },
  { id: "fw-42", storeSlug: "foodworks", name: "White Bread Loaf", category: "Bakery", price: 14.99, unit: "each", image: "🍞", inStock: 60, description: "Freshly baked white loaf.", badge: "Fresh" },
  { id: "fw-43", storeSlug: "foodworks", name: "Brown Bread Loaf", category: "Bakery", price: 16.99, unit: "each", image: "🍞", inStock: 55, description: "High-fibre brown loaf." },
  { id: "fw-25", storeSlug: "foodworks", name: "Milk Tart (whole)", category: "Bakery", price: 59.99, unit: "each", image: "🥧", inStock: 12, description: "Traditional cinnamon milk tart.", badge: "Special" },
  { id: "fw-17", storeSlug: "foodworks", name: "Chocolate Éclairs (4 pack)", category: "Bakery", price: 49.99, unit: "pack", image: "🍫", inStock: 18, description: "Choux pastry with cream filling.", badge: "Special" },
  { id: "fw-44", storeSlug: "foodworks", name: "Portuguese Rolls (6 pack)", category: "Bakery", price: 24.99, unit: "pack", image: "🥖", inStock: 40, description: "Soft Portuguese-style rolls.", badge: "Popular" },
  { id: "fw-45", storeSlug: "foodworks", name: "White Rice 2kg", category: "Grocery / Pantry", price: 39.99, unit: "each", image: "🍚", inStock: 100, description: "Premium long grain white rice.", badge: "Best Value" },
  { id: "fw-46", storeSlug: "foodworks", name: "Spaghetti 500g", category: "Grocery / Pantry", price: 18.99, unit: "each", image: "🍝", inStock: 90, description: "Durum wheat spaghetti." },
  { id: "fw-47", storeSlug: "foodworks", name: "Sunflower Oil 2L", category: "Grocery / Pantry", price: 54.99, unit: "each", image: "🫒", inStock: 70, description: "Cooking sunflower oil." },
  { id: "fw-48", storeSlug: "foodworks", name: "Baked Beans 410g", category: "Grocery / Pantry", price: 18.99, unit: "each", image: "🥫", inStock: 95, description: "Baked beans in tomato sauce.", badge: "Special" },
  { id: "fw-49", storeSlug: "foodworks", name: "Cake Flour 2.5kg", category: "Grocery / Pantry", price: 34.99, unit: "bag", image: "🌾", inStock: 50, description: "Fine cake flour for baking." },
  { id: "fw-50", storeSlug: "foodworks", name: "Tomato Sauce 700ml", category: "Grocery / Pantry", price: 27.99, unit: "each", image: "🍅", inStock: 85, description: "Classic tomato sauce." },
  { id: "fw-51", storeSlug: "foodworks", name: "Oats 1kg", category: "Grocery / Pantry", price: 29.99, unit: "bag", image: "🥣", inStock: 60, description: "Rolled oats for porridge." },
  { id: "fw-52", storeSlug: "foodworks", name: "Potato Chips Salted 120g", category: "Snacks & Confectionery", price: 18.99, unit: "each", image: "🥔", inStock: 100, description: "Crispy salted potato chips." },
  { id: "fw-53", storeSlug: "foodworks", name: "Mixed Nuts 200g", category: "Snacks & Confectionery", price: 49.99, unit: "pack", image: "🥜", inStock: 45, description: "Roasted salted mixed nuts." },
  { id: "fw-54", storeSlug: "foodworks", name: "Chocolate Slab 80g", category: "Snacks & Confectionery", price: 19.99, unit: "each", image: "🍫", inStock: 110, description: "Milk chocolate slab." },
  { id: "fw-55", storeSlug: "foodworks", name: "Gummy Sweets 150g", category: "Snacks & Confectionery", price: 22.99, unit: "pack", image: "🍬", inStock: 75, description: "Assorted jelly sweets.", badge: "Special" },
  { id: "fw-56", storeSlug: "foodworks", name: "Popcorn Microwave Pack", category: "Snacks & Confectionery", price: 24.99, unit: "pack", image: "🍿", inStock: 65, description: "Butter flavour microwave popcorn." },
  { id: "fw-57", storeSlug: "foodworks", name: "Frozen Chips 1kg", category: "Frozen Foods", price: 44.99, unit: "bag", image: "🍟", inStock: 55, description: "Oven-bake frozen chips." },
  { id: "fw-58", storeSlug: "foodworks", name: "Frozen Mixed Vegetables 1kg", category: "Frozen Foods", price: 34.99, unit: "bag", image: "🥦", inStock: 50, description: "Peas, corn and carrots mix." },
  { id: "fw-59", storeSlug: "foodworks", name: "Ice Cream Vanilla 2L", category: "Frozen Foods", price: 69.99, unit: "tub", image: "🍦", inStock: 35, description: "Creamy vanilla ice cream.", badge: "Popular" },
  { id: "fw-60", storeSlug: "foodworks", name: "Frozen Pizza Margherita", category: "Frozen Foods", price: 54.99, unit: "each", image: "🍕", inStock: 40, description: "Ready-to-bake margherita pizza." },
  { id: "fw-61", storeSlug: "foodworks", name: "Fish Fingers 400g", category: "Frozen Foods", price: 54.99, unit: "pack", image: "🐟", inStock: 42, description: "Crumbed frozen fish fingers.", badge: "Special" },
  { id: "fw-62", storeSlug: "foodworks", name: "Cola 2L", category: "Beverages", price: 22.99, unit: "each", image: "🥤", inStock: 120, description: "Classic cola soft drink." },
  { id: "fw-63", storeSlug: "foodworks", name: "Still Water 6×500ml", category: "Beverages", price: 39.99, unit: "pack", image: "💧", inStock: 90, description: "Still bottled water multipack.", badge: "Best Value" },
  { id: "fw-64", storeSlug: "foodworks", name: "Orange Juice 1.5L", category: "Beverages", price: 29.99, unit: "each", image: "🍊", inStock: 70, description: "100% orange juice blend." },
  { id: "fw-65", storeSlug: "foodworks", name: "Rooibos Tea 80s", category: "Beverages", price: 39.99, unit: "box", image: "🍵", inStock: 65, description: "Naturally caffeine-free rooibos.", memberPrice: 34.99, badge: "Member Price" },
  { id: "fw-66", storeSlug: "foodworks", name: "Instant Coffee 200g", category: "Beverages", price: 89.99, unit: "each", image: "☕", inStock: 50, description: "Smooth instant coffee granules." },
  { id: "fw-67", storeSlug: "foodworks", name: "Energy Drink 500ml", category: "Beverages", price: 22.99, unit: "each", image: "⚡", inStock: 80, description: "Chilled energy drink." },

  // ─── Grab n Go ────────────────────────────────────────────────────────────
  { id: "gg-2", storeSlug: "grabngo", name: "Chicken Mayo Sandwich", category: "Sandwiches", price: 35.99, unit: "each", image: "🥪", inStock: 20, description: "Fresh made chicken mayo sandwich." },
  { id: "gg-11", storeSlug: "grabngo", name: "Ham & Cheese Sandwich", category: "Sandwiches", price: 38.99, unit: "each", image: "🥖", inStock: 16, description: "Ham and cheese on soft bread." },
  { id: "gg-29", storeSlug: "grabngo", name: "Cheese & Tomato Sandwich", category: "Sandwiches", price: 29.99, unit: "each", image: "🥪", inStock: 22, description: "Classic cheese and tomato.", badge: "Best Value" },
  { id: "gg-30", storeSlug: "grabngo", name: "Tuna Mayo Sandwich", category: "Sandwiches", price: 36.99, unit: "each", image: "🥪", inStock: 18, description: "Tuna mayo with crisp lettuce." },
  { id: "gg-31", storeSlug: "grabngo", name: "Club Sandwich", category: "Sandwiches", price: 49.99, unit: "each", image: "🥪", inStock: 14, description: "Triple-decker chicken club.", badge: "Popular" },
  { id: "gg-6", storeSlug: "grabngo", name: "Chicken Salad Wrap", category: "Wraps", price: 42.99, unit: "each", image: "🌯", inStock: 18, description: "Fresh chicken salad wrap.", badge: "Popular" },
  { id: "gg-12", storeSlug: "grabngo", name: "Vegetarian Wrap", category: "Wraps", price: 39.99, unit: "each", image: "🥗", inStock: 14, description: "Roasted veg and hummus wrap.", badge: "Fresh" },
  { id: "gg-32", storeSlug: "grabngo", name: "Chicken Caesar Wrap", category: "Wraps", price: 44.99, unit: "each", image: "🌯", inStock: 16, description: "Chicken Caesar in a soft wrap." },
  { id: "gg-33", storeSlug: "grabngo", name: "Steak Wrap", category: "Wraps", price: 49.99, unit: "each", image: "🌯", inStock: 12, description: "Grilled steak wrap with onion.", badge: "Hot" },
  { id: "gg-34", storeSlug: "grabngo", name: "Greek Salad", category: "Salads", price: 39.99, unit: "each", image: "🥗", inStock: 20, description: "Feta, olives and cucumber.", badge: "Fresh" },
  { id: "gg-35", storeSlug: "grabngo", name: "Chicken Caesar Salad", category: "Salads", price: 49.99, unit: "each", image: "🥗", inStock: 16, description: "Grilled chicken Caesar bowl.", badge: "Popular" },
  { id: "gg-36", storeSlug: "grabngo", name: "Pasta Salad", category: "Salads", price: 34.99, unit: "each", image: "🍝", inStock: 18, description: "Chilled creamy pasta salad." },
  { id: "gg-37", storeSlug: "grabngo", name: "Fruit Salad Cup", category: "Salads", price: 29.99, unit: "each", image: "🍈", inStock: 24, description: "Fresh cut seasonal fruit.", badge: "Fresh" },
  { id: "gg-13", storeSlug: "grabngo", name: "Chicken Curry & Rice", category: "Ready Meals", price: 54.99, unit: "each", image: "🍛", inStock: 18, description: "Mild Durban-style chicken curry.", badge: "Hot" },
  { id: "gg-38", storeSlug: "grabngo", name: "Lasagne Tray", category: "Ready Meals", price: 59.99, unit: "each", image: "🍝", inStock: 14, description: "Beef lasagne ready to heat.", badge: "Popular" },
  { id: "gg-39", storeSlug: "grabngo", name: "Macaroni & Cheese", category: "Ready Meals", price: 44.99, unit: "each", image: "🧀", inStock: 20, description: "Creamy mac and cheese." },
  { id: "gg-40", storeSlug: "grabngo", name: "Beef & Rice Bowl", category: "Ready Meals", price: 52.99, unit: "each", image: "🍱", inStock: 15, description: "Savoury beef with steamed rice." },
  { id: "gg-41", storeSlug: "grabngo", name: "Vegetable Curry", category: "Ready Meals", price: 46.99, unit: "each", image: "🍲", inStock: 12, description: "Mild vegetable curry with rice.", badge: "Fresh" },
  { id: "gg-5", storeSlug: "grabngo", name: "Beef Pie", category: "Hot Food", price: 22.99, unit: "each", image: "🥧", inStock: 30, description: "Golden flaky beef pie." },
  { id: "gg-23", storeSlug: "grabngo", name: "Chicken Pie", category: "Hot Food", price: 24.99, unit: "each", image: "🥧", inStock: 26, description: "Creamy chicken pie.", badge: "Popular" },
  { id: "gg-24", storeSlug: "grabngo", name: "Fried Chicken Pieces (3)", category: "Hot Food", price: 39.99, unit: "each", image: "🍗", inStock: 20, description: "Crispy fried chicken pieces.", badge: "Hot" },
  { id: "gg-42", storeSlug: "grabngo", name: "Rotisserie Chicken Quarter", category: "Hot Food", price: 34.99, unit: "each", image: "🍗", inStock: 18, description: "Fresh rotisserie chicken quarter.", badge: "Hot" },
  { id: "gg-43", storeSlug: "grabngo", name: "Fries Regular", category: "Hot Food", price: 24.99, unit: "each", image: "🍟", inStock: 40, description: "Crispy golden fries." },
  { id: "gg-44", storeSlug: "grabngo", name: "Samoosas (4 pack)", category: "Hot Food", price: 29.99, unit: "pack", image: "🥟", inStock: 25, description: "Crispy beef or veg samoosas.", badge: "Popular" },
  { id: "gg-45", storeSlug: "grabngo", name: "Vetkoek with Mince", category: "Hot Food", price: 32.99, unit: "each", image: "🫓", inStock: 22, description: "Warm vetkoek with savoury mince." },
  { id: "gg-46", storeSlug: "grabngo", name: "Margherita Pizza Slice", category: "Pizza", price: 29.99, unit: "each", image: "🍕", inStock: 20, description: "Classic tomato and mozzarella." },
  { id: "gg-47", storeSlug: "grabngo", name: "Chicken Pizza Slice", category: "Pizza", price: 34.99, unit: "each", image: "🍕", inStock: 18, description: "Chicken and cheese pizza slice.", badge: "Popular" },
  { id: "gg-48", storeSlug: "grabngo", name: "Pepperoni Pizza Slice", category: "Pizza", price: 34.99, unit: "each", image: "🍕", inStock: 16, description: "Pepperoni pizza slice." },
  { id: "gg-49", storeSlug: "grabngo", name: "Meat Lovers Pizza Slice", category: "Pizza", price: 39.99, unit: "each", image: "🍕", inStock: 14, description: "Loaded meat lovers slice.", badge: "Hot" },
  { id: "gg-14", storeSlug: "grabngo", name: "Boerie Roll", category: "Quick Meals", price: 44.99, unit: "each", image: "🌭", inStock: 20, description: "Boerewors on a soft roll with relish.", badge: "Popular" },
  { id: "gg-50", storeSlug: "grabngo", name: "Cheeseburger", category: "Quick Meals", price: 49.99, unit: "each", image: "🍔", inStock: 18, description: "Beef patty with cheese.", badge: "Hot" },
  { id: "gg-51", storeSlug: "grabngo", name: "Chicken Burger", category: "Quick Meals", price: 46.99, unit: "each", image: "🍔", inStock: 16, description: "Crumbed chicken burger." },
  { id: "gg-52", storeSlug: "grabngo", name: "Hot Dog", category: "Quick Meals", price: 29.99, unit: "each", image: "🌭", inStock: 25, description: "Classic hot dog with sauce.", badge: "Best Value" },
  { id: "gg-3", storeSlug: "grabngo", name: "Beef & Cheese Panini", category: "Quick Meals", price: 49.99, unit: "each", image: "🫓", inStock: 15, description: "Grilled beef and cheese panini.", badge: "Hot" },
  { id: "gg-19", storeSlug: "grabngo", name: "Combo: Pie + Soft Drink", category: "Quick Meals", price: 32.99, unit: "each", image: "🍽️", inStock: 40, description: "Any pie with a 330ml soft drink.", badge: "Best Value" },
  { id: "gg-20", storeSlug: "grabngo", name: "Combo: Sandwich + Coffee", category: "Quick Meals", price: 54.99, unit: "each", image: "☕", inStock: 25, description: "Any sandwich with a medium coffee.", badge: "Special" },
  { id: "gg-1", storeSlug: "grabngo", name: "Butter Scone (2 pack)", category: "Breakfast", price: 18.99, unit: "pack", image: "🥐", inStock: 40, description: "Soft buttery scones — a Greytown favourite.", badge: "Customer Favourite" },
  { id: "gg-8", storeSlug: "grabngo", name: "Full English Breakfast", category: "Breakfast", price: 69.99, unit: "each", image: "🍳", inStock: 12, description: "Eggs, bacon, sausage and toast.", badge: "Popular" },
  { id: "gg-22", storeSlug: "grabngo", name: "Bacon & Egg Roll", category: "Breakfast", price: 36.99, unit: "each", image: "🥓", inStock: 18, description: "Soft roll with bacon and fried egg.", badge: "Hot" },
  { id: "gg-9", storeSlug: "grabngo", name: "Blueberry Muffin", category: "Breakfast", price: 19.99, unit: "each", image: "🧁", inStock: 30, description: "Loaded with real blueberries." },
  { id: "gg-7", storeSlug: "grabngo", name: "Chocolate Croissant", category: "Breakfast", price: 16.99, unit: "each", image: "🍫", inStock: 25, description: "Freshly baked chocolate croissant.", badge: "Fresh" },
  { id: "gg-53", storeSlug: "grabngo", name: "Yogurt & Granola Cup", category: "Breakfast", price: 32.99, unit: "each", image: "🥣", inStock: 20, description: "Yogurt topped with granola.", badge: "Fresh" },
  { id: "gg-54", storeSlug: "grabngo", name: "Overnight Oats Cup", category: "Breakfast", price: 29.99, unit: "each", image: "🥣", inStock: 18, description: "Chilled overnight oats with fruit." },
  { id: "gg-28", storeSlug: "grabngo", name: "Combo: Breakfast Roll + Coffee", category: "Breakfast", price: 49.99, unit: "each", image: "🍳", inStock: 30, description: "Any breakfast roll with a medium coffee.", badge: "Popular" },
  { id: "gg-21", storeSlug: "grabngo", name: "Cinnamon Donut", category: "Desserts", price: 14.99, unit: "each", image: "🍩", inStock: 28, description: "Sugar-dusted cinnamon donut.", badge: "Fresh" },
  { id: "gg-55", storeSlug: "grabngo", name: "Chocolate Cake Slice", category: "Desserts", price: 29.99, unit: "each", image: "🍰", inStock: 16, description: "Rich chocolate cake slice." },
  { id: "gg-56", storeSlug: "grabngo", name: "Brownie", category: "Desserts", price: 22.99, unit: "each", image: "🍫", inStock: 22, description: "Fudgy chocolate brownie.", badge: "Popular" },
  { id: "gg-57", storeSlug: "grabngo", name: "Cheesecake Slice", category: "Desserts", price: 34.99, unit: "each", image: "🍰", inStock: 14, description: "Creamy baked cheesecake." },
  { id: "gg-10", storeSlug: "grabngo", name: "Cupcake Assorted", category: "Desserts", price: 18.99, unit: "each", image: "🧁", inStock: 24, description: "Frosted cupcake of the day." },
  { id: "gg-58", storeSlug: "grabngo", name: "Cut Watermelon Cup", category: "Fresh Fruit", price: 24.99, unit: "each", image: "🍉", inStock: 20, description: "Chilled cut watermelon.", badge: "Fresh" },
  { id: "gg-59", storeSlug: "grabngo", name: "Mixed Fruit Cup", category: "Fresh Fruit", price: 29.99, unit: "each", image: "🍈", inStock: 22, description: "Pineapple, grapes and melon.", badge: "Fresh" },
  { id: "gg-60", storeSlug: "grabngo", name: "Berry Cup", category: "Fresh Fruit", price: 34.99, unit: "each", image: "🫐", inStock: 16, description: "Fresh mixed berries." },
  { id: "gg-17", storeSlug: "grabngo", name: "Fresh Orange Juice 350ml", category: "Cold Drinks", price: 24.99, unit: "each", image: "🍊", inStock: 35, description: "Freshly squeezed orange juice.", badge: "Fresh" },
  { id: "gg-18", storeSlug: "grabngo", name: "Still Water 500ml", category: "Cold Drinks", price: 12.99, unit: "each", image: "💧", inStock: 100, description: "Chilled bottled water." },
  { id: "gg-26", storeSlug: "grabngo", name: "Berry Smoothie 350ml", category: "Cold Drinks", price: 34.99, unit: "each", image: "🫐", inStock: 22, description: "Blended berries and yoghurt.", badge: "New" },
  { id: "gg-27", storeSlug: "grabngo", name: "Energy Drink 500ml", category: "Cold Drinks", price: 22.99, unit: "each", image: "⚡", inStock: 55, description: "Chilled energy boost.", badge: "Special" },
  { id: "gg-16", storeSlug: "grabngo", name: "Iced Latte", category: "Cold Drinks", price: 32.99, unit: "each", image: "🧊", inStock: 999, description: "Chilled espresso over milk.", badge: "Special" },
  { id: "gg-61", storeSlug: "grabngo", name: "Soft Drink 330ml", category: "Cold Drinks", price: 14.99, unit: "each", image: "🥤", inStock: 80, description: "Assorted soft drinks." },
  { id: "gg-62", storeSlug: "grabngo", name: "Iced Tea 500ml", category: "Cold Drinks", price: 19.99, unit: "each", image: "🧊", inStock: 40, description: "Chilled peach iced tea." },
  { id: "gg-4", storeSlug: "grabngo", name: "Cappuccino Large", category: "Hot Drinks", price: 28.99, unit: "each", image: "☕", inStock: 999, description: "Aromatic barista cappuccino." },
  { id: "gg-15", storeSlug: "grabngo", name: "Flat White", category: "Hot Drinks", price: 26.99, unit: "each", image: "☕", inStock: 999, description: "Smooth double-shot flat white." },
  { id: "gg-25", storeSlug: "grabngo", name: "Americano", category: "Hot Drinks", price: 22.99, unit: "each", image: "☕", inStock: 999, description: "Double-shot black coffee." },
  { id: "gg-63", storeSlug: "grabngo", name: "Latte", category: "Hot Drinks", price: 28.99, unit: "each", image: "☕", inStock: 999, description: "Silky steamed-milk latte." },
  { id: "gg-64", storeSlug: "grabngo", name: "Hot Chocolate", category: "Hot Drinks", price: 26.99, unit: "each", image: "🍫", inStock: 999, description: "Rich hot chocolate.", badge: "Popular" },
  { id: "gg-65", storeSlug: "grabngo", name: "Rooibos Tea", category: "Hot Drinks", price: 18.99, unit: "each", image: "🍵", inStock: 999, description: "Freshly brewed rooibos." },
  { id: "gg-66", storeSlug: "grabngo", name: "Chocolate Bar", category: "Snacks", price: 14.99, unit: "each", image: "🍫", inStock: 90, description: "Grab-and-go chocolate bar." },
  { id: "gg-67", storeSlug: "grabngo", name: "Crisps 36g", category: "Snacks", price: 12.99, unit: "each", image: "🥔", inStock: 100, description: "Single-serve crisps." },
  { id: "gg-68", storeSlug: "grabngo", name: "Protein Bar", category: "Snacks", price: 29.99, unit: "each", image: "💪", inStock: 40, description: "High-protein snack bar.", badge: "New" },
  { id: "gg-69", storeSlug: "grabngo", name: "Trail Mix Pack", category: "Snacks", price: 24.99, unit: "each", image: "🥜", inStock: 45, description: "Nuts and dried fruit mix." },
  { id: "gg-70", storeSlug: "grabngo", name: "Granola Bar", category: "Snacks", price: 16.99, unit: "each", image: "🍪", inStock: 50, description: "Oat granola snack bar." },
];

/** Preferred aisle order for Hardware / Foodworks / Grab N Go */
export const STORE_CATEGORY_ORDER: Partial<Record<string, string[]>> = {
  buildsave: [
    "Electrical",
    "Hand Tools",
    "Fasteners",
    "Plumbing",
    "Paint & Decorating",
    "Adhesives & Sealants",
    "Security",
    "Gardening",
    "Automotive",
    "Household Hardware",
  ],
  foodworks: [
    "Fruit & Vegetables",
    "Meat & Poultry",
    "Fish & Seafood",
    "Dairy & Eggs",
    "Bakery",
    "Grocery / Pantry",
    "Snacks & Confectionery",
    "Frozen Foods",
    "Beverages",
  ],
  grabngo: [
    "Sandwiches",
    "Wraps",
    "Salads",
    "Ready Meals",
    "Hot Food",
    "Pizza",
    "Quick Meals",
    "Breakfast",
    "Desserts",
    "Fresh Fruit",
    "Cold Drinks",
    "Hot Drinks",
    "Snacks",
  ],
};

export function getProductsByStore(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.storeSlug === slug);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Canonical Bulk PowerTrade department order (wholesale / hybrid aisles). */
export const POWERTRADE_CATEGORY_ORDER = [
  "Rice & Grains",
  "Flour & Baking",
  "Sugar",
  "Cooking Oils",
  "Pasta & Noodles",
  "Canned Foods",
  "Snacks",
  "Biscuits",
  "Sweets & Confectionery",
  "Drinks",
  "Tea & Coffee",
  "Cleaning",
  "Toiletries",
  "Baby",
  "Health & Beauty",
  "Pet Food",
  "Frozen Foods",
  "Meat & Butchery",
  "Bakery",
  "Packaging",
  "Party & Occasions",
  "Daily Essentials",
] as const;

export function getCategories(slug: string): string[] {
  const cats = new Set(getProductsByStore(slug).map((p) => p.category));
  if (slug === "supermarket") {
    const ordered = SUPERMARKET_DEPARTMENTS.flatMap((d) =>
      d.categories.map((c) => c.name)
    ).filter((c) => cats.has(c));
    const rest = Array.from(cats).filter((c) => !ordered.includes(c));
    return [...ordered, ...rest];
  }
  const preferred =
    slug === "powertrade"
      ? [...POWERTRADE_CATEGORY_ORDER]
      : STORE_CATEGORY_ORDER[slug];
  if (preferred) {
    const ordered = preferred.filter((c) => cats.has(c));
    const rest = Array.from(cats).filter((c) => !preferred.includes(c));
    return [...ordered, ...rest];
  }
  return Array.from(cats);
}

/** Top-level supermarket departments that have at least one product */
export function getDepartments(slug: string): string[] {
  if (slug !== "supermarket") return [];
  const present = new Set(
    getProductsByStore(slug)
      .map((p) => p.department)
      .filter(Boolean) as string[]
  );
  return SUPERMARKET_DEPARTMENTS.map((d) => d.name).filter((n) => present.has(n));
}

export function getCategoriesInDepartment(department: string): string[] {
  const dept = SUPERMARKET_DEPARTMENTS.find((d) => d.name === department);
  if (!dept) return [];
  const cats = new Set(
    getProductsByStore("supermarket")
      .filter((p) => p.department === department)
      .map((p) => p.category)
  );
  return dept.categories.map((c) => c.name).filter((c) => cats.has(c));
}

/** Same category first, then same department, then same store */
export function getSimilarProducts(product: Product, limit = 4): Product[] {
  const sameStore = getProductsByStore(product.storeSlug).filter((p) => p.id !== product.id);
  const sameCategory = sameStore.filter((p) => p.category === product.category);
  const sameDept = sameStore.filter(
    (p) => p.department && p.department === product.department && p.category !== product.category
  );
  const rest = sameStore.filter(
    (p) => p.category !== product.category && p.department !== product.department
  );
  return [...sameCategory, ...sameDept, ...rest].slice(0, limit);
}
