"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products";

const SYNONYMS: Record<string, string[]> = {
  milk: ["dairy", "cream", "clover", "yogurt"],
  bread: ["bakery", "loaf", "scone", "croissant", "breakfast"],
  drink: ["beverage", "cola", "coffee", "coke", "smoothie", "juice"],
  tool: ["drill", "hammer", "hardware", "spanner", "pliers"],
  paint: ["decorating", "roller", "brush"],
  chicken: ["meat", "poultry", "panini", "sandwich", "wrap"],
  sandwich: ["wrap", "roll", "panini"],
  fruit: ["produce", "veg", "vegetables", "salad"],
};

export function StoreSearch({
  products,
  slug,
  category,
  department,
}: {
  products: Product[];
  slug: string;
  category?: string;
  department?: string;
}) {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    else if (department) list = list.filter((p) => p.department === department);
    const term = q.trim().toLowerCase();
    if (!term) return list;

    const extras = Object.entries(SYNONYMS)
      .filter(([k]) => term.includes(k) || k.includes(term))
      .flatMap(([, v]) => v);

    return list.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.department ?? ""} ${p.description} ${p.badge ?? ""}`.toLowerCase();
      if (hay.includes(term)) return true;
      return extras.some((e) => hay.includes(e));
    });
  }, [products, category, department, q]);

  return (
    <div>
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${slug} — milk, tools, coffee…`}
          className="mobile-search"
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
