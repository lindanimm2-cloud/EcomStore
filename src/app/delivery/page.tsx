import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { Truck, Store, Clock, MapPin } from "lucide-react";

const OPTIONS = [
  { icon: Truck, title: "Home delivery", desc: "Same-day and scheduled slots across Greytown", accent: "bg-aheers-green" },
  { icon: Store, title: "Click & collect", desc: "Order online, pick up in store", accent: "bg-aheers-green-light" },
  { icon: Clock, title: "Express (Grab n Go)", desc: "Ready in ~10 minutes", accent: "bg-grabngo-teal" },
  { icon: MapPin, title: "Business delivery", desc: "PowerTrade truck scheduling & POD", accent: "bg-powertrade-orange" },
];

export default function DeliveryPage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Fulfilment"
          title="Delivery"
          subtitle="Sixty60-style fulfilment — delivery, collect, curbside, express and wholesale trucks."
          actions={
            <>
              <Link href="/store/supermarket" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-aheers-green-dark">
                Start an order
              </Link>
              <Link href="/track-order" className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white">
                Track order
              </Link>
            </>
          }
        />
        <div className="page-shell py-12">
          <div className="grid gap-5 sm:grid-cols-2">
            {OPTIONS.map(({ icon: Icon, title, desc, accent }) => (
              <div key={title} className="card-hover flex gap-4 p-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent} text-white shadow-soft`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-aheers-green-dark">{title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="surface mt-10 p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-aheers-green-dark">Delivery slots</h2>
            <p className="mt-1 text-sm text-gray-500">Select a window at checkout</p>
            <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2 md:grid-cols-3">
              {["08:00 – 10:00", "10:00 – 12:00", "12:00 – 14:00", "14:00 – 16:00", "16:00 – 18:00", "Express"].map(
                (s) => (
                  <li
                    key={s}
                    className="rounded-xl border border-aheers-green/10 bg-white px-4 py-3 font-medium text-aheers-charcoal shadow-soft"
                  >
                    {s}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mt-8">
            <Link href="/contact" className="btn-secondary">
              Delivery enquiry
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
