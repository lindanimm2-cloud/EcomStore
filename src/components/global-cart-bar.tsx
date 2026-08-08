"use client";

import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getStore } from "@/lib/stores";
import { StoreSlug } from "@/lib/types";
import { openMiniCart } from "@/components/mini-cart-drawer";

function shouldHideCartBar(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/driver")) return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/register")) return true;
  if (/\/store\/[^/]+\/cart(?:\/|$)/.test(pathname)) return true;
  if (/\/store\/[^/]+\/checkout(?:\/|$)/.test(pathname)) return true;
  return false;
}

/** Sticky cart — above mobile bottom nav when any store cart has items */
export function GlobalCartBar() {
  const pathname = usePathname();
  const { activeStore, storesWithCart, getCartCount, getCartTotal, setActiveStore } = useCart();

  if (shouldHideCartBar(pathname) || storesWithCart.length === 0) return null;

  const preferred =
    (activeStore && storesWithCart.includes(activeStore) ? activeStore : null) ??
    storesWithCart[0];

  const store = getStore(preferred);
  const count = getCartCount(preferred);
  const total = getCartTotal(preferred);
  const otherStores = storesWithCart.filter((s) => s !== preferred).length;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4 md:pb-4 max-md:pb-[calc(4.85rem+env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={() => {
          setActiveStore(preferred as StoreSlug);
          openMiniCart(preferred as StoreSlug);
        }}
        className="pointer-events-auto mx-auto flex w-full max-w-lg items-center justify-between gap-3 rounded-[1.25rem] bg-aheers-green-dark px-4 py-3.5 text-left text-white shadow-[0_12px_40px_rgba(13,61,38,0.35)]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-aheers-green text-white">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark">
              {count}
            </span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              View cart{store ? ` · ${store.shortName}` : ""}
            </p>
            <p className="truncate text-xs text-white/55">
              {count} item{count === 1 ? "" : "s"}
              {otherStores > 0
                ? ` · +${otherStores} other store${otherStores === 1 ? "" : "s"}`
                : " · ready to checkout"}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-xl bg-aheers-gold px-3.5 py-2.5 text-sm font-bold text-aheers-green-dark">
          R {total.toFixed(2)}
        </span>
      </button>
    </div>
  );
}
