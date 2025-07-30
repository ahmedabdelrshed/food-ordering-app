"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatCurrency";
import { supabase } from "@/lib/supabase";
import {  OrderItem, OrderStatus } from "@prisma/client";
import {
  ChevronDownIcon,
  ChevronsUpIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { TOrderWithRelations } from "@/types/order";
import { useDebounce } from "@/hooks/useDebounce";

interface PaginatedOrdersResponse {
  orders: TOrderWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OrdersTableProps {
  initialData: PaginatedOrdersResponse;
}

export function ExpandableOrdersTable({ initialData }: OrdersTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [ordersData, setOrdersData] =
    useState<PaginatedOrdersResponse>(initialData);
  const [loading, setLoading] = useState(false);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the local state
        setOrdersData((prev) => ({
          ...prev,
          orders: prev.orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Fetch orders from server
  const fetchOrders = useCallback(
    async (page: number, limit: number, search: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search: search,
        });

        const response = await fetch(`/api/orders?${params}`);
        if (response.ok) {
          const data: PaginatedOrdersResponse = await response.json();
          setOrdersData(data);
          setCurrentPage(data.currentPage);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Effect for search term changes
  useEffect(() => {
    fetchOrders(1, itemsPerPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, itemsPerPage, fetchOrders]);

  // Effect for page changes (only when not searching)
  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchOrders(currentPage, itemsPerPage, "");
    }
  }, [currentPage, fetchOrders, debouncedSearchTerm, itemsPerPage]);

  // Supabase real-time updates
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
        () => {
          // Refetch current page when there's a change
          fetchOrders(currentPage, itemsPerPage, debouncedSearchTerm);
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
  }, [currentPage, itemsPerPage, debouncedSearchTerm, fetchOrders]);

  const calculateItemTotal = (item: OrderItem) => {
    return item.price * item.quantity;
  };

  const calculateOrderTotal = (order: { items: OrderItem[] }) => {
    return order.items.reduce(
      (sum: number, item: OrderItem) => sum + calculateItemTotal(item),
      0
    );
  };

  const getStatusIcon = (status: OrderStatus) => {
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

  const getStatusBadge = (status: OrderStatus) => {
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
  };

  const getStatusSelectOptions = () => {
    const options = [
      { value: OrderStatus.WAITING, label: "Waiting", disabled: false },
      { value: OrderStatus.IN_DELIVERY, label: "In Delivery", disabled: false },
      { value: OrderStatus.COMPLETED, label: "Completed", disabled: false },
    ];

    return options;
  };

  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= ordersData.totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (ordersData.hasNextPage && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (ordersData.hasPreviousPage && !loading) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Section */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by Order ID, Customer, Phone, City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-12"
                autoFocus
                disabled={loading}
              />
              {loading && (
                <Loader2Icon className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
              {searchTerm && !loading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Pagination Settings */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
                disabled={loading}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                    value="5"
                  >
                    5
                  </SelectItem>
                  <SelectItem
                    className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                    value="10"
                  >
                    10
                  </SelectItem>
                  <SelectItem
                    className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                    value="20"
                  >
                    20
                  </SelectItem>
                  <SelectItem
                    className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                    value="50"
                  >
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Info */}
            <div className="text-sm text-gray-600">
              {searchTerm ? (
                <span>Found {ordersData.totalCount} orders</span>
              ) : (
                <span>Total: {ordersData.totalCount} orders</span>
              )}
            </div>
          </div>
        </div>
      </div>

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
                <React.Fragment key={order.id}>
                  {/* Main Order Row */}
                  <tr className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {expandedOrders.has(order.id) ? (
                        <ChevronsUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user.email}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {order.city || "No city"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
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
                        {getStatusBadge(order.status)}
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.id, value as OrderStatus)
                          }
                        >
                          <SelectTrigger
                            className="block w-full text-xs border-gray-300 rounded-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {getStatusSelectOptions().map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  disabled={option.disabled}
                                  className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(calculateOrderTotal(order))}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>

                  {/* Expanded Order Items - Same as before */}
                  {expandedOrders.has(order.id) && (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 bg-gray-50">
                        {/* Your existing expanded content here */}
                        <div className="space-y-4">
                          {/* Order Summary Section */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Order Summary:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">
                                  Customer:
                                </span>
                                <div className="text-gray-900">
                                  {order.user.name || "N/A"}
                                </div>
                                <div className="text-gray-500">
                                  {order.user.email}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Delivery Address:
                                </span>
                                <div className="text-gray-900">
                                  {order.streetAddress || "No address provided"}
                                </div>
                                <div className="text-gray-500">
                                  {order.city || "No city provided"}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Contact:
                                </span>
                                <div className="text-gray-900">
                                  {order.phone || "No phone provided"}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Status:
                                </span>
                                <div className="mt-1">
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items Section */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-900">
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
                                        <span className="font-medium">
                                          Size:
                                        </span>{" "}
                                        {item.size.name}
                                        <div className="text-gray-500">
                                          {formatCurrency(
                                            item.size.price +
                                              item.product.basePrice
                                          )}{" "}
                                          each
                                        </div>
                                      </div>

                                      <div>
                                        <span className="font-medium">
                                          Quantity:
                                        </span>{" "}
                                        {item.quantity}
                                      </div>

                                      {item.extras.length > 0 && (
                                        <div>
                                          <span className="font-medium">
                                            Extras:
                                          </span>
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
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    {searchTerm ? (
                      <div>
                        <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No orders found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search terms.
                        </p>
                        <Button
                          variant="outline"
                          onClick={clearSearch}
                          className="mt-4"
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          No orders available
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Orders will appear here when they are created.
                        </p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {ordersData.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={!ordersData.hasPreviousPage || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={!ordersData.hasNextPage || loading}
            >
              Next
            </Button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(ordersData.currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    ordersData.currentPage * itemsPerPage,
                    ordersData.totalCount
                  )}
                </span>{" "}
                of <span className="font-medium">{ordersData.totalCount}</span>{" "}
                results
              </p>
            </div>

            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={!ordersData.hasPreviousPage || loading}
                  className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                {Array.from(
                  { length: Math.min(5, ordersData.totalPages) },
                  (_, i) => {
                    let pageNumber;
                    if (ordersData.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (ordersData.currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (
                      ordersData.currentPage >=
                      ordersData.totalPages - 2
                    ) {
                      pageNumber = ordersData.totalPages - 4 + i;
                    } else {
                      pageNumber = ordersData.currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          ordersData.currentPage === pageNumber
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        disabled={loading}
                        className="relative inline-flex cursor-pointer items-center px-4 py-2 -ml-px"
                      >
                        {pageNumber}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={!ordersData.hasNextPage || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md -ml-px"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
