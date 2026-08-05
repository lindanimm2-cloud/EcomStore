import { STORES } from "@/lib/stores";
import CheckoutPage from "./checkout-client";

export function generateStaticParams() {
  return STORES.map((s) => ({ slug: s.slug }));
}

export default function Page() {
  return <CheckoutPage />;
}
