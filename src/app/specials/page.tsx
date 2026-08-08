import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/products";
import { getStore } from "@/lib/stores";

export default function SpecialsPage() {
  const specials = PRODUCTS.filter(
    (p) => p.badge || p.memberPrice || (p.bulkPrice && p.bulkPrice < p.price)
  );

  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Limited time"
          title="Weekly specials"
          subtitle="Flash deals, member pricing and trade offers across all Aheers businesses."
          actions={
            <Link href="/" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-aheers-green-dark shadow-soft">
              Shop supermarket
            </Link>
          }
        />
        <div className="page-shell py-12">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
            {specials.map((p) => (
              <div key={p.id} className="animate-fade-up">
                <p className="mb-1.5 truncate text-[10px] font-semibold uppercase tracking-wider text-aheers-green sm:mb-2 sm:text-xs">
                  {getStore(p.storeSlug)?.shortName}
                </p>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
