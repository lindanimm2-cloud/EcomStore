import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import Link from "next/link";

export default function PortalAdminPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Client Portal Configuration" subtitle="Customer-facing portal · Professional Plan module" />
        <div className="admin-page">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Portal Features Enabled</h3>
              <ul className="space-y-3">
                {[
                  "Order tracking & history",
                  "Loyalty points dashboard",
                  "Competition entries",
                  "Delivery status with fleet ETA",
                  "Trade account statements (PowerTrade)",
                  "Profile & address management",
                  "WhatsApp order notifications",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Preview Customer Portal</h3>
              <p className="mb-4 text-sm text-gray-500">
                Preview the client portal as demo customer Lucrisha Polton (VIP). Opens the customer login
                — use password <span className="font-mono text-aheers-green-dark">aheers123</span> then OTP{" "}
                <span className="font-mono text-aheers-green-dark">123456</span>.
              </p>
              <Link href="/login/customer?next=/portal" className="btn-primary">
                Open Client Portal Demo →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
