import Link from "next/link";
import { Paintbrush, Scissors, FileText, Truck } from "lucide-react";

const SERVICES = [
  { icon: Scissors, title: "Request cutting", desc: "Timber, pipe & sheet cutting in-store" },
  { icon: Paintbrush, title: "Paint mixing", desc: "Colour match and custom mix" },
  { icon: FileText, title: "Project quotation", desc: "Contractor pricing for your build" },
  { icon: Truck, title: "Construction delivery", desc: "Schedule bakkie / truck delivery" },
];

export function HardwareServices() {
  return (
    <div className="mb-8">
      <h3 className="mb-3 font-semibold text-gray-900">Hardware services</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, desc }) => (
          <Link
            key={title}
            href="/contact?topic=hardware"
            className="card p-4 transition hover:border-buildsave-slate hover:shadow-md"
          >
            <Icon className="mb-2 h-5 w-5 text-buildsave-slate" />
            <p className="font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-xs text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
