"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Minus, Truck } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

function formatPrice(price: number) {
  const [rand, cents] = price.toFixed(2).split(".");
  return (
    <span className="inline-flex items-start font-bold text-aheers-charcoal">
      <span className="text-lg leading-none">R{rand}</span>
      <sup className="ml-0.5 mt-0.5 text-[10px] font-bold leading-none">{cents}</sup>
    </span>
  );
}

function RailCard({ product }: { product: Product }) {
  const { getQty, addItem, updateQty } = useCart();
  const qty = getQty(product.id, product.storeSlug);
  const displayPrice = product.memberPrice ?? product.price;
  const href = `/store/${product.storeSlug}/product/${product.id}`;

  function bump(delta: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 0 && delta > 0) {
      addItem(product, 1);
      return;
    }
    updateQty(product.id, qty + delta, product.storeSlug);
  }

  return (
    <article className="group relative flex w-[9.75rem] shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-2.5 shadow-[0_4px_16px_rgba(13,61,38,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-[11rem]">
      <Link href={href} className="absolute inset-0 z-0" aria-label={product.name} />
      <div className="relative z-[1] pointer-events-none flex h-28 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_50%_30%,#f3f6f4,white_70%)] text-4xl sm:h-32 sm:text-5xl">
        <span className="transition duration-300 group-hover:scale-110">{product.image}</span>
        {product.badge && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-aheers-green px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
            {product.badge.slice(0, 10)}
          </span>
        )}
        {qty === 0 ? (
          <button
            type="button"
            onClick={(e) => bump(1, e)}
            className="pointer-events-auto absolute bottom-1.5 right-1.5 z-[2] inline-flex items-center gap-0.5 rounded-full bg-aheers-green px-2.5 py-1 text-[11px] font-bold text-white shadow-soft transition hover:bg-aheers-green-light"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Add
          </button>
        ) : (
          <div className="pointer-events-auto absolute bottom-1.5 right-1.5 z-[2] flex items-center rounded-full bg-aheers-green text-white shadow-soft">
            <button type="button" onClick={(e) => bump(-1, e)} className="p-1.5" aria-label="Decrease">
              <Minus className="h-3 w-3" strokeWidth={2.5} />
            </button>
            <span className="min-w-[1.25rem] text-center text-[11px] font-bold">{qty}</span>
            <button type="button" onClick={(e) => bump(1, e)} className="p-1.5" aria-label="Increase">
              <Plus className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
      <div className="relative z-[1] mt-2 flex flex-1 flex-col px-0.5">
        <Link href={href} className="pointer-events-auto">
          {formatPrice(displayPrice)}
          <p className="mt-1 line-clamp-2 min-h-[2.25rem] text-[12px] font-medium leading-snug text-gray-700">
            {product.name}
          </p>
          <p className="mt-0.5 text-[10px] text-gray-400">{product.unit}</p>
        </Link>
        <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-aheers-green/30 px-2 py-0.5 text-[10px] font-semibold text-aheers-green">
          <Truck className="h-3 w-3" /> Same day
        </span>
      </div>
    </article>
  );
}

export function ProductRail({
  title,
  products,
  onViewAll,
}: {
  title: string;
  products: Product[];
  onViewAll?: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    updateArrows();
  }, [products]);

  if (products.length === 0) return null;

  function updateArrows() {
    const el = scroller.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  function scroll(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  }

  return (
    <section className="relative py-5 animate-fade-up">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-aheers-green-dark md:text-base">
          {title}
        </h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-aheers-green hover:underline"
          >
            View all
          </button>
        )}
      </div>

      <div className="relative">
        {canLeft && (
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-aheers-green-dark text-white shadow-lift md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canRight && (
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-aheers-green-dark text-white shadow-lift md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scroller}
          onScroll={updateArrows}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <RailCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
