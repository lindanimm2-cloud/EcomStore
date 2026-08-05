import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { COMPETITIONS, formatDate } from "@/lib/data";
import { Gift } from "lucide-react";

export default function CompetitionsPage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Win with Aheers"
          title="Competitions"
          subtitle="Enter to win — linked to your Infinity Rewards account."
          actions={
            <Link href="/portal" className="rounded-xl bg-aheers-gold px-5 py-2.5 text-sm font-bold text-aheers-green-dark">
              Open rewards portal
            </Link>
          }
        />
        <div className="page-shell py-12">
          <div className="mx-auto grid max-w-4xl gap-5">
            {COMPETITIONS.map((c) => (
              <div key={c.id} className="card-hover overflow-hidden">
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-aheers-green/10 text-aheers-green">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          c.status === "active"
                            ? "bg-aheers-green/10 text-aheers-green"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.status}
                      </span>
                      <h2 className="mt-2 font-display text-xl font-semibold text-aheers-green-dark">{c.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Prize: {c.prize} · Ends {formatDate(c.endsAt)} · {c.entries} entries
                      </p>
                    </div>
                  </div>
                  {c.status === "active" && (
                    <Link href="/portal" className="btn-primary shrink-0">
                      Enter now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
