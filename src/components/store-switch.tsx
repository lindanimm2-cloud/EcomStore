"use client";

import { useRouter } from "next/navigation";
import { useCart, getActiveStoreName } from "@/lib/cart-context";
import { getStore } from "@/lib/stores";
import { StoreSlug } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export function StoreSwitchModal() {
  const {
    pendingStoreSwitch,
    emptyAndSwitch,
    saveAndSwitch,
    continueShopping,
    clearCart,
    storeSlug,
    itemCount,
    getCartCount,
  } = useCart();
  const router = useRouter();

  if (!pendingStoreSwitch) return null;

  const target = getStore(pendingStoreSwitch);
  const current = storeSlug ? getStore(storeSlug) : null;
  const targetCartCount = getCartCount(pendingStoreSwitch);

  const go = (slug: StoreSlug | null) => {
    if (slug) router.push(`/store/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">You have an active cart</h3>
        <p className="mt-2 text-sm text-gray-600">
          You currently have <strong>{itemCount} item{itemCount !== 1 ? "s" : ""}</strong> in{" "}
          <strong>{current?.name ?? getActiveStoreName(storeSlug)}</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Carts never mix between stores. Switching to <strong>{target?.name}</strong>
          {targetCartCount > 0
            ? ` will restore that store’s saved cart (${targetCartCount} items).`
            : " opens an empty cart for that store."}
        </p>
        <div className="mt-6 grid gap-2">
          <button
            onClick={() => {
              continueShopping();
            }}
            className="btn-secondary w-full"
          >
            Continue shopping here
          </button>
          <button
            onClick={() => {
              const slug = saveAndSwitch();
              go(slug);
            }}
            className="w-full rounded-lg bg-aheers-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-aheers-green-light"
          >
            Save cart &amp; switch
          </button>
          <button
            onClick={() => {
              clearCart();
              const slug = saveAndSwitch();
              go(slug);
            }}
            className="w-full rounded-lg border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            Empty cart &amp; switch
          </button>
          <button
            onClick={() => {
              const slug = emptyAndSwitch();
              go(slug);
            }}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Clear &amp; go to {target?.shortName}
          </button>
          <button
            onClick={continueShopping}
            className="text-sm text-aheers-green hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export function useStoreNavigation() {
  const router = useRouter();
  const { requestStoreSwitch, setActiveStore } = useCart();

  const goToStore = (slug: StoreSlug) => {
    if (requestStoreSwitch(slug)) {
      setActiveStore(slug);
      router.push(`/store/${slug}`);
    }
  };

  return { goToStore };
}
