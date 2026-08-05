import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { StoreSelectorGrid, RewardsSummaryBar } from "@/components/super-app";
import { SectionHeading } from "@/components/page-hero";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/products";
import { ArrowRight, Truck, Users, ShoppingBag, MapPin, Smartphone, Shield } from "lucide-react";

const SPECIALS = PRODUCTS.filter((p) => p.badge === "Special" || p.badge === "Flash" || p.memberPrice).slice(0, 4);
const FLASH = PRODUCTS.filter((p) => p.badge === "Hot" || p.badge === "Popular" || p.badge === "Best Seller").slice(0, 4);
const POPULAR = PRODUCTS.filter((p) => p.storeSlug === "supermarket").slice(0, 4);

export default function HomePage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <section className="relative min-h-[78vh] overflow-hidden text-white">
          <div className="hero-mesh absolute inset-0" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="absolute -right-20 top-10 h-72 w-72 animate-float rounded-full bg-aheers-gold/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-aheers-green-light/30 blur-3xl" />

          <div className="page-shell relative flex min-h-[78vh] flex-col justify-center py-20">
            <div className="max-w-3xl animate-fade-up">
              <p className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Aheers
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-snug text-white/95 md:text-4xl">
                One app. All stores. One rewards card.
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/75 md:text-lg">
                Shop Supermarket, PowerTrade, Hardware and Grab n Go with Infinity Rewards —
                delivery and pickup built for Greytown.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/store/supermarket"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-aheers-green-dark shadow-lift transition hover:-translate-y-0.5 hover:bg-aheers-mist"
                >
                  Start shopping
                </Link>
                <Link
                  href="/specials"
                  className="rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  Weekly specials
                </Link>
                <Link
                  href="/delivery"
                  className="rounded-xl border border-white/35 bg-transparent px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Delivery info
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell relative z-10 -mt-8">
          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <RewardsSummaryBar />
          </div>
        </section>

        <section className="page-shell py-14 md:py-16">
          <SectionHeading
            label="This week"
            title="Specials & flash deals"
            subtitle="Member pricing and hot offers across Aheers"
            action={
              <Link href="/specials" className="btn-ghost">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...SPECIALS, ...FLASH].slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="border-y border-aheers-green/10 bg-white/50 py-14">
          <div className="page-shell">
            <SectionHeading
              label="Favourites"
              title="Popular in Supermarket"
              subtitle="Continue shopping everyday essentials"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {POPULAR.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-16">
          <div className="mb-10 text-center">
            <p className="section-label">Your stores</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-aheers-green-dark">
              Choose where to shop
            </h2>
            <p className="mx-auto mt-3 max-w-lg prose-muted">
              Separate carts per business — switch anytime without mixing baskets.
            </p>
          </div>
          <StoreSelectorGrid />
        </section>

        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-aheers-green-dark via-aheers-green to-aheers-green-light" />
          <div className="page-shell relative grid gap-6 text-white md:grid-cols-3">
            {[
              { href: "/recipes", title: "Recipes", desc: "Meal ideas with products from Aheers shelves." },
              { href: "/competitions", title: "Competitions", desc: "Enter giveaways and win shopping vouchers." },
              { href: "/track-order", title: "Track order", desc: "Live delivery ETA and kitchen status." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              >
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-aheers-gold">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-shell py-16">
          <div className="mb-10 text-center">
            <p className="section-label">Operations</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-aheers-green-dark">
              One CRM. One inventory. Four businesses.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: "CRM & Rewards", href: "/admin/customers" },
              { icon: ShoppingBag, title: "Orders & Stock", href: "/admin/inventory" },
              { icon: Truck, title: "Fleet Tracker", href: "/admin/fleet" },
              { icon: MapPin, title: "Client Portal", href: "/portal" },
            ].map(({ icon: Icon, title, href }) => (
              <Link key={title} href={href} className="card-hover p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-aheers-green text-white shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-aheers-green-dark">{title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-aheers-green/10 bg-white/40 py-10">
          <div className="page-shell flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-aheers-green" /> Mobile-first</span>
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-aheers-green" /> POPIA ready</span>
            <span>PayFast · Ozow · Yoco</span>
            <Link href="/about" className="font-semibold text-aheers-green hover:underline">About Aheers →</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
