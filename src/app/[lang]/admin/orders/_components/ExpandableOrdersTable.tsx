// components/orders/ExpandableOrdersTable.tsx
"use client";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { SearchAndFilters } from "./SearchAndFilters";
import { OrderRow } from "./OrderRow";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { OrdersTableProps } from "@/types/order";

export function ExpandableOrdersTable({ initialData }: OrdersTableProps) {
  const {
    expandedOrders,
    ordersData,
    loading,
    searchTerm,
    setSearchTerm,
    itemsPerPage,
    toggleOrder,
    updateOrderStatus,
    clearSearch,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    handleItemsPerPageChange,
  } = useOrdersTable(initialData);

  return (
    <div className="space-y-4">
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        totalCount={ordersData.totalCount}
        loading={loading}
        onClearSearch={clearSearch}
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
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
                Delivery Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {ordersData.orders.length > 0 ? (
              ordersData.orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrders.has(order.id)}
                  onToggleExpand={toggleOrder}
                  onStatusUpdate={updateOrderStatus}
                />
              ))
            ) : (
              <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={ordersData.currentPage}
        totalPages={ordersData.totalPages}
        totalCount={ordersData.totalCount}
        itemsPerPage={itemsPerPage}
        hasNextPage={ordersData.hasNextPage}
        hasPreviousPage={ordersData.hasPreviousPage}
        loading={loading}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />
    </div>
  );
}
