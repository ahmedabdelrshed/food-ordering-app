import React from "react";
import { TOrderWithRelations } from "@/types/order";
import { StatusBadge } from "./OrderStatus";

export const OrderSummary = React.memo(function OrderSummary({
  order,
}: {
  order: TOrderWithRelations;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary:</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Customer:</span>
          <div className="text-gray-900">{order.user.name || "N/A"}</div>
          <div className="text-gray-500">{order.user.email}</div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Delivery Address:</span>
          <div className="text-gray-900">
            {order.streetAddress || "No address provided"}
          </div>
          <div className="text-gray-500">
            {order.city || "No city provided"}
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Contact:</span>
          <div className="text-gray-900">
            {order.phone || "No phone provided"}
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Status:</span>
          <div className="mt-1">
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
});
