import React from "react";
import { OrderStatus } from "@prisma/client";
import { ClockIcon, TruckIcon, CheckCircleIcon } from "lucide-react";

export const getStatusIcon = (status: OrderStatus) => {
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
};

export const StatusBadge = React.memo(function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const baseClasses =
    "inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium";
  let css = "";
  let label = "";
  switch (status) {
    case OrderStatus.WAITING:
      css = "bg-yellow-100 text-yellow-800";
      label = "Waiting";
      break;
    case OrderStatus.IN_DELIVERY:
      css = "bg-blue-100 text-blue-800";
      label = "In Delivery";
      break;
    case OrderStatus.COMPLETED:
      css = "bg-green-100 text-green-800";
      label = "Completed";
      break;
    default:
      css = "bg-gray-100 text-gray-800";
      label = "Unknown";
  }
  return (
    <span className={`${baseClasses} ${css}`}>
      {getStatusIcon(status)}
      <span>{label}</span>
    </span>
  );
});

export const getStatusSelectOptions = () => [
  { value: OrderStatus.WAITING, label: "Waiting", disabled: false },
  { value: OrderStatus.IN_DELIVERY, label: "In Delivery", disabled: false },
  { value: OrderStatus.COMPLETED, label: "Completed", disabled: false },
];
