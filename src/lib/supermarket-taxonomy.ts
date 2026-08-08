/** Supermarket hierarchy: Department → Category → Subcategory → Product */

export type SupermarketCategory = {
  name: string;
  subcategories: string[];
};

export type SupermarketDepartment = {
  id: string;
  name: string;
  icon: string;
  categories: SupermarketCategory[];
};

export const SUPERMARKET_DEPARTMENTS: SupermarketDepartment[] = [
  {
    id: "fruit-veg",
    name: "Fruit & Vegetables",
    icon: "🍎",
    categories: [
      {
        name: "Fresh Fruit",
        subcategories: [
          "Apples", "Pears", "Bananas", "Oranges", "Lemons", "Limes", "Grapefruit",
          "Naartjies", "Grapes", "Strawberries", "Blueberries", "Raspberries", "Blackberries",
          "Watermelon", "Cantaloupe", "Honeydew", "Pineapple", "Mango", "Papaya", "Avocado",
          "Peaches", "Nectarines", "Plums", "Cherries", "Kiwi", "Guava", "Granadilla",
          "Pomegranate", "Figs", "Dates", "Coconut",
        ],
      },
      {
        name: "Fresh Vegetables",
        subcategories: [
          "Potatoes", "Sweet potatoes", "Onions", "Garlic", "Ginger", "Carrots", "Beetroot",
          "Turnips", "Radishes", "Tomatoes", "Cucumber", "Lettuce", "Spinach", "Cabbage",
          "Broccoli", "Cauliflower", "Green beans", "Peas", "Corn", "Peppers", "Chillies",
          "Mushrooms", "Butternut", "Pumpkin", "Gem squash", "Marrows", "Aubergine",
          "Celery", "Leeks", "Spring onions", "Fresh herbs",
        ],
      },
      {
        name: "Prepared Produce",
        subcategories: [
          "Fruit trays", "Fruit salads", "Cut vegetables", "Salad bowls",
          "Ready-to-cook vegetables", "Stir-fry vegetables",
        ],
      },
    ],
  },
  {
    id: "meat",
    name: "Meat & Butchery",
    icon: "🥩",
    categories: [
      {
        name: "Beef",
        subcategories: [
          "Beef mince", "Steak", "Rump", "Sirloin", "Fillet", "T-bone", "Ribeye",
          "Beef cubes", "Beef strips", "Beef roast", "Beef brisket", "Beef ribs",
        ],
      },
      {
        name: "Chicken",
        subcategories: [
          "Whole chicken", "Chicken breasts", "Chicken thighs", "Chicken drumsticks",
          "Chicken wings", "Chicken fillets", "Chicken livers", "Chicken giblets",
          "Chicken mince", "Marinated chicken", "Chicken portions",
        ],
      },
      {
        name: "Pork",
        subcategories: [
          "Pork chops", "Pork steaks", "Pork ribs", "Pork belly", "Pork roast",
          "Pork sausages", "Pork mince",
        ],
      },
      {
        name: "Lamb",
        subcategories: [
          "Lamb chops", "Lamb leg", "Lamb shoulder", "Lamb ribs", "Lamb stew",
          "Lamb mince", "Lamb shanks",
        ],
      },
      {
        name: "Processed Meat",
        subcategories: [
          "Bacon", "Sausages", "Boerewors", "Viennas", "Polony", "Ham", "Salami",
          "Pepperoni", "Biltong", "Droëwors", "Cold meats",
        ],
      },
      {
        name: "Braai & Specialty",
        subcategories: [
          "Braai meat", "Marinated meat", "Kebabs", "Burgers", "Meatballs", "Offal", "Frozen meat",
        ],
      },
    ],
  },
  {
    id: "seafood",
    name: "Fish & Seafood",
    icon: "🐟",
    categories: [
      {
        name: "Fresh Fish",
        subcategories: [
          "Fresh fish", "Hake", "Snoek", "Salmon", "Tuna", "Sardines", "Pilchards",
          "Kingklip", "Yellowtail", "Fish fillets", "Fish portions",
        ],
      },
      {
        name: "Frozen Seafood",
        subcategories: [
          "Frozen fish", "Fish fingers", "Prawns", "Shrimp", "Calamari", "Mussels",
          "Oysters", "Crab", "Seafood mix",
        ],
      },
      {
        name: "Canned Seafood",
        subcategories: ["Smoked fish", "Canned seafood", "Tuna", "Pilchards", "Sardines"],
      },
    ],
  },
  {
    id: "dairy",
    name: "Dairy & Eggs",
    icon: "🥛",
    categories: [
      {
        name: "Milk",
        subcategories: [
          "Full cream milk", "Low-fat milk", "Fat-free milk", "Long-life milk",
          "Flavoured milk", "A2 milk", "Lactose-free milk", "Plant-based milk",
        ],
      },
      {
        name: "Milk Alternatives",
        subcategories: ["Almond milk", "Soy milk", "Oat milk", "Coconut milk", "Rice milk"],
      },
      {
        name: "Cheese",
        subcategories: [
          "Cheddar", "Gouda", "Mozzarella", "Feta", "Cream cheese", "Cottage cheese",
          "Parmesan", "Blue cheese", "Brie", "Camembert", "Processed cheese",
          "Cheese slices", "Cheese spreads",
        ],
      },
      {
        name: "Yogurt",
        subcategories: [
          "Plain yogurt", "Greek yogurt", "Flavoured yogurt", "Drinking yogurt",
          "Kids' yogurt", "Probiotic yogurt",
        ],
      },
      {
        name: "Butter & Eggs",
        subcategories: [
          "Butter", "Margarine", "Cream", "Custard", "Sour cream", "Buttermilk",
          "Eggs", "Liquid eggs",
        ],
      },
    ],
  },
  {
    id: "bakery",
    name: "Bakery",
    icon: "🍞",
    categories: [
      {
        name: "Bread",
        subcategories: [
          "White bread", "Brown bread", "Wholewheat bread", "Multigrain bread", "Rye bread",
          "Sourdough", "Seeded bread", "Gluten-free bread", "Rolls", "Buns",
          "Hotdog rolls", "Burger buns", "Garlic bread",
        ],
      },
      {
        name: "Baked Goods",
        subcategories: [
          "Croissants", "Muffins", "Scones", "Doughnuts", "Danishes", "Pies", "Tarts",
          "Pastries", "Cakes", "Cupcakes", "Biscuits", "Cookies",
        ],
      },
      {
        name: "Bakery Ingredients",
        subcategories: ["Fresh dough", "Pizza bases", "Cake mixes", "Baking mixes"],
      },
    ],
  },
  {
    id: "grocery",
    name: "Grocery / Dry Goods",
    icon: "🥫",
    categories: [
      {
        name: "Grains",
        subcategories: ["Rice", "Maize meal", "Samp", "Couscous", "Quinoa", "Bulgur", "Barley"],
      },
      {
        name: "Pasta",
        subcategories: [
          "Spaghetti", "Macaroni", "Penne", "Fusilli", "Tagliatelle",
          "Lasagne sheets", "Noodles", "Instant noodles",
        ],
      },
      {
        name: "Breakfast Cereals",
        subcategories: [
          "Corn flakes", "Bran", "Muesli", "Granola", "Oats", "Porridge",
          "Weet-type cereals", "Kids' cereals",
        ],
      },
      {
        name: "Canned Food",
        subcategories: [
          "Baked beans", "Beans", "Chickpeas", "Lentils", "Tomatoes", "Sweetcorn",
          "Peas", "Mixed vegetables", "Tuna", "Pilchards", "Soup", "Fruit", "Canned meat",
        ],
      },
      {
        name: "Sauces & Condiments",
        subcategories: [
          "Tomato sauce", "Mayonnaise", "Mustard", "BBQ sauce", "Chutney", "Relish",
          "Soy sauce", "Hot sauce", "Pasta sauce", "Salad dressing", "Vinegar",
          "Worcestershire sauce", "Peanut butter",
        ],
      },
      {
        name: "Cooking Ingredients",
        subcategories: [
          "Flour", "Sugar", "Salt", "Baking powder", "Yeast", "Cornflour", "Custard powder",
          "Cocoa", "Cooking oil", "Olive oil", "Coconut oil", "Stock cubes", "Gravy",
          "Spices", "Herbs",
        ],
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks & Confectionery",
    icon: "🍫",
    categories: [
      {
        name: "Chips & Crisps",
        subcategories: ["Potato chips", "Tortilla chips", "Corn snacks", "Popcorn", "Pretzels"],
      },
      {
        name: "Nuts",
        subcategories: [
          "Peanuts", "Almonds", "Cashews", "Macadamias", "Pistachios", "Mixed nuts", "Trail mix",
        ],
      },
      {
        name: "Sweets",
        subcategories: [
          "Gummies", "Jelly sweets", "Hard sweets", "Toffees", "Lollipops",
          "Marshmallows", "Chewing gum", "Mints",
        ],
      },
      {
        name: "Chocolate",
        subcategories: [
          "Chocolate bars", "Chocolate slabs", "Truffles", "Chocolate boxes", "Baking chocolate",
        ],
      },
    ],
  },
  {
    id: "frozen",
    name: "Frozen Foods",
    icon: "🧊",
    categories: [
      {
        name: "Frozen Vegetables",
        subcategories: ["Frozen vegetables", "Frozen fruit", "Frozen chips", "Frozen potatoes"],
      },
      {
        name: "Frozen Meals",
        subcategories: [
          "Frozen pizza", "Frozen burgers", "Frozen chicken", "Frozen meat", "Frozen fish",
          "Fish fingers", "Frozen seafood", "Frozen pies", "Frozen meals", "Frozen pastries",
        ],
      },
      {
        name: "Ice Cream & Desserts",
        subcategories: ["Frozen desserts", "Ice cream", "Sorbet", "Frozen yogurt"],
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: "🥤",
    categories: [
      {
        name: "Water",
        subcategories: ["Still water", "Sparkling water", "Flavoured water", "Mineral water"],
      },
      {
        name: "Soft Drinks",
        subcategories: [
          "Cola", "Lemon-lime", "Orange", "Ginger ale", "Tonic", "Cream soda",
          "Energy drinks", "Sports drinks",
        ],
      },
      {
        name: "Juice",
        subcategories: [
          "Orange juice", "Apple juice", "Mango juice", "Fruit blends",
          "Juice concentrates", "Fruit drinks",
        ],
      },
      {
        name: "Hot Drinks",
        subcategories: [
          "Coffee", "Instant coffee", "Ground coffee", "Coffee beans", "Tea", "Rooibos",
          "Green tea", "Herbal tea", "Hot chocolate",
        ],
      },
      {
        name: "Cordials",
        subcategories: ["Cordials", "Squashes", "Milk drinks", "Protein drinks", "Iced tea"],
      },
    ],
  },
  {
    id: "deli",
    name: "Deli & Ready Meals",
    icon: "🍱",
    categories: [
      {
        name: "Hot Foods",
        subcategories: [
          "Cooked chicken", "Rotisserie chicken", "Fried chicken", "Pizza", "Burgers", "Hot dogs",
        ],
      },
      {
        name: "Salads & Platters",
        subcategories: [
          "Sandwiches", "Wraps", "Salads", "Pasta salads", "Potato salad", "Coleslaw",
          "Prepared vegetables", "Sushi", "Platters",
        ],
      },
      {
        name: "Ready Meals",
        subcategories: [
          "Prepared meals", "Lasagne", "Macaroni and cheese", "Curries", "Rice dishes",
        ],
      },
    ],
  },
  {
    id: "specialty",
    name: "Specialty Foods",
    icon: "🌍",
    categories: [
      {
        name: "International",
        subcategories: [
          "Indian foods", "Asian foods", "Mexican foods", "Italian foods",
          "African foods", "Middle Eastern foods",
        ],
      },
      {
        name: "Organic & Health",
        subcategories: [
          "Halal foods", "Kosher foods", "Organic foods", "Vegan foods", "Vegetarian foods", "Health foods",
        ],
      },
      {
        name: "Free From",
        subcategories: [
          "Gluten-free foods", "Sugar-free foods", "Keto products", "Lactose-free foods",
        ],
      },
    ],
  },
  {
    id: "baby",
    name: "Baby",
    icon: "👶",
    categories: [
      {
        name: "Baby Food",
        subcategories: ["Baby cereal", "Baby puree", "Baby meals", "Baby snacks", "Baby formula"],
      },
      {
        name: "Baby Care",
        subcategories: [
          "Nappies", "Baby wipes", "Baby shampoo", "Baby soap", "Baby lotion", "Baby powder",
          "Baby oil", "Baby cream", "Pacifiers", "Bottles", "Bottle accessories",
        ],
      },
    ],
  },
  {
    id: "beauty",
    name: "Health & Beauty",
    icon: "🧴",
    categories: [
      {
        name: "Personal Care",
        subcategories: [
          "Shampoo", "Conditioner", "Body wash", "Soap", "Hand wash", "Deodorant",
          "Body lotion", "Talcum powder", "Hair products", "Hair colour",
        ],
      },
      {
        name: "Oral Care",
        subcategories: ["Toothpaste", "Toothbrushes", "Mouthwash", "Dental floss", "Denture products"],
      },
      {
        name: "Shaving",
        subcategories: ["Razors", "Shaving cream", "Shaving gel", "Aftershave"],
      },
      {
        name: "Feminine Care",
        subcategories: ["Sanitary pads", "Tampons", "Pantyliners", "Feminine wipes"],
      },
      {
        name: "Cosmetics",
        subcategories: [
          "Foundation", "Concealer", "Powder", "Mascara", "Eyeliner", "Lipstick",
          "Nail polish", "Makeup remover",
        ],
      },
    ],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: "💊",
    categories: [
      {
        name: "OTC & Vitamins",
        subcategories: [
          "OTC pain medication", "Cold & flu products", "Allergy products", "Antacids", "Vitamins",
        ],
      },
      {
        name: "First Aid",
        subcategories: [
          "First-aid products", "Bandages", "Plasters", "Antiseptics", "Thermometers",
          "Braces/supports", "Sunscreen", "Insect repellent",
        ],
      },
    ],
  },
  {
    id: "cleaning",
    name: "Household Cleaning",
    icon: "🧽",
    categories: [
      {
        name: "Laundry",
        subcategories: [
          "Washing powder", "Liquid detergent", "Fabric softener", "Stain removers", "Bleach",
        ],
      },
      {
        name: "Kitchen Cleaning",
        subcategories: [
          "Dishwashing liquid", "Dishwasher tablets", "Sponges", "Scouring pads", "Dishwasher salt",
        ],
      },
      {
        name: "General Cleaning",
        subcategories: [
          "Floor cleaner", "Toilet cleaner", "Bathroom cleaner", "Glass cleaner",
          "Multi-purpose cleaner", "Disinfectant", "Degreaser",
        ],
      },
      {
        name: "Cleaning Equipment",
        subcategories: ["Brooms", "Mops", "Buckets", "Brushes", "Dustpans", "Gloves"],
      },
    ],
  },
  {
    id: "paper",
    name: "Paper & Disposables",
    icon: "🧻",
    categories: [
      {
        name: "Paper Products",
        subcategories: [
          "Toilet paper", "Paper towels", "Facial tissues", "Serviettes", "Wet wipes", "Kitchen towels",
        ],
      },
      {
        name: "Wraps & Bags",
        subcategories: [
          "Aluminium foil", "Cling wrap", "Baking paper", "Garbage bags", "Freezer bags", "Sandwich bags",
        ],
      },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen & Household",
    icon: "🍳",
    categories: [
      {
        name: "Tableware",
        subcategories: ["Plates", "Bowls", "Cups", "Mugs", "Glasses", "Cutlery"],
      },
      {
        name: "Cookware",
        subcategories: [
          "Pots", "Pans", "Baking trays", "Kitchen knives", "Chopping boards",
          "Measuring cups", "Kitchen utensils",
        ],
      },
      {
        name: "Storage",
        subcategories: ["Food containers", "Lunch boxes", "Water bottles", "Flasks"],
      },
    ],
  },
  {
    id: "home",
    name: "Home & Storage",
    icon: "🏠",
    categories: [
      {
        name: "Home Storage",
        subcategories: ["Storage boxes", "Baskets", "Hangers", "Laundry baskets"],
      },
      {
        name: "Home Essentials",
        subcategories: [
          "Ironing boards", "Drying racks", "Curtains", "Cushions", "Bedding",
          "Blankets", "Towels", "Pillows", "Mattresses",
        ],
      },
    ],
  },
  {
    id: "hardware",
    name: "Hardware / DIY",
    icon: "🔧",
    categories: [
      {
        name: "Electrical",
        subcategories: ["Light bulbs", "Batteries", "Extension cords", "Plugs", "Adaptors", "Electrical tape"],
      },
      {
        name: "Tools & Fixings",
        subcategories: [
          "Screwdrivers", "Hammers", "Pliers", "Tape measures", "Nails", "Screws",
          "Hooks", "Rope", "Glue", "Super glue", "Locks", "Padlocks", "Basic tools",
        ],
      },
    ],
  },
  {
    id: "garden",
    name: "Garden",
    icon: "🌱",
    categories: [
      {
        name: "Garden Supplies",
        subcategories: [
          "Seeds", "Potting soil", "Compost", "Fertiliser", "Plant food", "Plant pots",
          "Gardening gloves", "Gardening tools", "Watering cans", "Hoses", "Plants",
          "Flowers", "Pest-control products",
        ],
      },
    ],
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    categories: [
      {
        name: "Car Care",
        subcategories: [
          "Car shampoo", "Car wax", "Dashboard cleaner", "Glass cleaner", "Engine cleaner",
          "Sponges", "Microfibre cloths", "Air fresheners", "Car polish",
        ],
      },
      {
        name: "Fluids & Accessories",
        subcategories: [
          "Motor oil", "Coolant", "Brake fluid", "Windscreen washer fluid",
          "Jumper cables", "Basic automotive accessories",
        ],
      },
    ],
  },
  {
    id: "pet",
    name: "Pet",
    icon: "🐶",
    categories: [
      {
        name: "Dog",
        subcategories: [
          "Dog food", "Dog treats", "Dog toys", "Dog shampoo", "Dog bowls", "Dog leads", "Dog collars",
        ],
      },
      {
        name: "Cat",
        subcategories: ["Cat food", "Cat treats", "Cat litter", "Cat toys", "Cat bowls"],
      },
      {
        name: "Other Pets",
        subcategories: [
          "Bird food", "Fish food", "Small-animal food", "Pet bedding", "Pet accessories",
        ],
      },
    ],
  },
  {
    id: "toys",
    name: "Toys & Games",
    icon: "🧸",
    categories: [
      {
        name: "Toys",
        subcategories: [
          "Dolls", "Action figures", "Cars", "Building blocks", "Puzzles", "Outdoor toys",
          "Balls", "Educational toys", "Arts & crafts", "Remote-control toys",
        ],
      },
      {
        name: "Games",
        subcategories: ["Board games", "Card games", "Video games"],
      },
    ],
  },
  {
    id: "stationery",
    name: "Stationery & School",
    icon: "📚",
    categories: [
      {
        name: "Writing",
        subcategories: [
          "Pens", "Pencils", "Erasers", "Sharpeners", "Rulers", "Markers", "Highlighters", "Crayons",
        ],
      },
      {
        name: "Books & Paper",
        subcategories: ["Notebooks", "Exercise books", "Files", "Folders", "Paper", "Glue", "Scissors", "Paint"],
      },
      {
        name: "School Bags",
        subcategories: ["School bags", "Lunch boxes", "Calculators"],
      },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: "👕",
    categories: [
      {
        name: "Apparel",
        subcategories: [
          "T-shirts", "Shirts", "Jeans", "Trousers", "Shorts", "Dresses", "Skirts",
          "Underwear", "Socks", "Jackets", "Hoodies", "School uniforms", "Baby clothing",
          "Children's clothing", "Sleepwear",
        ],
      },
      {
        name: "Footwear",
        subcategories: ["Shoes", "Slippers", "Sandals"],
      },
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "🏋️",
    categories: [
      {
        name: "Sports Equipment",
        subcategories: [
          "Footballs", "Soccer equipment", "Basketballs", "Rugby balls", "Tennis equipment",
          "Running accessories", "Sports bags", "Sports clothing",
        ],
      },
      {
        name: "Fitness",
        subcategories: [
          "Exercise mats", "Dumbbells", "Resistance bands", "Water bottles", "Fitness accessories",
        ],
      },
    ],
  },
  {
    id: "seasonal",
    name: "Seasonal & Party",
    icon: "🎉",
    categories: [
      {
        name: "Party Supplies",
        subcategories: [
          "Birthday decorations", "Balloons", "Party plates", "Party cups", "Candles",
          "Costumes", "Seasonal decorations",
        ],
      },
      {
        name: "Seasonal Events",
        subcategories: [
          "Christmas decorations", "Easter products", "Valentine's products", "Halloween products",
        ],
      },
      {
        name: "Gifts & Cards",
        subcategories: ["Wrapping paper", "Gift bags", "Greeting cards"],
      },
    ],
  },
  {
    id: "flowers",
    name: "Flowers & Gifts",
    icon: "💐",
    categories: [
      {
        name: "Flowers",
        subcategories: ["Fresh flowers", "Bouquets", "Plants"],
      },
      {
        name: "Gifts",
        subcategories: [
          "Gift baskets", "Chocolates", "Gift cards", "Greeting cards",
          "Wrapping paper", "Candles", "Small gifts",
        ],
      },
    ],
  },
];

export function departmentEmoji(name: string) {
  return SUPERMARKET_DEPARTMENTS.find((d) => d.name === name)?.icon ?? "🛒";
}

export function getDepartmentCategoryNames(dept: SupermarketDepartment): string[] {
  return dept.categories.map((c) => c.name);
}

export function findDepartmentByName(name: string) {
  return SUPERMARKET_DEPARTMENTS.find((d) => d.name === name);
}

export function findDepartmentByCategory(category: string) {
  return SUPERMARKET_DEPARTMENTS.find((d) =>
    d.categories.some((c) => c.name === category)
  );
}

export function findCategoryInTaxonomy(category: string) {
  for (const dept of SUPERMARKET_DEPARTMENTS) {
    const cat = dept.categories.find((c) => c.name === category);
    if (cat) return { department: dept, category: cat };
  }
  return undefined;
}

/** Flatten all leaf category names (for filters / admin) */
export function allSupermarketCategoryNames(): string[] {
  return SUPERMARKET_DEPARTMENTS.flatMap((d) => d.categories.map((c) => c.name));
}

export function allSupermarketDepartmentNames(): string[] {
  return SUPERMARKET_DEPARTMENTS.map((d) => d.name);
}
