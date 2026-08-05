import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Greytown · KZN"
          title="About Aheers"
          subtitle="Fresh quality, unbeatable prices, and neighbourhood service under one digital ecosystem."
        />
        <div className="page-shell max-w-3xl py-12">
          <div className="surface space-y-5 p-8">
            <p className="prose-muted leading-relaxed">
              Aheers is Greytown&apos;s multi-format retail group — Supermarket, PowerTrade cash &amp; carry,
              Hardware, Grab n Go convenience, and Infinity Rewards.
            </p>
            <p className="prose-muted leading-relaxed">
              This Super App brings every business together: one account, one rewards card, separate carts
              per store, and shared delivery operations.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/store/supermarket" className="btn-primary">
                Shop now
              </Link>
              <Link href="/careers" className="btn-secondary">
                Careers
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
