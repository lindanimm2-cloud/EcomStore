import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-aheers-green/10">
      <div className="hero-mesh absolute inset-0 opacity-[0.97]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="page-shell relative py-14 md:py-16">
        <div className="max-w-2xl animate-fade-up text-white">
          {eyebrow && <p className="section-label !text-aheers-gold">{eyebrow}</p>}
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 text-base text-white/80 md:text-lg">{subtitle}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  label,
  title,
  subtitle,
  action,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {label && <p className="section-label mb-2">{label}</p>}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-aheers-green-dark md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 prose-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-aheers-green/20 bg-white/50 px-4 py-8 text-center text-sm text-gray-500">{children}</p>;
}

export function SoftLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-semibold text-aheers-green transition hover:text-aheers-green-light">
      {children}
    </Link>
  );
}
