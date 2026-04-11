"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  retailPrice: number;
  wholesalePrice: number;
  costPrice: number;
  currentStock: number;
  minStock: number;
  description?: string;
  salesChannel?: string;
}

export function useProducts(filters?: { search?: string; category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.search) params.set("search", filters.search);
      if (filters?.category) params.set("category", filters.category);

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
