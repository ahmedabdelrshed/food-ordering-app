// components/orders/OrderStatus.tsx
import { OrderStatus } from "@prisma/client";
import { ClockIcon, TruckIcon, CheckCircleIcon } from "lucide-react";

export function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case OrderStatus.WAITING:
      return <ClockIcon className="h-4 w-4" />;
    case OrderStatus.IN_DELIVERY:
      return <TruckIcon className="h-4 w-4" />;
    case OrderStatus.COMPLETED:
      return <CheckCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const baseClasses =
    "inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium";

  switch (status) {
    case OrderStatus.WAITING:
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          {getStatusIcon(status)}
          <span>Waiting</span>
        </span>
      );
    case OrderStatus.IN_DELIVERY:
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          {getStatusIcon(status)}
          <span>In Delivery</span>
        </span>
      );
    case OrderStatus.COMPLETED:
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          {getStatusIcon(status)}
          <span>Completed</span>
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {getStatusIcon(status)}
          <span>Unknown</span>
        </span>
      );
  }
}

export function getStatusSelectOptions() {
  return [
    { value: OrderStatus.WAITING, label: "Waiting", disabled: false },
    { value: OrderStatus.IN_DELIVERY, label: "In Delivery", disabled: false },
    { value: OrderStatus.COMPLETED, label: "Completed", disabled: false },
  ];
}
