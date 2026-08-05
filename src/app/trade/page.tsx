"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { CUSTOMERS, formatCurrency } from "@/lib/data";
import { getProductsByStore } from "@/lib/products";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, FileText, Truck, CreditCard, Download, LogOut } from "lucide-react";

const TRADE_CUSTOMER = CUSTOMERS[3];
const BULK_PRODUCTS = getProductsByStore("powertrade").slice(0, 4);

export default function TradePortalPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [rfqSent, setRfqSent] = useState(false);
  const creditLimit = 50000;
  const creditUsed = 12450;
  const account =
    CUSTOMERS.find((c) => c.id === user?.customerId) ?? TRADE_CUSTOMER;

  return (
    <>
      <StoreSwitcher />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-powertrade-orange py-10 text-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-4 flex items-center justify-between">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
                <ArrowLeft className="h-4 w-4" /> Login portals
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login/trade");
                }}
                className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
            <h1 className="text-2xl font-bold">Aheers PowerTrade — Business portal</h1>
            <p className="mt-1 opacity-90">Trade pricing · Credit · RFQ · Invoices · Truck delivery</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="card p-5 md:col-span-2">
              <p className="font-semibold text-gray-900">{user?.name ?? account.name}</p>
              <p className="text-sm text-gray-600">Trade account · VAT verified · {account.phone}</p>
              <p className="mt-2 text-sm">Lifetime spend: {formatCurrency(account.totalSpent)}</p>
              <p className="text-sm">Account manager: Sagren (demo)</p>
            </div>
            <div className="card p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <CreditCard className="h-4 w-4" /> Credit facility
              </p>
              <p className="mt-2 text-2xl font-bold text-powertrade-orange">
                {formatCurrency(creditLimit - creditUsed)}
              </p>
              <p className="text-xs text-gray-500">
                Available of {formatCurrency(creditLimit)} · Used {formatCurrency(creditUsed)}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-powertrade-orange"
                  style={{ width: `${(creditUsed / creditLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => setRfqSent(true)}
              className="card p-5 text-left transition hover:shadow-md"
            >
              <FileText className="mb-2 h-6 w-6 text-powertrade-orange" />
              <p className="font-semibold">Request quote (RFQ)</p>
              <p className="mt-1 text-sm text-gray-500">Build a bulk order for pricing</p>
            </button>
            <Link href="/store/powertrade" className="card p-5 transition hover:shadow-md">
              <Truck className="mb-2 h-6 w-6 text-powertrade-orange" />
              <p className="font-semibold">Place bulk order</p>
              <p className="mt-1 text-sm text-gray-500">Shop trade catalog</p>
            </Link>
            <button type="button" className="card p-5 text-left">
              <Download className="mb-2 h-6 w-6 text-powertrade-orange" />
              <p className="font-semibold">Statements</p>
              <p className="mt-1 text-sm text-gray-500">Invoices &amp; POD downloads</p>
            </button>
            <Link href="/delivery" className="card p-5 transition hover:shadow-md">
              <Truck className="mb-2 h-6 w-6 text-powertrade-orange" />
              <p className="font-semibold">Schedule truck</p>
              <p className="mt-1 text-sm text-gray-500">Business delivery windows</p>
            </Link>
          </div>

          {rfqSent && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              RFQ submitted (demo). Your account manager will respond with trade pricing and approval workflow.
            </div>
          )}

          <h2 className="mb-4 font-semibold">Trade catalog preview</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BULK_PRODUCTS.map((p) => (
              <div key={p.id} className="card flex gap-4 p-4">
                <span className="text-3xl">{p.image}</span>
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-powertrade-orange">
                    Trade: R {p.bulkPrice?.toFixed(2)} (min {p.minQty})
                  </p>
                  <Link href="/store/powertrade" className="mt-2 inline-block text-xs text-aheers-green hover:underline">
                    Add to order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
