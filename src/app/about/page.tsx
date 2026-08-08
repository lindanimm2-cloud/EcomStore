import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { GROUP_ABOUT } from "@/lib/store-about";
import { STORES } from "@/lib/stores";
import { storeHomePath } from "@/lib/store-paths";

export default function AboutPage() {
  return (
    <>
      <StoreSwitcher />
      <main className="pb-16">
        <PageHero
          eyebrow="Greytown · KZN"
          title="About Aheers"
          subtitle={GROUP_ABOUT.headline}
          actions={
            <>
              <Link href="/" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-aheers-green-dark shadow-lift">
                Shop now
              </Link>
              <Link
                href="/careers"
                className="rounded-xl border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Careers
              </Link>
            </>
          }
        />

        <div className="page-shell -mt-6 relative z-10">
          <div className="rounded-2xl border border-aheers-green/10 bg-white p-6 shadow-soft md:p-10">
            <p className="section-label">The group</p>
            <div className="mt-3 max-w-3xl space-y-4 text-[15px] leading-relaxed text-gray-600 md:text-base">
              {GROUP_ABOUT.intro.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-aheers-green" />
              93 Voortrekker Street · Greytown, 3250
            </div>
          </div>
        </div>

        <section className="page-shell mt-12">
          <p className="section-label">How the Super App works</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-aheers-green-dark md:text-3xl">
            Built for every Aheers format
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {GROUP_ABOUT.pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-aheers-green/10 bg-white p-5 md:p-6"
              >
                <h3 className="font-display text-lg font-semibold text-aheers-green-dark">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-shell mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-label">Our stores</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-aheers-green-dark md:text-3xl">
                Meet each business
              </h2>
            </div>
            <Link href="/contact" className="text-sm font-semibold text-aheers-green hover:underline">
              Contact the group →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STORES.map((s) => (
              <article
                key={s.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-aheers-green/10 bg-white shadow-[0_6px_24px_rgba(13,61,38,0.04)]"
              >
                <div className={`px-5 py-4 text-white ${s.accentBg}`}>
                  <span className="text-2xl">{s.icon}</span>
                  <h3 className="mt-2 font-display text-xl font-semibold">{s.name}</h3>
                  <p className="mt-1 text-xs text-white/75">{s.tagline}</p>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {s.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/store/${s.slug}/about`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-aheers-green hover:underline"
                    >
                      About {s.shortName} <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={storeHomePath(s.slug)}
                      className="text-sm font-semibold text-gray-400 hover:text-aheers-green"
                    >
                      Shop
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell mt-14">
          <div className="overflow-hidden rounded-2xl bg-aheers-green-dark px-6 py-10 text-white md:px-10">
            <p className="font-display text-2xl font-semibold md:text-3xl">Join the team in Greytown</p>
            <p className="mt-2 max-w-xl text-sm text-white/75">
              From floor staff to drivers and trade support — careers across the Aheers group.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/careers"
                className="rounded-xl bg-aheers-gold px-5 py-2.5 text-sm font-bold text-aheers-green-dark"
              >
                View careers
              </Link>
              <Link
                href="/portal"
                className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold"
              >
                Infinity Rewards
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
