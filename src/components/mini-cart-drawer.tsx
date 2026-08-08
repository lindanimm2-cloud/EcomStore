"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { STORES, getStore } from "@/lib/stores";
import { storeHomePath } from "@/lib/store-paths";
import { StoreSlug } from "@/lib/types";

export const OPEN_MINI_CART_EVENT = "aheers:open-mini-cart";

type OpenDetail = { store?: StoreSlug };

/** Open the mini cart from anywhere (header, bottom bar, mobile nav). */
export function openMiniCart(store?: StoreSlug) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenDetail>(OPEN_MINI_CART_EVENT, { detail: { store } })
  );
}

function resolvePreferred(
  pathname: string,
  activeStore: StoreSlug | null,
  storesWithCart: StoreSlug[],
  requested?: StoreSlug
): StoreSlug {
  if (requested) return requested;
  if (pathname === "/" || pathname.startsWith("/store/supermarket")) {
    if (storesWithCart.includes("supermarket")) return "supermarket";
  }
  const fromPath = STORES.find((s) => pathname.includes(`/store/${s.slug}`))?.slug;
  if (fromPath && storesWithCart.includes(fromPath)) return fromPath;
  if (activeStore && storesWithCart.includes(activeStore)) return activeStore;
  if (storesWithCart[0]) return storesWithCart[0];
  if (fromPath) return fromPath;
  return activeStore ?? "supermarket";
}

function linePrice(product: {
  price: number;
  memberPrice?: number;
  bulkPrice?: number;
  minQty?: number;
}, qty: number) {
  if (product.bulkPrice && qty >= (product.minQty ?? 0)) return product.bulkPrice;
  return product.memberPrice ?? product.price;
}

export function MiniCartDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    activeStore,
    storesWithCart,
    getCartCount,
    getCartTotal,
    getCartItems,
    setActiveStore,
    updateQty,
    removeItem,
  } = useCart();
  const [open, setOpen] = useState(false);
  const [viewStore, setViewStore] = useState<StoreSlug>("supermarket");

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<OpenDetail>).detail;
      const next = resolvePreferred(pathname, activeStore, storesWithCart, detail?.store);
      setViewStore(next);
      setActiveStore(next);
      setOpen(true);
    }
    window.addEventListener(OPEN_MINI_CART_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MINI_CART_EVENT, onOpen);
  }, [pathname, activeStore, storesWithCart, setActiveStore]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/driver") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  if (!open) return null;

  const store = getStore(viewStore);
  const count = getCartCount(viewStore);
  const total = getCartTotal(viewStore);
  const cartItems = getCartItems(viewStore);

  function switchStore(slug: StoreSlug) {
    setViewStore(slug);
    setActiveStore(slug);
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Mini cart">
      <button
        type="button"
        className="absolute inset-0 bg-aheers-green-dark/40 backdrop-blur-[2px]"
        aria-label="Close cart"
        onClick={() => setOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex w-full max-w-md animate-panel-rise flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-aheers-green/10 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-aheers-green">Your cart</p>
            <h2 className="truncate font-display text-xl font-semibold text-aheers-green-dark">
              {store?.shortName ?? "Aheers"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-aheers-mist hover:text-aheers-green-dark"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {storesWithCart.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto border-b border-aheers-green/5 px-3 py-2.5">
            {storesWithCart.map((slug) => {
              const s = getStore(slug);
              const active = slug === viewStore;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => switchStore(slug)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-aheers-green-dark text-white"
                      : "bg-aheers-mist text-aheers-charcoal hover:bg-aheers-green/10"
                  }`}
                >
                  {s?.shortName} · {getCartCount(slug)}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="flex h-full min-h-[12rem] flex-col items-center justify-center text-center">
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-aheers-mist text-aheers-green">
                <ShoppingBag className="h-6 w-6" />
              </span>
              <p className="font-semibold text-aheers-charcoal">Cart is empty</p>
              <p className="mt-1 text-sm text-gray-400">Add items from the store to get started.</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push(storeHomePath(viewStore));
                }}
                className="btn-primary mt-5 px-5 py-2.5 text-sm"
              >
                Start shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {cartItems.map((item) => {
                const price = linePrice(item.product, item.qty);
                return (
                  <li
                    key={item.product.id}
                    className="flex gap-3 rounded-2xl bg-aheers-mist/50 p-2.5 ring-1 ring-aheers-green/8"
                  >
                    <Link
                      href={`/store/${item.product.storeSlug}/product/${item.product.id}`}
                      onClick={() => setOpen(false)}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-soft"
                    >
                      {item.product.image}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/store/${item.product.storeSlug}/product/${item.product.id}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-semibold text-aheers-charcoal hover:text-aheers-green"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-gray-400">R {price.toFixed(2)} each</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-lg border border-aheers-green/15 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQty(item.product.id, item.qty - 1, viewStore)}
                            className="p-1.5 hover:bg-aheers-mist"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.product.id, item.qty + 1, viewStore)}
                            className="p-1.5 hover:bg-aheers-mist"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-aheers-green-dark">
                            R {(price * item.qty).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id, viewStore)}
                            className="text-[10px] font-semibold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-aheers-green/10 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {cartItems.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Subtotal · {count} item{count === 1 ? "" : "s"}
                </span>
                <span className="font-display text-xl font-semibold text-aheers-green-dark">
                  R {total.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setActiveStore(viewStore);
                  router.push(`/store/${viewStore}/checkout`);
                }}
                className="btn-primary w-full py-3.5"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setActiveStore(viewStore);
                  router.push(`/store/${viewStore}/cart`);
                }}
                className="mt-2 w-full rounded-2xl py-2.5 text-sm font-semibold text-aheers-green hover:bg-aheers-mist"
              >
                View full cart
              </button>
            </>
          )}
          {cartItems.length === 0 && storesWithCart.length === 0 && (
            <p className="text-center text-xs text-gray-400">Carts are kept separate per store.</p>
          )}
        </div>
      </div>
    </div>
  );
}
