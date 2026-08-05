import { FleetVehicle } from "./types";

// Greytown, KZN approximate coordinates
export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: "f1",
    name: "Aheers Delivery 1",
    driver: "Sipho Mkhize",
    phone: "082 111 2233",
    status: "returning",
    lat: -29.062,
    lng: 30.592,
    destination: "Depot — Voortrekker St",
    orderId: "ORD-1042",
    eta: "5 min",
    capacity: "1.5 ton",
  },
  {
    id: "f2",
    name: "Aheers Delivery 2",
    driver: "Thabo Nkosi",
    phone: "083 222 3344",
    status: "delivering",
    lat: -29.058,
    lng: 30.598,
    destination: "22 Durban St, Greytown",
    orderId: "ORD-1043",
    eta: "12 min",
    capacity: "3 ton",
  },
  {
    id: "f3",
    name: "Aheers Delivery 3",
    driver: "Nomsa Dlamini",
    phone: "084 333 4455",
    status: "en-route",
    lat: -29.065,
    lng: 30.585,
    destination: "78 Voortrekker St, Greytown",
    orderId: "ORD-1046",
    eta: "18 min",
    capacity: "1.5 ton",
  },
  {
    id: "f4",
    name: "PowerTrade Bulk Truck",
    driver: "David Pillay",
    phone: "085 444 5566",
    status: "idle",
    lat: -29.061,
    lng: 30.590,
    capacity: "8 ton",
  },
];

export const DEPOT = { lat: -29.064, lng: 30.591, name: "Aheers Depot, Greytown" };

export function getStatusColor(status: FleetVehicle["status"]): string {
  switch (status) {
    case "idle": return "bg-gray-400";
    case "en-route": return "bg-blue-500";
    case "delivering": return "bg-amber-500";
    case "returning": return "bg-green-500";
  }
}

export function getStatusLabel(status: FleetVehicle["status"]): string {
  switch (status) {
    case "idle": return "Idle";
    case "en-route": return "En Route";
    case "delivering": return "Delivering";
    case "returning": return "Returning";
  }
}
