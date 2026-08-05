import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { ArrowRight } from "lucide-react";

const ROLES = [
  "Cashiers & floor staff",
  "Pickers & packers",
  "Delivery drivers",
  "Hardware & PowerTrade sales",
  "Kitchen (Grab n Go)",
];

export default function CareersPage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Join the team"
          title="Careers at Aheers"
          subtitle="Join our Greytown teams across supermarket, wholesale, hardware and convenience."
        />
        <div className="page-shell max-w-3xl py-12">
          <ul className="space-y-3">
            {ROLES.map((r) => (
              <li key={r} className="card-hover flex items-center justify-between gap-4 p-5">
                <span className="font-display text-lg font-semibold text-aheers-green-dark">{r}</span>
                <Link href="/contact?topic=careers" className="inline-flex items-center gap-1 text-sm font-semibold text-aheers-green">
                  Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
