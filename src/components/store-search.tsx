"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products";

const SYNONYMS: Record<string, string[]> = {
  milk: ["dairy", "cream", "clover"],
  bread: ["bakery", "loaf", "scone", "croissant"],
  drink: ["beverage", "cola", "coffee", "coke"],
  tool: ["drill", "hammer", "hardware"],
  cement: ["building", "construction"],
  chicken: ["meat", "butchery", "panini", "sandwich"],
};

export function StoreSearch({
  products,
  slug,
  category,
}: {
  products: Product[];
  slug: string;
  category?: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category) : products;
    const term = q.trim().toLowerCase();
    if (!term) return list;

    const extras = Object.entries(SYNONYMS)
      .filter(([k]) => term.includes(k) || k.includes(term))
      .flatMap(([, v]) => v);

    return list.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.description} ${p.badge ?? ""}`.toLowerCase();
      if (hay.includes(term)) return true;
      return extras.some((e) => hay.includes(e));
    });
  }, [products, category, q]);

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${slug} — milk, tools, coffee…`}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none ring-aheers-green focus:ring-2"
        />
      </div>
      {q && (
        <p className="mb-4 text-sm text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for “{q}”
        </p>
      )}
      <ProductGrid products={filtered} />
    </div>
  );
}
