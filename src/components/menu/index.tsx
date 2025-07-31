// components/menu-infinite.tsx
"use client";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { TProductWithRelations } from "@/types/product";
import ProductCard from "./ProductCard";
import { Loader2Icon } from "lucide-react";

const PAGE_SIZE = 3;

type MenuInfiniteProps = {
  initialProducts: TProductWithRelations[];
  initialNextCursor: string | null;
  category: string;
  query: string;
};

const MenuInfinite: React.FC<MenuInfiniteProps> = ({
  initialProducts,
  initialNextCursor,
  category,
  query,
}) => {
  const [products, setProducts] = useState(initialProducts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextCursor);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch next page
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(category && { category }),
        ...(query && { query }),
        ...(nextCursor && { cursor: nextCursor }),
        limit: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setNextCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [category, query, nextCursor, loading, hasMore]);

  // Intersection Observer
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore, hasMore, loading]);

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {products.length ? (
        products.map((product) => (
          <ProductCard key={product.id} item={product} />
        ))
      ) : (
        <p className="text-accent text-center col-span-full">
          No products found
        </p>
      )}
      <div
        ref={loaderRef}
        className="col-span-full flex justify-center my-4"
        style={{ minHeight: 40 }}
      >
        {loading && hasMore && (
          <span
            className="flex items-center gap-2"
            role="status"
            aria-label="Loading more products"
          >
            <Loader2Icon className="animate-spin h-6 w-6 text-primary" />
            <span className="text-gray-500 text-sm">Loading more...</span>
          </span>
        )}
        {!loading && !hasMore && products.length > 0 && (
          <span className="opacity-50 text-sm">No more products</span>
        )}
      </div>
    </ul>
  );
};

export default React.memo(MenuInfinite);
