"use client";

import { useEffect, useRef, useState } from "react";
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

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/products?limit=${PAGE_SIZE}&skip=${page * PAGE_SIZE}&search=${searchTerm}`
        );
        console.log(res)
        setProducts(res.data.items);
        setTotal(res.data.total);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchTerm]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <Loading />;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "100%",
        overflowX: "hidden", // Prevent horizontal scroll
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px minmax(0,1fr) minmax(0,2fr) 100px",
          padding: "10px",
          background: "#f9f9f9",
          fontWeight: "bold",
        }}
      >
        <span>ID</span>
        <span>Name</span>
        <span>Description</span>
        <span>Price</span>
      </div>

      {/* BODY */}
      <div
        ref={parentRef}
        style={{
          height: "500px",
          overflowY: "auto",
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const product = products[virtualRow.index];
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
                  gridTemplateColumns:
                    "60px minmax(0,1fr) minmax(0,2fr) 100px",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}