import { STORES } from "@/lib/stores";
import CartPage from "./cart-client";

export function generateStaticParams() {
  return STORES.map((s) => ({ slug: s.slug }));
}

export default function Page() {
  return <CartPage />;
}
