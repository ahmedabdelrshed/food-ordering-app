// components/orders/OrderRow.tsx
import { TOrderWithRelations } from "@/types/order";
import { OrderItem, OrderStatus } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/formatCurrency";
import {
  ChevronDownIcon,
  ChevronsUpIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import { StatusBadge } from "./OrderStatus";
import { StatusSelect } from "./StatusSelect";
import { OrderSummary } from "./OrderSummary";
import { OrderItems } from "./OrderItems";

interface OrderRowProps {
  order: TOrderWithRelations;
  isExpanded: boolean;
  onToggleExpand: (orderId: string) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

function calculateItemTotal(item: OrderItem) {
  return item.price * item.quantity;
}

function calculateOrderTotal(order: { items: OrderItem[] }) {
  return order.items.reduce(
    (sum: number, item: OrderItem) => sum + calculateItemTotal(item),
    0
  );
}

export function OrderRow({
  order,
  isExpanded,
  onToggleExpand,
  onStatusUpdate,
}: OrderRowProps) {
  return (
    <>
      {/* Main Order Row */}
      <tr className="hover:bg-gray-50">
        <td
          className="px-6 py-4 whitespace-nowrap cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          {isExpanded ? (
            <ChevronsUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          <div className="text-sm font-medium text-gray-900">
            #{order.id.slice(-8)}
          </div>
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          <div className="text-sm font-medium text-gray-900">
            {order.user.name || "N/A"}
          </div>
          <div className="text-sm text-gray-500">{order.user.email}</div>
        </td>
        <td
          className="px-6 py-4 cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          <div className="flex items-center space-x-1">
            <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="text-gray-900">{order.city || "No city"}</div>
            </div>
          </div>
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          <div className="flex items-center space-x-1">
            <PhoneIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {order.phone || "No phone"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-2">
            <StatusBadge status={order.status} />
            <StatusSelect
              value={order.status}
              onValueChange={(value) => onStatusUpdate(order.id, value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {order.items.length} item
            {order.items.length !== 1 ? "s" : ""}
          </span>
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(calculateOrderTotal(order))}
          </div>
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
          onClick={() => onToggleExpand(order.id)}
        >
          {formatDate(order.createdAt)}
        </td>
      </tr>

      {/* Expanded Order Items */}
      {isExpanded && (
        <tr>
          <td colSpan={9} className="px-6 py-4 bg-gray-50">
            <div className="space-y-4">
              <OrderSummary order={order} />
              <OrderItems order={order} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
