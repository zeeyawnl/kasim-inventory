"use client";

import { useState, useEffect, useCallback } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

interface StockMovement {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  reason?: string;
  reference?: string;
  createdAt: string;
  product?: { name: string; sku: string };
}

export function useStock(productId?: string) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (productId) params.set("productId", productId);

      const res = await fetch(`${getBaseUrl()}/api/stock?${params}`);
      if (!res.ok) throw new Error("Failed to fetch stock movements");

      const data = await res.json();
      setMovements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return { movements, loading, error, refetch: fetchMovements };
}
