const fs = require("fs");
const path = require("path");

const depts = [
  {
    department: "Fruit & Vegetables",
    cats: {
      "Fresh Fruit": [
        ["Royal Gala Apples 1kg", "🍎", 24.99, "bag", "Fresh"],
        ["Golden Delicious Apples 1kg", "🍎", 22.99, "bag"],
        ["Bananas", "🍌", 19.99, "/kg", "Best Value"],
        ["Naartjies 1kg", "🍊", 29.99, "bag", "Fresh"],
        ["Seedless Grapes 500g", "🍇", 34.99, "pack"],
        ["Strawberries 250g", "🍓", 39.99, "punnet", "Special"],
        ["Avocados (2 pack)", "🥑", 34.99, "pack"],
        ["Pineapple", "🍍", 29.99, "each"],
        ["Lemons (4 pack)", "🍋", 16.99, "pack"],
        ["Mango", "🥭", 22.99, "each"],
      ],
      "Fresh Vegetables": [
        ["Baby Potatoes 1.5kg", "🥔", 29.99, "bag"],
        ["Tomatoes on the Vine", "🍅", 32.99, "/kg", "Fresh"],
        ["Brown Onions 1kg", "🧅", 18.99, "bag"],
        ["Carrots 1kg", "🥕", 16.99, "bag"],
        ["Spinach Bunch", "🥬", 14.99, "bunch"],
        ["Butternut", "🎃", 19.99, "each"],
        ["Green Peppers (3 pack)", "🫑", 24.99, "pack"],
        ["Broccoli Head", "🥦", 22.99, "each"],
        ["Cucumber", "🥒", 12.99, "each"],
        ["Fresh Herbs Mixed", "🌿", 19.99, "pack"],
      ],
      "Prepared Produce": [
        ["Mixed Salad Bag 300g", "🥗", 27.99, "bag"],
        ["Fruit Salad Tub 400g", "🍉", 39.99, "tub"],
        ["Stir-Fry Veg Mix 400g", "🥬", 32.99, "pack"],
        ["Cut Fruit Tray", "🍎", 44.99, "tray", "Fresh"],
      ],
    },
  },
  {
    department: "Meat & Butchery",
    cats: {
      Beef: [
        ["Beef Mince 500g", "🥩", 54.99, "pack", "Member Price", 49.99],
        ["Sirloin Steak 400g", "🥩", 89.99, "pack"],
        ["Beef Cubes 500g", "🥩", 64.99, "pack"],
        ["Beef Brisket", "🥩", 99.99, "/kg"],
      ],
      Chicken: [
        ["Fresh Chicken Whole", "🍗", 69.99, "each", "Fresh"],
        ["Chicken Breasts 1kg", "🍗", 89.99, "pack", "Special"],
        ["Chicken Thighs 1kg", "🍗", 74.99, "pack"],
        ["Chicken Wings 1kg", "🍗", 59.99, "pack"],
        ["Chicken Livers 500g", "🍗", 34.99, "pack"],
      ],
      Pork: [
        ["Pork Chops 500g", "🥓", 64.99, "pack"],
        ["Pork Belly 500g", "🥓", 69.99, "pack"],
        ["Pork Sausages 500g", "🌭", 49.99, "pack"],
      ],
      Lamb: [
        ["Lamb Chops 500g", "🍖", 119.99, "pack"],
        ["Lamb Shanks (2)", "🍖", 99.99, "pack"],
      ],
      "Processed Meat": [
        ["Boerewors 1kg", "🌭", 89.99, "pack", "Special"],
        ["Streaky Bacon 200g", "🥓", 44.99, "pack"],
        ["Polony Loaf", "🥪", 29.99, "each"],
        ["Biltong 100g", "🦒", 54.99, "pack"],
      ],
      "Braai & Specialty": [
        ["Braai Pack Mixed 1.5kg", "🔥", 149.99, "pack", "Hot"],
        ["Beef Burgers (4)", "🍔", 69.99, "pack"],
        ["Meatballs 500g", "🧆", 54.99, "pack"],
      ],
    },
  },
  {
    department: "Fish & Seafood",
    cats: {
      "Fresh Fish": [
        ["Hake Fillets", "🐟", 89.99, "/kg", "Fresh"],
        ["Salmon Portion 200g", "🐟", 79.99, "pack"],
        ["Snoek", "🐠", 69.99, "/kg"],
      ],
      "Frozen Seafood": [
        ["Sea Harvest Hake 400g", "🐟", 69.99, "pack", "Best Value"],
        ["Prawns 400g", "🦐", 99.99, "pack"],
        ["Calamari Rings 400g", "🦑", 74.99, "pack"],
        ["Fish Fingers 500g", "🐟", 49.99, "pack"],
      ],
      "Canned Seafood": [
        ["Lucky Star Pilchards 400g", "🐟", 24.99, "each"],
        ["John West Tuna 170g", "🐟", 22.99, "each"],
        ["Sardines in Oil 120g", "🐟", 18.99, "each"],
      ],
    },
  },
  {
    department: "Dairy & Eggs",
    cats: {
      Milk: [
        ["Fresh Milk 2L", "🥛", 28.99, "each", "Special", 25.99],
        ["Parmalat Long Life Milk 1L", "🥛", 18.99, "each", "Best Value"],
        ["Low Fat Milk 2L", "🥛", 26.99, "each"],
        ["Lactose-Free Milk 1L", "🥛", 24.99, "each"],
      ],
      "Milk Alternatives": [
        ["Almond Breeze 1L", "🥛", 39.99, "each"],
        ["Oatly Oat Milk 1L", "🥛", 44.99, "each"],
        ["Soy Milk 1L", "🥛", 29.99, "each"],
      ],
      Cheese: [
        ["Clover Classic Cheese 400g", "🧀", 54.99, "each", "Member Price", 49.99],
        ["Lancewood Cream Cheese 230g", "🧀", 42.99, "each"],
        ["Feta Cheese 200g", "🧀", 36.99, "each"],
        ["Mozzarella 200g", "🧀", 39.99, "each"],
      ],
      Yogurt: [
        ["Clover Yoghurt 6x100g", "🥣", 34.99, "pack"],
        ["Greek Yoghurt 500g", "🥣", 39.99, "tub"],
        ["Danone Activia 4-pack", "🥣", 32.99, "pack"],
      ],
      "Butter & Eggs": [
        ["Clover Butter 500g", "🧈", 64.99, "each"],
        ["Flora Margarine 500g", "🧈", 34.99, "each"],
        ["Free Range Eggs (18)", "🥚", 54.99, "tray", "Fresh"],
        ["Fresh Cream 250ml", "🥛", 24.99, "each"],
      ],
    },
  },
  {
    department: "Bakery",
    cats: {
      Bread: [
        ["White Bread Loaf", "🍞", 14.99, "each", "Fresh"],
        ["Brown Bread Loaf", "🍞", 16.99, "each"],
        ["Sasko Seed Loaf", "🥖", 24.99, "each"],
        ["Sourdough Loaf", "🍞", 34.99, "each"],
        ["Burger Buns (6)", "🍔", 22.99, "pack"],
      ],
      "Baked Goods": [
        ["Hot Cross Buns (6)", "🧁", 29.99, "pack", "Fresh"],
        ["Chocolate Muffins (4)", "🧁", 34.99, "pack"],
        ["Croissants (2)", "🥐", 24.99, "pack"],
        ["Milk Tart Slice", "🥧", 18.99, "each"],
      ],
      "Bakery Ingredients": [
        ["Pizza Bases (2)", "🍕", 29.99, "pack"],
        ["Cake Mix Vanilla", "🎂", 34.99, "box"],
      ],
    },
  },
  {
    department: "Grocery / Dry Goods",
    cats: {
      Grains: [
        ["Tastic Rice 2kg", "🍚", 39.99, "each", "Best Value"],
        ["Iwisa Maize Meal 2.5kg", "🌽", 34.99, "bag"],
        ["Samp 1kg", "🌾", 24.99, "bag"],
        ["Quinoa 500g", "🌾", 69.99, "pack"],
      ],
      Pasta: [
        ["Spaghetti 500g", "🍝", 18.99, "pack"],
        ["Penne 500g", "🍝", 18.99, "pack"],
        ["Instant Noodles (5)", "🍜", 29.99, "pack"],
        ["Lasagne Sheets 250g", "🍝", 32.99, "pack"],
      ],
      "Breakfast Cereals": [
        ["Corn Flakes 500g", "🥣", 44.99, "box"],
        ["Jungle Oats 1kg", "🥣", 39.99, "box"],
        ["Futurelife Smart Food 500g", "🥣", 59.99, "box"],
        ["Kids Cereal 375g", "🥣", 49.99, "box"],
      ],
      "Canned Food": [
        ["Koo Baked Beans 410g", "🥫", 18.99, "each", "Special"],
        ["All Gold Tomatoes 410g", "🥫", 19.99, "each"],
        ["Koo Sweetcorn 410g", "🥫", 21.99, "each"],
        ["Chickpeas 400g", "🥫", 18.99, "each"],
      ],
      "Sauces & Condiments": [
        ["All Gold Tomato Sauce 700ml", "🍅", 27.99, "each"],
        ["Nandos Mild Peri-Peri 250ml", "🌶️", 39.99, "each"],
        ["Mayonnaise 750g", "🫙", 34.99, "each"],
        ["Chutney 450g", "🫙", 29.99, "each"],
      ],
      "Cooking Ingredients": [
        ["Sunfoil Cooking Oil 2L", "🫒", 54.99, "each"],
        ["Cake Flour 2.5kg", "🌾", 39.99, "bag"],
        ["White Sugar 1kg", "🧂", 24.99, "bag"],
        ["Black Cat Peanut Butter 400g", "🥜", 44.99, "each"],
        ["Robertsons Spice Pack", "🧂", 19.99, "each"],
      ],
    },
  },
  {
    department: "Snacks & Confectionery",
    cats: {
      "Chips & Crisps": [
        ["Simba Chips Salted 120g", "🥔", 18.99, "each"],
        ["Doritos Cheese 150g", "🌽", 22.99, "each"],
        ["Nik Naks 135g", "🌽", 16.99, "each"],
        ["Popcorn Microwave (3)", "🍿", 29.99, "pack"],
      ],
      Nuts: [
        ["Salted Peanuts 200g", "🥜", 24.99, "pack"],
        ["Mixed Nuts 150g", "🥜", 49.99, "pack"],
        ["Cashews 100g", "🥜", 39.99, "pack"],
      ],
      Sweets: [
        ["Beacon Fizzers 125g", "🍬", 22.99, "pack", "Special"],
        ["Maynards Wine Gums 100g", "🍬", 19.99, "pack"],
        ["Chappies Bubblegum 50s", "🫧", 14.99, "pack"],
      ],
      Chocolate: [
        ["Cadbury Dairy Milk 80g", "🍫", 24.99, "each"],
        ["Beacon Chocolate Slab 100g", "🍫", 22.99, "each"],
        ["Lindt Lindor Balls 100g", "🍫", 69.99, "pack"],
      ],
    },
  },
  {
    department: "Frozen Foods",
    cats: {
      "Frozen Vegetables": [
        ["McCain Mixed Veg 1kg", "🥦", 44.99, "bag"],
        ["Frozen Peas 1kg", "🟢", 34.99, "bag"],
        ["Frozen Spinach 400g", "🥬", 29.99, "pack"],
      ],
      "Frozen Meals": [
        ["McCain Oven Chips 1kg", "🍟", 44.99, "bag"],
        ["Frozen Pizza Margherita", "🍕", 69.99, "each"],
        ["Frozen Chicken Pie", "🥧", 34.99, "each"],
        ["Ready Meal Lasagne", "🍝", 54.99, "each"],
      ],
      "Ice Cream & Desserts": [
        ["Ola Magnum Classic", "🍦", 34.99, "each"],
        ["Country Fresh Tub 2L", "🍦", 79.99, "tub"],
        ["Sorbet Mango 500ml", "🍧", 49.99, "tub"],
      ],
    },
  },
  {
    department: "Beverages",
    cats: {
      Water: [
        ["Aquelle Still Water 6x500ml", "💧", 39.99, "pack", "Best Value"],
        ["Sparkling Water 1.5L", "💧", 18.99, "each"],
        ["Valpre Still 5L", "💧", 34.99, "each"],
      ],
      "Soft Drinks": [
        ["Coca-Cola 2L", "🥤", 22.99, "each"],
        ["Sprite 2L", "🥤", 22.99, "each"],
        ["Fanta Orange 2L", "🥤", 22.99, "each"],
        ["Red Bull 4-pack", "⚡", 79.99, "pack"],
      ],
      Juice: [
        ["Liqui-Fruit Orange 1.5L", "🍊", 29.99, "each"],
        ["Ceres Apple Juice 1L", "🍎", 24.99, "each"],
        ["Fruitree Mango 1L", "🥭", 22.99, "each"],
      ],
      "Hot Drinks": [
        ["Rooibos Tea 80s", "🍵", 39.99, "box", "Member Price", 34.99],
        ["Ricoffy 750g", "☕", 89.99, "each"],
        ["Five Roses Tea 100s", "🍵", 44.99, "box"],
        ["Nescafe Classic 200g", "☕", 99.99, "each"],
      ],
      Cordials: [
        ["Oros Orange 2L", "🍊", 49.99, "each"],
        ["Brookes Lemon Twist 2L", "🍋", 39.99, "each"],
      ],
    },
  },
  {
    department: "Deli & Ready Meals",
    cats: {
      "Hot Foods": [
        ["Rotisserie Chicken", "🍗", 79.99, "each", "Hot"],
        ["Fried Chicken Pieces (6)", "🍗", 69.99, "pack"],
        ["Sausage Roll", "🌭", 18.99, "each"],
      ],
      "Salads & Platters": [
        ["Potato Salad Tub", "🥗", 39.99, "tub"],
        ["Coleslaw 400g", "🥗", 29.99, "tub"],
        ["Party Platter Small", "🍱", 149.99, "each"],
      ],
      "Ready Meals": [
        ["Chicken Curry Meal", "🍛", 54.99, "each"],
        ["Mac & Cheese Tray", "🧀", 44.99, "tray"],
        ["Sushi Box 8pc", "🍣", 79.99, "box"],
      ],
    },
  },
  {
    department: "Specialty Foods",
    cats: {
      International: [
        ["Nandos Extra Mild Sauce", "🌶️", 39.99, "each"],
        ["Pasta Sauce Arrabbiata", "🍝", 34.99, "jar"],
        ["Tikka Masala Paste", "🍛", 44.99, "jar"],
        ["Tortilla Wraps (8)", "🌮", 39.99, "pack"],
      ],
      "Organic & Health": [
        ["Organic Honey 500g", "🍯", 79.99, "jar"],
        ["Chia Seeds 250g", "🌱", 59.99, "pack"],
        ["Protein Granola 400g", "🥣", 69.99, "box"],
      ],
      "Free From": [
        ["Gluten-Free Bread", "🍞", 44.99, "each"],
        ["Sugar-Free Cordial 1L", "🧃", 49.99, "each"],
        ["Vegan Cheese 200g", "🧀", 54.99, "pack"],
      ],
    },
  },
  {
    department: "Baby",
    cats: {
      "Baby Food": [
        ["Purity Puree Assorted", "🍼", 18.99, "each"],
        ["Cerelac Baby Cereal", "🥣", 49.99, "box"],
        ["Baby Formula Stage 1 900g", "🍼", 249.99, "tin"],
      ],
      "Baby Care": [
        ["Huggies Nappies Mid (40)", "🧷", 189.99, "pack"],
        ["Baby Wipes 80s", "🧻", 39.99, "pack"],
        ["Johnsons Baby Shampoo 200ml", "🧴", 49.99, "each"],
      ],
    },
  },
  {
    department: "Health & Beauty",
    cats: {
      "Personal Care": [
        ["Dove Beauty Bar 4-pack", "🧼", 49.99, "pack", "Member Price", 44.99],
        ["Nivea Soft Cream 300ml", "🧴", 59.99, "each"],
        ["Shield Deodorant 150ml", "🧴", 34.99, "each"],
        ["Sunsilk Shampoo 400ml", "🧴", 44.99, "each"],
      ],
      "Oral Care": [
        ["Colgate Toothpaste 100ml", "🪥", 29.99, "each"],
        ["Oral-B Toothbrush (2)", "🪥", 39.99, "pack"],
        ["Listerine Mouthwash 500ml", "🧴", 69.99, "each"],
      ],
      "Feminine Care": [
        ["Always Ultra Pads 16s", "📦", 49.99, "pack"],
        ["Tampax Regular 20s", "📦", 59.99, "pack"],
      ],
    },
  },
  {
    department: "Pharmacy",
    cats: {
      "OTC & Vitamins": [
        ["Panado Tablets 24s", "💊", 34.99, "pack"],
        ["Vitamin C 1000mg 30s", "💊", 69.99, "bottle"],
        ["Disprin 24s", "💊", 29.99, "pack"],
        ["Allergy Relief 10s", "💊", 79.99, "pack"],
      ],
      "First Aid": [
        ["Elastoplast Assorted", "🩹", 39.99, "pack"],
        ["Antiseptic Cream 50g", "🧴", 44.99, "tube"],
        ["Digital Thermometer", "🌡️", 99.99, "each"],
      ],
    },
  },
  {
    department: "Household Cleaning",
    cats: {
      Laundry: [
        ["Omo Auto Powder 2kg", "📦", 89.99, "each", "Special", 79.99],
        ["Sta-Soft Softener 2L", "🫧", 54.99, "each", "Best Value"],
        ["Vanish Stain Remover 1L", "🧴", 69.99, "each"],
      ],
      "Kitchen Cleaning": [
        ["Sunlight Dish Liquid 750ml", "🧴", 32.99, "each"],
        ["Sunlight Dishwasher Tabs 30s", "🍽️", 89.99, "box"],
        ["Scouring Pads (6)", "🧽", 24.99, "pack"],
      ],
      "General Cleaning": [
        ["Domestos Bleach 750ml", "🚽", 36.99, "each"],
        ["Handy Andy 750ml", "✨", 29.99, "each"],
        ["Mr Min Floor Polish 750ml", "🧹", 44.99, "each"],
        ["Jik Bleach 1.5L", "🧪", 34.99, "each"],
      ],
    },
  },
  {
    department: "Paper & Disposables",
    cats: {
      "Paper Products": [
        ["Twinsaver Toilet Paper 9s", "🧻", 89.99, "pack"],
        ["Kitchen Towels 2-roll", "🧻", 34.99, "pack"],
        ["Facial Tissues 3-pack", "🤧", 29.99, "pack"],
        ["Serviettes 100s", "📄", 19.99, "pack"],
      ],
      "Wraps & Bags": [
        ["Glad Cling Wrap 30m", "📦", 34.99, "each"],
        ["Aluminium Foil 10m", "📦", 29.99, "each"],
        ["Garbage Bags 20s", "🗑️", 39.99, "pack"],
        ["Sandwich Bags 100s", "🥡", 24.99, "pack"],
      ],
    },
  },
  {
    department: "Kitchen & Household",
    cats: {
      Cookware: [
        ["Non-stick Frying Pan 24cm", "🍳", 149.99, "each"],
        ["Saucepan Set (3)", "🍲", 299.99, "set"],
        ["Baking Tray", "🍪", 79.99, "each"],
      ],
      Tableware: [
        ["Dinner Plate Set (4)", "🍽️", 129.99, "set"],
        ["Glass Tumblers (6)", "🥛", 89.99, "set"],
        ["Cutlery Set 24pc", "🍴", 159.99, "set"],
      ],
      Storage: [
        ["Food Containers (3)", "🥡", 69.99, "set"],
        ["Lunch Box", "🍱", 49.99, "each"],
        ["Water Bottle 750ml", "💧", 59.99, "each"],
      ],
    },
  },
  {
    department: "Pet",
    cats: {
      Dog: [
        ["Pedigree Dog Food 1.5kg", "🐶", 89.99, "bag"],
        ["Dog Treats 200g", "🦴", 39.99, "pack"],
        ["Dog Leash", "🦮", 79.99, "each"],
      ],
      Cat: [
        ["Whiskas Cat Food 1.2kg", "🐱", 79.99, "bag"],
        ["Cat Litter 5kg", "🐈", 69.99, "bag"],
        ["Cat Treats 60g", "🐟", 29.99, "pack"],
      ],
      "Other Pets": [
        ["Bird Seed 1kg", "🐦", 49.99, "bag"],
        ["Fish Flakes 50g", "🐠", 39.99, "tub"],
      ],
    },
  },
  {
    department: "Stationery & School",
    cats: {
      Writing: [
        ["Bic Pens Blue (10)", "🖊️", 29.99, "pack"],
        ["HB Pencils (12)", "✏️", 24.99, "pack"],
        ["Highlighters (4)", "🖍️", 34.99, "pack"],
      ],
      "Books & Paper": [
        ["A4 Exam Pad", "📓", 19.99, "each"],
        ["Exercise Books (5)", "📔", 39.99, "pack"],
        ["A4 Copy Paper 500s", "📄", 89.99, "ream"],
      ],
      "School Bags": [
        ["School Backpack", "🎒", 249.99, "each"],
        ["Lunch Box Kids", "🍱", 69.99, "each"],
      ],
    },
  },
  {
    department: "Seasonal & Party",
    cats: {
      "Party Supplies": [
        ["Party Plates 20s", "🍽️", 39.99, "pack"],
        ["Balloons Assorted 20s", "🎈", 29.99, "pack"],
        ["Birthday Candles", "🕯️", 19.99, "pack"],
        ["Party Cups 20s", "🥤", 34.99, "pack"],
      ],
      "Gifts & Cards": [
        ["Greeting Card Assorted", "💌", 19.99, "each"],
        ["Gift Wrap Roll", "🎁", 29.99, "each"],
        ["Gift Bag Medium", "🛍️", 24.99, "each"],
      ],
    },
  },
];

let id = 1;
const products = [];
for (const d of depts) {
  for (const [category, items] of Object.entries(d.cats)) {
    for (const item of items) {
      const [name, image, price, unit, badge, memberPrice] = item;
      const p = {
        id: `sm-${id++}`,
        storeSlug: "supermarket",
        name,
        category,
        department: d.department,
        price,
        unit,
        image,
        inStock: 20 + ((id * 7) % 180),
        description: `${name} — quality supermarket range.`,
      };
      if (badge) p.badge = badge;
      if (memberPrice) p.memberPrice = memberPrice;
      products.push(p);
    }
  }
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

let out = `import { Product } from "./types";

/** Full supermarket catalogue: Department → Category → Product */
export const SUPERMARKET_PRODUCTS: Product[] = [
`;
for (const p of products) {
  out += `  { id: "${p.id}", storeSlug: "supermarket", name: "${esc(p.name)}", category: "${esc(p.category)}", department: "${esc(p.department)}", price: ${p.price},`;
  if (p.memberPrice) out += ` memberPrice: ${p.memberPrice},`;
  out += ` unit: "${p.unit}", image: "${p.image}",`;
  if (p.badge) out += ` badge: "${p.badge}",`;
  out += ` inStock: ${p.inStock}, description: "${esc(p.description)}" },\n`;
}
out += `];

export const SUPERMARKET_PRODUCT_COUNT = SUPERMARKET_PRODUCTS.length;
`;

const dest = path.join(__dirname, "..", "src", "lib", "supermarket-products.ts");
fs.writeFileSync(dest, out);
console.log("Wrote", products.length, "products to", dest);
