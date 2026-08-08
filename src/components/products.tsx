"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Plus, Minus, Star } from "lucide-react";

/** Deterministic demo rating from product id — stable across renders */
function demoRating(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 3)) % 47;
  const score = 3.8 + (h % 12) / 10;
  const reviews = 12 + (h % 80);
  return { score: Math.min(5, Math.round(score * 10) / 10), reviews };
}

export function ProductCard({ product }: { product: Product }) {
  const { getQty, addItem, updateQty } = useCart();
  const qty = getQty(product.id, product.storeSlug);
  const displayPrice = product.memberPrice ?? product.price;
  const href = `/store/${product.storeSlug}/product/${product.id}`;
  const { score, reviews } = demoRating(product.id);

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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-aheers-green/10 bg-white shadow-[0_6px_24px_rgba(13,61,38,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-aheers-green/20 hover:shadow-lift sm:rounded-[1.35rem]">
      <Link href={href} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />

      <div className="relative z-[1] pointer-events-none flex h-[7.25rem] items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#f0f4f1,white_70%)] text-4xl sm:h-40 sm:text-5xl md:h-44 md:text-6xl">
        <span className="transition duration-300 group-hover:scale-110">{product.image}</span>
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-md bg-aheers-gold px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-aheers-green-dark sm:left-3 sm:top-3 sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[10px]">
            {product.badge}
          </span>
        )}
      </div>

      <div className="relative z-[1] flex flex-1 flex-col p-2.5 pt-2 sm:p-4 sm:pt-3">
        <Link href={href} className="pointer-events-auto">
          <p className="truncate text-[8px] font-semibold uppercase tracking-[0.12em] text-gray-400 sm:text-[10px] sm:tracking-[0.14em]">
            {product.department ? `${product.department} · ${product.category}` : product.category}
          </p>
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.25rem] text-[13px] font-semibold leading-snug text-aheers-charcoal transition group-hover:text-aheers-green sm:mt-1 sm:min-h-[2.5rem] sm:text-[15px]">
            {product.name}
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:mt-1 sm:text-xs">{product.unit}</p>
          <div className="mt-1.5 hidden items-center gap-1 sm:mt-2 sm:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.round(score) ? "fill-aheers-gold text-aheers-gold" : "text-gray-200"}`}
              />
            ))}
            <span className="ml-1 text-[11px] text-gray-400">
              {score} · {reviews}
            </span>
          </div>
        </Link>

        <div className="mt-auto pt-2.5 sm:pt-4">
          <div className="mb-2 flex items-end justify-between gap-1 sm:mb-3 sm:gap-2">
            <div className="min-w-0">
              <p className="text-base font-bold leading-none text-aheers-green-dark sm:text-xl">
                R {displayPrice.toFixed(2)}
              </p>
              {product.memberPrice && (
                <p className="mt-0.5 truncate text-[9px] font-medium text-aheers-green sm:mt-1 sm:text-[11px]">
                  Member · <span className="line-through">R {product.price.toFixed(2)}</span>
                </p>
              )}
              {product.bulkPrice && product.minQty && !product.memberPrice && (
                <p className="mt-0.5 truncate text-[9px] font-medium text-powertrade-orange sm:mt-1 sm:text-[11px]">
                  Bulk R {product.bulkPrice.toFixed(2)} · {product.minQty}+
                </p>
              )}
            </div>
          </div>

          {qty === 0 ? (
            <button
              type="button"
              onClick={(e) => bump(1, e)}
              className="pointer-events-auto relative z-[2] flex w-full items-center justify-center gap-1 rounded-xl bg-aheers-green py-2 text-[12px] font-bold text-white shadow-soft transition hover:bg-aheers-green-light active:scale-[0.98] sm:gap-2 sm:py-2.5 sm:text-sm"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add to cart</span>
            </button>
          ) : (
            <div className="pointer-events-auto relative z-[2] flex h-9 w-full items-center justify-between rounded-xl bg-aheers-green text-white shadow-soft sm:h-11">
              <button
                type="button"
                onClick={(e) => bump(-1, e)}
                className="flex h-9 w-9 items-center justify-center rounded-l-xl hover:bg-white/15 sm:h-11 sm:w-12"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              </button>
              <span className="text-[11px] font-bold tabular-nums sm:text-sm">{qty}</span>
              <button
                type="button"
                onClick={(e) => bump(1, e)}
                className="flex h-9 w-9 items-center justify-center rounded-r-xl hover:bg-white/15 sm:h-11 sm:w-12"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-gray-500">No products found.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function CartLineItem({
  product,
  price,
  qty,
  onUpdate,
  onRemove,
}: {
  product: Product;
  price: number;
  qty: number;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}) {
  const href = `/store/${product.storeSlug}/product/${product.id}`;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-aheers-green/10 py-4 last:border-0">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3 transition hover:opacity-90">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-aheers-mist text-2xl">
          {product.image}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-aheers-charcoal">{product.name}</p>
          <p className="text-sm text-gray-500">R {price.toFixed(2)} each</p>
        </div>
      </Link>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="flex items-center rounded-xl border border-aheers-green/15 bg-white">
          <button onClick={() => onUpdate(qty - 1)} className="p-2.5 hover:bg-aheers-mist" type="button">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button onClick={() => onUpdate(qty + 1)} className="p-2.5 hover:bg-aheers-mist" type="button">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="w-16 text-right text-sm font-semibold sm:w-20">R {(price * qty).toFixed(2)}</p>
        <button onClick={onRemove} type="button" className="text-xs font-medium text-red-500 hover:underline">
          Remove
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <ShoppingBag className="mb-4 h-12 w-12 text-aheers-green/30" />
      <p className="text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
