"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CartItem, Product, StoreSlug } from "./types";
import { getStore } from "./stores";

type CartsByStore = Partial<Record<StoreSlug, CartItem[]>>;

interface CartContextType {
  items: CartItem[];
  storeSlug: StoreSlug | null;
  activeStore: StoreSlug | null;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string, storeSlug?: StoreSlug) => void;
  updateQty: (productId: string, qty: number, storeSlug?: StoreSlug) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getCartCount: (slug: StoreSlug) => number;
  getQty: (productId: string, slug: StoreSlug) => number;
  hasCart: (slug: StoreSlug) => boolean;
  pendingStoreSwitch: StoreSlug | null;
  requestStoreSwitch: (slug: StoreSlug) => boolean;
  emptyAndSwitch: () => StoreSlug | null;
  saveAndSwitch: () => StoreSlug | null;
  continueShopping: () => void;
  cancelStoreSwitch: () => void;
  setActiveStore: (slug: StoreSlug) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "aheers-carts-v1";

function loadCarts(): CartsByStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartsByStore) : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<CartsByStore>({});
  const [activeStore, setActiveStoreState] = useState<StoreSlug | null>(null);
  const [pendingStoreSwitch, setPendingStoreSwitch] = useState<StoreSlug | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCarts(loadCarts());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts));
  }, [carts, hydrated]);

  const items = activeStore ? carts[activeStore] ?? [] : [];
  const storeSlug = activeStore;

  const persistStore = useCallback((slug: StoreSlug, nextItems: CartItem[]) => {
    setCarts((prev) => {
      const copy = { ...prev };
      if (nextItems.length === 0) delete copy[slug];
      else copy[slug] = nextItems;
      return copy;
    });
  }, []);

  const setActiveStore = useCallback((slug: StoreSlug) => {
    setActiveStoreState(slug);
  }, []);

  const addItem = useCallback((product: Product, qty = 1) => {
    const slug = product.storeSlug;
    setActiveStoreState((current) => {
      if (current && current !== slug) {
        setCarts((prev) => {
          const currentItems = prev[current] ?? [];
          if (currentItems.length > 0) {
            setPendingStoreSwitch(slug);
            return prev;
          }
          const list = prev[slug] ?? [];
          const existing = list.find((i) => i.product.id === product.id);
          const next = existing
            ? list.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i))
            : [...list, { product, qty }];
          return { ...prev, [slug]: next };
        });
        return current;
      }
      setCarts((prev) => {
        const list = prev[slug] ?? [];
        const existing = list.find((i) => i.product.id === product.id);
        const next = existing
          ? list.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i))
          : [...list, { product, qty }];
        return { ...prev, [slug]: next };
      });
      return slug;
    });
  }, []);

  const removeItem = useCallback((productId: string, storeSlug?: StoreSlug) => {
    setCarts((prev) => {
      const slug = storeSlug ?? activeStore;
      if (!slug) return prev;
      const list = (prev[slug] ?? []).filter((i) => i.product.id !== productId);
      const copy = { ...prev };
      if (list.length === 0) delete copy[slug];
      else copy[slug] = list;
      return copy;
    });
    if (storeSlug) setActiveStoreState(storeSlug);
  }, [activeStore]);

  const updateQty = useCallback(
    (productId: string, qty: number, storeSlug?: StoreSlug) => {
      const slug = storeSlug ?? activeStore;
      if (!slug) return;
      if (qty <= 0) {
        removeItem(productId, slug);
        return;
      }
      setActiveStoreState(slug);
      setCarts((prev) => ({
        ...prev,
        [slug]: (prev[slug] ?? []).map((i) => (i.product.id === productId ? { ...i, qty } : i)),
      }));
    },
    [activeStore, removeItem]
  );

  const clearCart = useCallback(() => {
    if (!activeStore) return;
    persistStore(activeStore, []);
  }, [activeStore, persistStore]);

  const requestStoreSwitch = useCallback((slug: StoreSlug) => {
    if (slug === activeStore) return true;
    const currentItems = activeStore ? carts[activeStore] ?? [] : [];
    if (currentItems.length === 0) {
      setActiveStoreState(slug);
      return true;
    }
    setPendingStoreSwitch(slug);
    return false;
  }, [activeStore, carts]);

  const emptyAndSwitch = useCallback(() => {
    const target = pendingStoreSwitch;
    if (activeStore) persistStore(activeStore, []);
    setPendingStoreSwitch(null);
    if (target) setActiveStoreState(target);
    return target;
  }, [pendingStoreSwitch, activeStore, persistStore]);

  const saveAndSwitch = useCallback(() => {
    const target = pendingStoreSwitch;
    setPendingStoreSwitch(null);
    if (target) setActiveStoreState(target);
    return target;
  }, [pendingStoreSwitch]);

  const continueShopping = useCallback(() => {
    setPendingStoreSwitch(null);
  }, []);

  const total = items.reduce((sum, i) => {
    const price =
      i.product.bulkPrice && i.qty >= (i.product.minQty ?? 0)
        ? i.product.bulkPrice
        : i.product.memberPrice ?? i.product.price;
    return sum + price * i.qty;
  }, 0);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  const getCartCount = useCallback(
    (slug: StoreSlug) => (carts[slug] ?? []).reduce((s, i) => s + i.qty, 0),
    [carts]
  );

  const getQty = useCallback(
    (productId: string, slug: StoreSlug) =>
      (carts[slug] ?? []).find((i) => i.product.id === productId)?.qty ?? 0,
    [carts]
  );

  const hasCart = useCallback((slug: StoreSlug) => (carts[slug]?.length ?? 0) > 0, [carts]);

  return (
    <CartContext.Provider
      value={{
        items,
        storeSlug,
        activeStore,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        itemCount,
        getCartCount,
        getQty,
        hasCart,
        pendingStoreSwitch,
        requestStoreSwitch,
        emptyAndSwitch,
        saveAndSwitch,
        continueShopping,
        cancelStoreSwitch: continueShopping,
        setActiveStore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function getActiveStoreName(slug: StoreSlug | null): string {
  if (!slug) return "";
  return getStore(slug)?.shortName ?? slug;
}
