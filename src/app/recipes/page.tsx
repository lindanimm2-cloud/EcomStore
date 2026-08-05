import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { Clock, Users, ChefHat } from "lucide-react";

const RECIPES = [
  {
    title: "Weeknight chicken tray bake",
    time: "45 min",
    serves: "4",
    blurb: "One-pan comfort with pantry staples from the supermarket aisle.",
    visual: "🍗",
    tone: "from-[#2a4a3a] via-[#3d6b4f] to-[#c9a227]/70",
    uses: ["Fresh Chicken Whole", "Baby Potatoes", "All Gold Tomato Sauce"],
    href: "/store/supermarket",
    store: "Supermarket",
  },
  {
    title: "Trader breakfast special",
    time: "15 min",
    serves: "1",
    blurb: "Grab n Go fuel before the trading day — ready when you are.",
    visual: "🍳",
    tone: "from-[#0d4f48] via-[#00897b] to-[#4db6ac]/60",
    uses: ["Full English Breakfast", "Cappuccino Large"],
    href: "/store/grabngo",
    store: "Grab n Go",
  },
  {
    title: "Weekend braai sides",
    time: "30 min",
    serves: "6",
    blurb: "Fresh fruit and bread sides for a Greytown weekend fire.",
    visual: "🔥",
    tone: "from-[#1b3d2a] via-[#1b5e3b] to-[#5a7a3a]/50",
    uses: ["Golden Delicious Apples", "Bananas", "White Bread Loaf"],
    href: "/store/supermarket",
    store: "Supermarket",
  },
];

export default function RecipesPage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="From shelf to table"
          title="Recipes"
          subtitle="Meal ideas linked to products available at Aheers — shop the ingredients in one tap."
          actions={
            <Link href="/store/supermarket" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-aheers-green-dark shadow-soft transition hover:bg-aheers-mist">
              Shop supermarket
            </Link>
          }
        />

        <div className="page-shell py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RECIPES.map((r, i) => (
              <article
                key={r.title}
                className="card-hover group flex flex-col overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`relative flex h-44 items-end bg-gradient-to-br ${r.tone} p-5`}>
                  <span className="absolute right-4 top-4 animate-float text-6xl drop-shadow-lg opacity-90">
                    {r.visual}
                  </span>
                  <div className="relative z-10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{r.store}</p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-white">{r.title}</h2>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="prose-muted text-sm">{r.blurb}</p>
                  <div className="mt-4 flex gap-4 text-xs font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-aheers-green" /> {r.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-aheers-green" /> Serves {r.serves}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <ChefHat className="h-3.5 w-3.5" /> Ingredients
                    </p>
                    <ul className="space-y-1.5">
                      {r.uses.map((u) => (
                        <li key={u} className="rounded-lg bg-aheers-mist px-3 py-1.5 text-sm text-aheers-charcoal">
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={r.href} className="btn-primary mt-6 w-full">
                    Shop ingredients
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
