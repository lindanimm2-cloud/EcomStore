import { StoreSlug } from "./types";
import { SUPERMARKET_DEPARTMENTS } from "./supermarket-taxonomy";
import { getCategories, getDepartments } from "./products";

/** URL-safe slug from a display name */
export function toPathSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function storeHomePath(slug: StoreSlug | string): string {
  return slug === "supermarket" ? "/" : `/store/${slug}`;
}

export function cataloguePath(slug: StoreSlug | string): string {
  return `/store/${slug}/catalogue`;
}

export function departmentsPath(slug: StoreSlug | string): string {
  return `/store/${slug}/departments`;
}

export function departmentPath(slug: StoreSlug | string, department: string): string {
  return `/store/${slug}/department/${toPathSlug(department)}`;
}

export function categoryPath(slug: StoreSlug | string, category: string): string {
  return `/store/${slug}/category/${toPathSlug(category)}`;
}

export function productPath(slug: StoreSlug | string, productId: string): string {
  return `/store/${slug}/product/${productId}`;
}

export function aboutPath(slug: StoreSlug | string): string {
  return `/store/${slug}/about`;
}

/** Resolve a path slug back to a department name for a store */
export function resolveDepartment(slug: string, deptSlug: string): string | undefined {
  const names =
    slug === "supermarket"
      ? SUPERMARKET_DEPARTMENTS.map((d) => d.name)
      : getDepartments(slug);
  return names.find((n) => toPathSlug(n) === deptSlug);
}

/** Resolve a path slug back to a category name for a store */
export function resolveCategory(slug: string, catSlug: string): string | undefined {
  return getCategories(slug).find((c) => toPathSlug(c) === catSlug);
}

export function supermarketCategoryNames(department: string): string[] {
  const dept = SUPERMARKET_DEPARTMENTS.find((d) => d.name === department);
  return dept?.categories.map((c) => c.name) ?? [];
}
