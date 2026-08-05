"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Plus, Minus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const displayPrice = product.memberPrice ?? product.bulkPrice ?? product.price;

  return (
    <div className="card-hover group overflow-hidden">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-b from-aheers-mist to-white text-6xl">
        <span className="transition duration-300 group-hover:scale-110">{product.image}</span>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-aheers-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-aheers-green-dark">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">{product.category}</p>
        <h3 className="mt-1 font-semibold text-aheers-charcoal transition group-hover:text-aheers-green">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-aheers-green-dark">
              R {displayPrice.toFixed(2)}
              <span className="text-sm font-normal text-gray-400"> {product.unit}</span>
            </p>
            {product.memberPrice && (
              <p className="text-xs text-aheers-green">
                Member · was R {product.price.toFixed(2)}
              </p>
            )}
            {product.bulkPrice && product.minQty && !product.memberPrice && (
              <p className="text-xs text-powertrade-orange">
                Bulk from R {product.bulkPrice.toFixed(2)} (min {product.minQty})
              </p>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-green text-white shadow-soft transition hover:bg-aheers-green-light hover:shadow-lift"
            aria-label={`Add ${product.name}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">{product.inStock} in stock</p>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-gray-500">No products found.</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function CartLineItem({
  name,
  price,
  qty,
  onUpdate,
  onRemove,
}: {
  name: string;
  price: number;
  qty: number;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-aheers-green/10 py-4">
      <div className="flex-1">
        <p className="font-medium text-aheers-charcoal">{name}</p>
        <p className="text-sm text-gray-500">R {price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-aheers-green/15 bg-white">
          <button onClick={() => onUpdate(qty - 1)} className="p-2 hover:bg-aheers-mist" type="button">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button onClick={() => onUpdate(qty + 1)} className="p-2 hover:bg-aheers-mist" type="button">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="w-20 text-right font-semibold">R {(price * qty).toFixed(2)}</p>
        <button onClick={onRemove} type="button" className="text-xs text-red-500 hover:underline">
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
