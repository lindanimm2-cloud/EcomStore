import { StoreSlug } from "./types";

export type StoreAboutContent = {
  headline: string;
  story: string[];
  highlights: { title: string; body: string }[];
  hours: string;
  services: string[];
};

export const STORE_ABOUT: Record<StoreSlug, StoreAboutContent> = {
  supermarket: {
    headline: "Your neighbourhood supermarket on Voortrekker Street",
    story: [
      "Aheers Supermarket is Greytown’s everyday grocery home — fresh produce, butchery, dairy, bakery, pantry staples and household essentials under one roof.",
      "Shop in store or online with Infinity Rewards member pricing, weekly specials, and delivery or click & collect across town.",
    ],
    highlights: [
      { title: "Fresh daily", body: "Produce and bakery deliveries keep the aisles stocked for Greytown kitchens." },
      { title: "Member pricing", body: "Infinity Rewards unlocks cashback and member cuts across the store." },
      { title: "Full catalogue", body: "Thousands of SKUs across departments — from fruit & veg to pharmacy and pet." },
    ],
    hours: "Mon–Sat 08:00–18:00 · Sun 08:00–14:00",
    services: ["In-store shopping", "Online catalogue", "Delivery", "Click & collect", "Infinity Rewards"],
  },
  powertrade: {
    headline: "Bulk cases and hybrid wholesale for traders & households",
    story: [
      "Aheers PowerTrade is Greytown’s cash & carry — deep stock of rice, maize, oil, drinks, cleaning and packaging in trader-ready pack sizes.",
      "Whether you run a spaza, catering kitchen or buy for the home, case pricing and tele-orders make bulk simple.",
    ],
    highlights: [
      { title: "Case pricing", body: "Min-qty discounts on grains, oils, drinks and household staples." },
      { title: "Trade accounts", body: "Open a trade account for repeat orders and outlying delivery." },
      { title: "Hybrid aisle", body: "Wholesale volumes with a retail-friendly shopping experience." },
    ],
    hours: "Mon–Fri 07:30–17:00 · Sat 07:30–14:00",
    services: ["Walk-in cash & carry", "Trade accounts", "Tele-orders", "Bulk delivery", "Packaging supplies"],
  },
  buildsave: {
    headline: "Hardware and DIY for homes and contractors",
    story: [
      "Aheers Hardware (Build & Save) stocks electrical, tools, fasteners, plumbing, paint, adhesives, security, garden and automotive essentials.",
      "Contractors get bulk rates and quote support; homeowners get project-ready stock without leaving Greytown.",
    ],
    highlights: [
      { title: "Contractor rates", body: "Bulk pricing on materials when you buy for the job." },
      { title: "Full yard range", body: "From light bulbs and paint to pipe, fasteners and safety gear." },
      { title: "Quotes", body: "Send a materials list — we’ll price it for your build." },
    ],
    hours: "Mon–Fri 07:30–17:00 · Sat 08:00–13:00",
    services: ["Walk-in yard", "Contractor pricing", "Project quotes", "Site delivery", "Trade support"],
  },
  foodworks: {
    headline: "Fresh food counters with butcher-quality cuts",
    story: [
      "Aheers Foodworks focuses on fresh food — fruit & vegetables, meat & poultry, seafood, dairy, bakery and ready meals for the week ahead.",
      "Member mince, braai packs and weekend specials keep Greytown tables full without the supermarket rush.",
    ],
    highlights: [
      { title: "Butchery", body: "Mince, chops, chicken and braai packs cut for local tastes." },
      { title: "Fresh counters", body: "Produce and seafood with daily turnaround." },
      { title: "Ready meals", body: "Hot and prepared options when cooking from scratch isn’t on." },
    ],
    hours: "Mon–Sat 08:00–18:00 · Sun 08:00–13:00",
    services: ["Butchery counter", "Fresh produce", "Ready meals", "Member specials", "Pickup & delivery"],
  },
  grabngo: {
    headline: "Ready in about 10 minutes — sandwiches, hot food & coffee",
    story: [
      "Aheers Grab n Go is Greytown’s convenience kitchen — sandwiches, wraps, salads, pizza, hot meals, breakfast and barista coffee.",
      "Order ahead in the Super App, track the kitchen, and collect when your name’s up — or walk in for a quick bite.",
    ],
    highlights: [
      { title: "Made today", body: "Fresh rolls, wraps and hot meals prepared on site." },
      { title: "Order ahead", body: "Skip the queue — place an order and collect when ready." },
      { title: "Combos", body: "Coffee and bakery deals that keep the morning simple." },
    ],
    hours: "Mon–Fri 06:30–18:00 · Sat–Sun 07:00–15:00",
    services: ["Walk-in", "Order ahead", "Hot kitchen", "Coffee bar", "Quick delivery"],
  },
};

export const GROUP_ABOUT = {
  headline: "One Greytown group. Five ways to shop.",
  intro: [
    "Aheers is Greytown's multi-format retail group — Supermarket, PowerTrade cash & carry, Hardware, Foodworks, Grab n Go convenience, and Infinity Rewards.",
    "This Super App brings every business together: one account, one rewards card, separate carts per store, and shared delivery operations.",
  ],
  pillars: [
    {
      title: "One account",
      body: "Sign in once — shop any Aheers store with the same profile and order history.",
    },
    {
      title: "Infinity Rewards",
      body: "Earn and redeem across formats. Member prices show wherever they apply.",
    },
    {
      title: "Separate carts",
      body: "Each store keeps its own basket so wholesale, grocery and takeaway never mix.",
    },
    {
      title: "Shared delivery",
      body: "Greytown routes, pickup slots and tracking — coordinated across the group.",
    },
  ],
};
