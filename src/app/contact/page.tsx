"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { PrettySelect } from "@/components/pretty-select";

const inputClass = "field mt-1.5";

function ContactForm() {
  const params = useSearchParams();
  const topic = params.get("topic") ?? "general";
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="surface p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-aheers-green">Message sent</h2>
        <p className="mt-2 text-gray-500">We&apos;ll get back to you at the store shortly. (Demo)</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <form
      className="surface space-y-4 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <PrettySelect
        name="topic"
        label="Topic"
        defaultValue={topic}
        options={[
          { value: "general", label: "General" },
          { value: "delivery", label: "Delivery enquiry" },
          { value: "hardware", label: "Hardware services" },
          { value: "trade", label: "PowerTrade account" },
          { value: "careers", label: "Careers" },
        ]}
      />
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</label>
        <input required className={inputClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone / Email</label>
        <input required className={inputClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</label>
        <textarea required rows={4} className={inputClass} />
      </div>
      <button type="submit" className="btn-primary w-full">
        Send message
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Get in touch"
          title="Contact"
          subtitle="93 Voortrekker Street, Greytown · 033 413 1156 · info@aheers.co.za"
        />
        <div className="page-shell flex justify-center py-12">
          <div className="w-full max-w-lg">
            <Suspense fallback={<div className="surface h-64 animate-pulse" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
