import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";

const WORKFLOWS = [
  { name: "Low stock auto-reorder alert", trigger: "Stock < 30 units", action: "Notify procurement + email manager", status: "Active" },
  { name: "New order → Fleet dispatch", trigger: "Order type = delivery", action: "Assign nearest idle vehicle", status: "Active" },
  { name: "VIP customer welcome", trigger: "Customer type = vip, first order", action: "Send WhatsApp + loyalty bonus", status: "Active" },
  { name: "Trade account credit check", trigger: "PowerTrade order > R5,000", action: "Flag for manager approval", status: "Active" },
  { name: "Competition entry confirmation", trigger: "Portal competition submit", action: "Email + CRM log entry", status: "Demo" },
  { name: "Weekly sales digest", trigger: "Every Monday 07:00", action: "Email report to management", status: "Scheduled" },
];

export default function AutomationPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <AdminHeader title="Automation" subtitle="Workflow automation and intelligent notifications across Aheers operations" />
        <div className="p-8">
          <div className="mb-6 rounded-lg border border-aheers-green/20 bg-aheers-cream p-4">
            <p className="font-semibold text-aheers-green-dark">Automated workflows</p>
            <p className="mt-1 text-sm text-gray-600">
              Automate repetitive tasks across CRM, inventory, fleet, and customer portal. Connected to one data layer.
            </p>
          </div>
          <div className="space-y-3">
            {WORKFLOWS.map((w) => (
              <div key={w.name} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">{w.name}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">When:</span> {w.trigger} → <span className="font-medium">Then:</span> {w.action}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  w.status === "Active" ? "bg-green-100 text-green-700" :
                  w.status === "Scheduled" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
