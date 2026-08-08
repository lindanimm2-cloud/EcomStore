import { formatCurrency } from "./data";
import { PRODUCTS, getCategories, getDepartments } from "./products";
import { STORES } from "./stores";
import { STORE_ABOUT, GROUP_ABOUT } from "./store-about";
import { StoreSlug, Product } from "./types";
import {
  aboutPath,
  cataloguePath,
  departmentsPath,
  productPath,
  storeHomePath,
} from "./store-paths";

export type AssistantLink = { label: string; href: string };

export type AssistantReply = {
  text: string;
  links?: AssistantLink[];
};

export const ASSISTANT_QUICK_CHIPS: { label: string; prompt: string }[] = [
  { label: "How it works", prompt: "How does the app work?" },
  { label: "Delivery", prompt: "How does delivery work?" },
  { label: "Store hours", prompt: "What are the store hours?" },
  { label: "Track order", prompt: "How do I track my order?" },
  { label: "Rewards", prompt: "How do Infinity Rewards work?" },
  { label: "Specials", prompt: "Where are this week's specials?" },
  { label: "Contacts", prompt: "What are the store phone numbers?" },
  { label: "Find product", prompt: "Help me find a product" },
  { label: "Talk to human", prompt: "talk to human" },
];

function money(n: number) {
  return formatCurrency(n);
}

function storeBySlug(slug: string) {
  return STORES.find((s) => s.slug === slug);
}

function detectStore(input: string): StoreSlug | undefined {
  const t = input.toLowerCase();
  if (/power\s*trade|wholesale|cash\s*&\s*carry|bulk/.test(t)) return "powertrade";
  if (/hardware|build\s*&?\s*save|buildsave|diy|paint|plumber/.test(t)) return "buildsave";
  if (/food\s*works|butcher|meat counter|seafood/.test(t)) return "foodworks";
  if (/grab\s*n\s*go|grabngo|takeaway|sandwich|coffee|pizza/.test(t)) return "grabngo";
  if (/supermarket|grocery|aisle/.test(t)) return "supermarket";
  return undefined;
}

function searchProducts(query: string, limit = 4): Product[] {
  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "you", "stock", "have", "sell", "want", "need", "find", "price", "cost", "about", "with"].includes(w));
  if (words.length === 0) return [];

  const scored = PRODUCTS.map((p) => {
    const hay = `${p.name} ${p.category} ${p.department ?? ""} ${p.brand ?? ""} ${p.description}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (hay.includes(w)) score += w.length > 4 ? 3 : 2;
      if (p.name.toLowerCase().includes(w)) score += 2;
    }
    if (p.inStock <= 0) score -= 1;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.p);
}

function productLine(p: Product): string {
  const store = storeBySlug(p.storeSlug)?.shortName ?? p.storeSlug;
  const member = p.memberPrice != null ? ` · member ${money(p.memberPrice)}` : "";
  const bulk =
    p.bulkPrice != null && p.minQty
      ? ` · bulk ${money(p.bulkPrice)} (min ${p.minQty})`
      : "";
  const stock = p.inStock > 0 ? "in stock" : "low / check in store";
  return `${p.image} ${p.name} — ${money(p.price)}${member}${bulk} · ${store} · ${stock}`;
}

function storeCard(slug: StoreSlug): AssistantReply {
  const store = storeBySlug(slug)!;
  const about = STORE_ABOUT[slug];
  const cats = getCategories(slug).slice(0, 6).join(", ");
  const depts = getDepartments(slug);
  return {
    text: [
      `${store.icon} ${store.name}`,
      store.tagline,
      "",
      `📍 ${store.address}`,
      `☎ ${store.phone}`,
      `🕒 ${about.hours}`,
      store.delivery ? "🚚 Delivery available" : "",
      store.pickup ? "🛒 Click & collect / pickup available" : "",
      about.services.length ? `Services: ${about.services.join(" · ")}` : "",
      depts.length ? `Departments include: ${depts.slice(0, 5).join(", ")}…` : `Popular aisles: ${cats}`,
      store.promotion ? `Promo: ${store.promotion}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    links: [
      { label: `Shop ${store.shortName}`, href: storeHomePath(slug) },
      { label: "Departments", href: departmentsPath(slug) },
      { label: "Catalogue", href: cataloguePath(slug) },
      { label: "About & hours", href: aboutPath(slug) },
    ],
  };
}

function allStoresOverview(): AssistantReply {
  const lines = STORES.map(
    (s) => `${s.icon} ${s.shortName} — ${s.tagline} · ☎ ${s.phone}`
  );
  return {
    text: [
      GROUP_ABOUT.headline,
      GROUP_ABOUT.intro[0],
      "",
      ...lines,
      "",
      "One Infinity Rewards account works across all five. Each store keeps its own cart.",
    ].join("\n"),
    links: [
      { label: "All stores", href: "/" },
      { label: "About Aheers", href: "/about" },
      { label: "Rewards / Portal", href: "/portal" },
      { label: "Delivery info", href: "/delivery" },
    ],
  };
}

function howAppWorks(): AssistantReply {
  return {
    text: [
      "How the Aheers Super App works:",
      "1. Pick a store (top Store menu or Home).",
      "2. Browse departments → categories → products.",
      "3. Add to that store’s cart (carts never mix).",
      "4. Checkout for delivery or pickup.",
      "5. Track with Track Order or My Account → Deliveries.",
      "6. Earn Infinity Rewards cashback on qualifying buys.",
      "",
      "Need a person? Say “talk to human” and an agent can join this chat.",
    ].join("\n"),
    links: [
      { label: "Home", href: "/" },
      { label: "Track order", href: "/track-order" },
      { label: "My account", href: "/portal" },
      { label: "Delivery", href: "/delivery" },
    ],
  };
}

/** Customer-facing assistant reply for any store / product / ops scenario. */
export function getAssistantReply(input: string, activeStore?: StoreSlug | null): AssistantReply {
  const text = input.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return { text: "Ask me about a product, store hours, delivery, rewards, or say “talk to human”." };
  }

  if (/talk to (a )?human|live (agent|chat|support)|speak to (someone|a person|agent)|real person|customer (care|service)/i.test(lower)) {
    return {
      text: [
        "Connecting you to an agent… They’ll reply in this chat.",
        "While you wait you can also call, email, or WhatsApp:",
        "☎ Switchboard 033 413 1156",
        "✉ support@aheers.co.za",
        "WhatsApp 066 529 0079",
      ].join("\n"),
      links: [
        { label: "Call switchboard", href: "tel:0334131156" },
        { label: "Email support", href: "mailto:support@aheers.co.za?subject=Aheers%20help" },
        { label: "WhatsApp Aheers", href: "https://wa.me/27665290079?text=Hi%20Aheers%20%E2%80%94%20I%20need%20help" },
        { label: "All contacts", href: "/contact" },
        { label: "Track order", href: "/track-order" },
      ],
    };
  }

  if (/^(hi|hello|hey|howzit|good (morning|afternoon|evening))\b/i.test(lower)) {
    return {
      text: "Hi! I’m the Aheers assistant — I know all five Greytown stores, products, hours, delivery, rewards and tracking. What do you need?",
      links: [
        { label: "Stores", href: "/" },
        { label: "Specials", href: "/specials" },
        { label: "Delivery", href: "/delivery" },
      ],
    };
  }

  if (
    /help me find (a )?product|find (a |me a )?product|search (for )?(a )?product|how (do i|to) find|product search|look(ing)? (something|a product) up/i.test(
      lower
    )
  ) {
    const store = activeStore ? storeBySlug(activeStore) : undefined;
    return {
      text: [
        "Type the product name or brand in the chat — e.g. “bread”, “paint”, “chicken thighs”, “Iwisa”, “coffee”.",
        "I’ll search the live catalogue across all five stores (or the one you’re shopping).",
        store ? `You’re on ${store.shortName} — I can also open that catalogue.` : "Or browse Departments / Catalogue from the links below.",
      ].join("\n"),
      links: [
        ...(activeStore
          ? [
              { label: "Departments", href: departmentsPath(activeStore) },
              { label: "Catalogue", href: cataloguePath(activeStore) },
            ]
          : [
              { label: "Supermarket", href: cataloguePath("supermarket") },
              { label: "All stores", href: "/" },
            ]),
        { label: "Specials", href: "/specials" },
      ],
    };
  }

  if (/how (does|do) (the )?(app|store|shopping)|how (to|do i) (shop|order|use)/i.test(lower) || /how (it|this) works/.test(lower)) {
    return howAppWorks();
  }

  if (/supermarket.*(work|shop|order)|how.*(supermarket)/.test(lower)) {
    return {
      text: [
        "Aheers Supermarket — everyday groceries on Voortrekker Street.",
        "Browse Departments → categories → products, add to the Supermarket cart, then checkout for delivery or click & collect.",
        `Hours: ${STORE_ABOUT.supermarket.hours}`,
        `☎ ${storeBySlug("supermarket")!.phone}`,
        "Member prices appear when you’re signed in. Recipes suggest meals you can add to cart.",
      ].join("\n"),
      links: [
        { label: "Supermarket", href: storeHomePath("supermarket") },
        { label: "Departments", href: departmentsPath("supermarket") },
        { label: "Recipes", href: "/recipes" },
        { label: "About", href: aboutPath("supermarket") },
      ],
    };
  }

  if (/power\s*trade.*(work|shop|order|account)|how.*(power\s*trade|wholesale)/.test(lower)) {
    return {
      text: [
        "PowerTrade — cash & carry / hybrid wholesale on Durban Street.",
        "Buy cases with min-qty bulk prices. Trade accounts unlock tele-orders, credit and outlying delivery.",
        `Hours: ${STORE_ABOUT.powertrade.hours}`,
        `☎ ${storeBySlug("powertrade")!.phone}`,
        "Cart is separate from supermarket — checkout PowerTrade on its own.",
      ].join("\n"),
      links: [
        { label: "PowerTrade", href: storeHomePath("powertrade") },
        { label: "Case catalogue", href: cataloguePath("powertrade") },
        { label: "Trade login", href: "/login/trade" },
      ],
    };
  }

  if (/hardware.*(work|shop|quote)|build\s*&?\s*save|how.*(hardware|diy)/.test(lower)) {
    return {
      text: [
        "Aheers Hardware (Build & Save) — tools, paint, plumbing, electrical, fasteners and more.",
        "Browse the catalogue, ask for a project quote, or request site delivery for loads.",
        `Hours: ${STORE_ABOUT.buildsave.hours}`,
        `☎ ${storeBySlug("buildsave")!.phone}`,
      ].join("\n"),
      links: [
        { label: "Hardware", href: storeHomePath("buildsave") },
        { label: "Catalogue", href: cataloguePath("buildsave") },
        { label: "About", href: aboutPath("buildsave") },
      ],
    };
  }

  if (/food\s*works.*(work|shop)|how.*(butcher|foodworks)/.test(lower)) {
    return {
      text: [
        "Foodworks — fresh counters: produce, meat, seafood, dairy and bakery.",
        "Order online for pickup/delivery or visit the butchery for custom cuts. Weekend meat specials are common.",
        `Hours: ${STORE_ABOUT.foodworks.hours}`,
        `☎ ${storeBySlug("foodworks")!.phone}`,
      ].join("\n"),
      links: [
        { label: "Foodworks", href: storeHomePath("foodworks") },
        { label: "Catalogue", href: cataloguePath("foodworks") },
        { label: "Specials", href: "/specials" },
      ],
    };
  }

  if (/grab\s*n\s*go.*(work|order)|how.*(grab|takeaway|order ahead)/.test(lower)) {
    return {
      text: [
        "Grab n Go — kitchen ready in ~10 minutes.",
        "Order ahead from the menu (sandwiches, wraps, pizza, coffee, hot meals), collect when called, or request quick delivery.",
        `Hours: ${STORE_ABOUT.grabngo.hours}`,
        `☎ / WhatsApp: ${storeBySlug("grabngo")!.phone}`,
      ].join("\n"),
      links: [
        { label: "Grab n Go", href: storeHomePath("grabngo") },
        { label: "Full menu", href: cataloguePath("grabngo") },
        { label: "Specials", href: "/specials" },
      ],
    };
  }

  if (/all stores|which stores|list (of )?stores|aheers group/.test(lower)) {
    return allStoresOverview();
  }

  const storeHit = detectStore(lower) ?? (/(hours|open|address|phone|contact|where are you)/.test(lower) ? activeStore ?? undefined : undefined);
  if (storeHit && /(hour|open|close|address|phone|contact|where|about|tell me about)/.test(lower)) {
    return storeCard(storeHit);
  }
  if (detectStore(lower) && text.split(/\s+/).length <= 4) {
    return storeCard(detectStore(lower)!);
  }

  if (/hour|open|closing|when.*open|trading hours/.test(lower)) {
    const lines = STORES.map((s) => `${s.shortName}: ${STORE_ABOUT[s.slug].hours}`);
    return {
      text: ["Trading hours (Greytown):", ...lines, "", "Public holidays may differ — call the store line if unsure."].join("\n"),
      links: STORES.map((s) => ({ label: s.shortName, href: aboutPath(s.slug) })),
    };
  }

  if (/phone|contact|call|whatsapp|number|email|e-mail/.test(lower)) {
    const active = activeStore ? storeBySlug(activeStore) : undefined;
    return {
      text: [
        "Aheers contact details:",
        ...STORES.map((s) => `${s.shortName}: ${s.phone}`),
        "Group switchboard: 033 413 1156",
        "Email: support@aheers.co.za · trade@aheers.co.za",
        "WhatsApp: 066 529 0079",
        active ? `You’re near ${active.shortName} — tap Call ${active.shortName} below.` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      links: [
        ...(active
          ? [{ label: `Call ${active.shortName}`, href: `tel:${active.phone.replace(/\s/g, "")}` }]
          : []),
        { label: "Call switchboard", href: "tel:0334131156" },
        { label: "Email support", href: "mailto:support@aheers.co.za" },
        { label: "Email trade", href: "mailto:trade@aheers.co.za" },
        { label: "WhatsApp", href: "https://wa.me/27665290079" },
        { label: "Contact page", href: "/contact" },
      ],
    };
  }

  if (/deliver|pickup|collect|click.?collect|slot|coverage|outlying/.test(lower)) {
    return {
      text: [
        "Delivery & pickup:",
        "• Book a slot on Delivery — coverage is Greytown and nearby areas.",
        "• PowerTrade can deliver bulk / outlying orders (tele-order too).",
        "• Hardware offers site delivery for project loads.",
        "• Grab n Go is fast pickup (~10 min) or quick delivery.",
        "• Each store cart checks out separately.",
        "Track live status with Track Order (try ORD-1043 in the demo).",
      ].join("\n"),
      links: [
        { label: "Delivery & slots", href: "/delivery" },
        { label: "Track order", href: "/track-order" },
        { label: "Live · ORD-1043", href: "/order/ORD-1043/track" },
        { label: "My deliveries", href: "/portal/deliveries" },
      ],
    };
  }

  if (/track|eta|where.*(order|driver)|fleet/.test(lower)) {
    return {
      text: "Track any order with Track Order (try ORD-1043). Active orders open live map tracking; past orders open the order details page.",
      links: [
        { label: "Track order", href: "/track-order" },
        { label: "Live · ORD-1043", href: "/order/ORD-1043/track" },
        { label: "My deliveries", href: "/portal/deliveries" },
      ],
    };
  }

  if (/reward|cashback|points|infinity|loyalty|member price/.test(lower)) {
    return {
      text: [
        "Infinity Rewards:",
        "• Earn ~1% cashback on qualifying purchases across Aheers stores.",
        "• Member prices show when you’re signed in.",
        "• Digital card, wallet and points live in My Account / Portal.",
        "• One account · all five formats.",
      ].join("\n"),
      links: [
        { label: "My rewards", href: "/portal" },
        { label: "Sign in", href: "/login/customer?next=/portal" },
      ],
    };
  }

  if (/special|deal|promo|discount|sale/.test(lower)) {
    return {
      text: "Weekly specials and member deals are on the Specials page. Store home banners also highlight the current promo (e.g. Grab n Go coffee combo, Hardware contractor deals).",
      links: [
        { label: "Specials", href: "/specials" },
        { label: "Supermarket", href: storeHomePath("supermarket") },
      ],
    };
  }

  if (/trade account|credit|rfq|wholesale account|business login/.test(lower)) {
    return {
      text: "PowerTrade trade accounts unlock case pricing, tele-orders and credit (subject to approval). Use Trade login for RFQ and account tools, or ask staff to open an account in store.",
      links: [
        { label: "PowerTrade", href: storeHomePath("powertrade") },
        { label: "Trade login", href: "/login/trade" },
        { label: "About PowerTrade", href: aboutPath("powertrade") },
      ],
    };
  }

  if (/quote|contractor|site visit|materials list/.test(lower)) {
    return {
      text: "Hardware (Build & Save) quotes project lists for contractors and DIY. Browse the hardware catalogue online, or talk to a human with your materials list for a priced pack.",
      links: [
        { label: "Hardware store", href: storeHomePath("buildsave") },
        { label: "Catalogue", href: cataloguePath("buildsave") },
      ],
    };
  }

  if (/order ahead|ready in|kitchen|menu/.test(lower) && (detectStore(lower) === "grabngo" || /grab|coffee|sandwich|pizza/.test(lower))) {
    return {
      text: "Grab n Go: order ahead in the app, kitchen prep ~10 minutes, then collect or request quick delivery. Combos (e.g. coffee + scone) show on Specials and the Grab n Go home.",
      links: [
        { label: "Grab n Go", href: storeHomePath("grabngo") },
        { label: "Full menu", href: cataloguePath("grabngo") },
      ],
    };
  }

  if (/cart|checkout|pay|payment|eft|card/.test(lower)) {
    return {
      text: "Carts are per store. Open Cart from the bottom nav or the green cart bar → Checkout. Demo payments accept card / EFT style flows; guest checkout can track with your order ref. Sign in to save address and rewards.",
      links: [
        { label: activeStore ? `Cart` : "Stores", href: activeStore ? `/store/${activeStore}/cart` : "/" },
        { label: "Sign in", href: "/login/customer" },
      ],
    };
  }

  if (/return|refund|wrong item|damaged|complaint|missing/.test(lower)) {
    return {
      text: "For returns, missing or damaged items: keep your order number, photo if useful, then Talk to human here, WhatsApp, or call the store that fulfilled the order. Service Counter can raise a ticket in Aheers App.",
      links: [
        { label: "Track order", href: "/track-order" },
        { label: "My account", href: "/portal" },
      ],
    };
  }

  if (/recipe|cook|meal idea/.test(lower)) {
    return {
      text: "Supermarket Recipes suggest meals using products you can add to cart. Open Recipes from Services or the recipes page.",
      links: [{ label: "Recipes", href: "/recipes" }, { label: "Supermarket", href: "/" }],
    };
  }

  if (/password|login|sign in|otp|account|register/.test(lower)) {
    return {
      text: "Customer portal: /login/customer — demo password aheers123, OTP 123456. Register creates a new profile. One login shops all stores and shows Infinity Rewards.",
      links: [
        { label: "Customer login", href: "/login/customer" },
        { label: "Register", href: "/register" },
        { label: "Portal", href: "/portal" },
      ],
    };
  }

  if (/parking|where (is|are) you|direction|map|greytown|address/.test(lower) && !detectStore(lower)) {
    return {
      text: [
        "All Aheers formats are in Greytown, KZN:",
        ...STORES.map((s) => `${s.shortName}: ${s.address}`),
        "Street parking near Voortrekker / Durban Street — call ahead for large hardware loads.",
      ].join("\n"),
      links: [
        { label: "All stores", href: "/" },
        { label: "About Aheers", href: "/about" },
      ],
    };
  }

  if (/competition|win|prize|lucky draw/.test(lower)) {
    return {
      text: "Active competitions live in My Account / Portal — enter while signed in. Demo entries save on this device.",
      links: [{ label: "Portal / competitions", href: "/portal" }],
    };
  }

  if (/minimum order|min order|free delivery/.test(lower)) {
    return {
      text: "Delivery fees and minimums depend on store and slot — see Delivery for coverage. PowerTrade bulk and Hardware site loads are quoted separately. Grab n Go has low/no min for quick runs in town.",
      links: [
        { label: "Delivery", href: "/delivery" },
        { label: "Track order", href: "/track-order" },
      ],
    };
  }

  // Product search — if query looks like shopping intent or matches catalogue
  const productHits = searchProducts(lower);
  if (
    productHits.length > 0 &&
    (/stock|price|buy|sell|have|find|looking|need|want|cost|available|aisle|product|\bdo you\b/i.test(lower) ||
      productHits[0] && searchProducts(lower, 1)[0]?.name.toLowerCase().split(/\s+/).some((w) => w.length > 3 && lower.includes(w.toLowerCase())))
  ) {
    const links: AssistantLink[] = productHits.map((p) => ({
      label: p.name.slice(0, 28),
      href: productPath(p.storeSlug, p.id),
    }));
    const store = detectStore(lower);
    if (store) {
      links.push({ label: `${storeBySlug(store)?.shortName} catalogue`, href: cataloguePath(store) });
    }
    return {
      text: ["Here’s what I found in the live catalogue:", ...productHits.map(productLine), "", "Tap a product link, or ask for another item / brand."].join("\n"),
      links: links.slice(0, 6),
    };
  }

  // Soft product search fallback when a clear noun matches
  if (productHits.length > 0 && text.split(/\s+/).length <= 6) {
    return {
      text: ["Matching products:", ...productHits.map(productLine)].join("\n"),
      links: productHits.map((p) => ({ label: p.name.slice(0, 28), href: productPath(p.storeSlug, p.id) })),
    };
  }

  if (activeStore) {
    const s = storeBySlug(activeStore)!;
    return {
      text: `I can help with ${s.shortName} products, hours (${STORE_ABOUT[activeStore].hours}), delivery, rewards, or tracking. Try a product name, or say “talk to human”.`,
      links: [
        { label: "Departments", href: departmentsPath(activeStore) },
        { label: "Catalogue", href: cataloguePath(activeStore) },
        { label: "About", href: aboutPath(activeStore) },
        { label: "Delivery", href: "/delivery" },
      ],
    };
  }

  return {
    text: "I can look up products across all Aheers stores, hours, contacts, delivery, rewards, specials and tracking. Try a product name, “PowerTrade hours”, or “talk to human”.",
    links: [
      { label: "Stores", href: "/" },
      { label: "Specials", href: "/specials" },
      { label: "Track order", href: "/track-order" },
      { label: "Delivery", href: "/delivery" },
    ],
  };
}

/** Short “thinking” pause before typewriter starts */
export function thinkingDelayMs(replyText: string) {
  const base = 480;
  const perChar = Math.min(replyText.length * 4, 700);
  return base + perChar;
}

/** @deprecated use thinkingDelayMs — kept for any older imports */
export function typingDelayMs(replyText: string) {
  return thinkingDelayMs(replyText);
}
