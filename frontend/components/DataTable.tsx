"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "../utils/api";
import Loading from "./Loading";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const PAGE_SIZE = 50;

export default function DataTable({ searchTerm = "" }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState<keyof Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  // Determine if pagination is active
  const isPaginated = !!searchTerm || !!sortBy;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const isPaginated = !!searchTerm || !!sortBy; // add more filter flags if you have any
        const res = await api.get(`/products`, {
          params: isPaginated
            ? {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                search: searchTerm || undefined,
              }
            : {}, // fetch all products for first load
        });

        if (!res.data?.items) throw new Error("Invalid server response");

        setProducts(res.data.items);
        setTotal(res.data.total ?? res.data.items.length);
      } catch (error: any) {
        console.error("Failed to fetch products:", error.message || error);
        alert("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchTerm, sortBy]);

  const handleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    // Reset to first page whenever sorting changes
    setPage(0);
  };

  // Memoize sorted products for client-side sorting when needed
  const sortedProducts = useMemo(() => {
    if (!sortBy) return products;
    const sorted = [...products].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return sorted;
  }, [products, sortBy, sortOrder]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <Loading />;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "4px", width: "100%", overflowX: "hidden" }}>
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px minmax(0,1fr) minmax(0,2fr) 100px",
          padding: "10px",
          background: "#f9f9f9",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        <span onClick={() => handleSort("id")}>
          ID {sortBy === "id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
        </span>
        <span onClick={() => handleSort("name")}>
          Name {sortBy === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
        </span>
        <span>Description</span>
        <span onClick={() => handleSort("price")}>
          Price {sortBy === "price" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
        </span>
      </div>

      {/* BODY */}
      <div
        ref={parentRef}
        style={{
          height: "500px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const product = sortedProducts[virtualRow.index];
            if (!product) return null;

            return (
              <div
                key={product.id}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${virtualRow.size}px`,
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "60px minmax(0,1fr) minmax(0,2fr) 100px",
                  padding: "0 10px",
                  borderBottom: "1px solid #eee",
                  alignItems: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{product.id}</span>
                <span>{product.name}</span>
                <span>{product.description}</span>
                <span>${product.price}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAGINATION */}
      {isPaginated && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}