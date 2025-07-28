"use client";
import { formatCurrency, formatDate } from "@/lib/formatCurrency";
import { supabase } from "@/lib/supabase";
import { getOrders } from "@/server/db/orders";
import { OrderItem } from "@prisma/client";
import { ChevronDownIcon, ChevronsUpIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
interface OrdersTableProps {
  initialOrders: Awaited<ReturnType<typeof getOrders>>;
}

export function ExpandableOrdersTable({ initialOrders }: OrdersTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState(initialOrders);

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };
  useEffect(() => {
    const channel = supabase
      .channel("orders-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Order",
        },
        async(payload) => {
          console.log("📦 New Order:", payload.new);
          const res = await fetch("/api/orders");
          const allOrders = await res.json();
          console.log(allOrders)
          setOrders(allOrders);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Supabase listener is active.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const calculateItemTotal = (item: OrderItem) => {
    return item.price * item.quantity;
  };

  const calculateOrderTotal = (order: { items: OrderItem[] }) => {
    return order.items.reduce(
      (sum: number, item: OrderItem) => sum + calculateItemTotal(item),
      0
    );
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              {/* Main Order Row */}
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleOrder(order.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {expandedOrders.has(order.id) ? (
                    <ChevronsUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id.slice(-8)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.user.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(calculateOrderTotal(order))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
              </tr>

              {/* Expanded Order Items */}
              {expandedOrders.has(order.id) && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Order Items:
                      </h4>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">
                                    {item.product.name}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {item.product.description}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Size:</span>{" "}
                                  {item.size.name}
                                  <div className="text-gray-500">
                                    {formatCurrency(
                                      item.size.price + item.product.basePrice
                                    )}{" "}
                                    each
                                  </div>
                                </div>

                                <div>
                                  <span className="font-medium">Quantity:</span>{" "}
                                  {item.quantity}
                                </div>

                                {item.extras.length > 0 && (
                                  <div>
                                    <span className="font-medium">Extras:</span>
                                    <ul className="text-gray-500 text-xs mt-1">
                                      {item.extras.map((extra) => (
                                        <li key={extra.id}>
                                          {extra.name} (+
                                          {formatCurrency(extra.price)})
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(calculateItemTotal(item))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
