// hooks/useOrdersTable.ts
import { useCallback, useEffect, useState } from "react";
import { OrderStatus } from "@prisma/client";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginatedOrdersResponse } from "@/types/order";

export function useOrdersTable(initialData: PaginatedOrdersResponse) {
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [ordersData, setOrdersData] = useState<PaginatedOrdersResponse>(initialData);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const toggleOrder = useCallback((orderId: string) => {
        setExpandedOrders(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(orderId)) {
                newExpanded.delete(orderId);
            } else {
                newExpanded.add(orderId);
            }
            return newExpanded;
        });
    }, []);

    const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setOrdersData(prev => ({
                    ...prev,
                    orders: prev.orders.map(order =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    ),
                }));
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    }, []);

    const fetchOrders = useCallback(async (page: number, limit: number, search: string) => {
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
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        setCurrentPage(1);
    }, []);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= ordersData.totalPages && !loading) {
            setCurrentPage(page);
        }
    }, [ordersData.totalPages, loading]);

    const goToNextPage = useCallback(() => {
        if (ordersData.hasNextPage && !loading) {
            setCurrentPage(prev => prev + 1);
        }
    }, [ordersData.hasNextPage, loading]);

    const goToPreviousPage = useCallback(() => {
        if (ordersData.hasPreviousPage && !loading) {
            setCurrentPage(prev => prev - 1);
        }
    }, [ordersData.hasPreviousPage, loading]);

    const handleItemsPerPageChange = useCallback((count: number) => {
        setItemsPerPage(count);
        setCurrentPage(1);
    }, []);

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

    return {
        expandedOrders,
        ordersData,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        itemsPerPage,
        toggleOrder,
        updateOrderStatus,
        clearSearch,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        handleItemsPerPageChange,
    };
}
