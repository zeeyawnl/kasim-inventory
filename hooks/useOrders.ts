"use client";

import { useState, useEffect, useCallback } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  total: number;
  createdAt: string;
}

export function useOrders(filters?: { type?: string; status?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.type) params.set("type", filters.type);
      if (filters?.status) params.set("status", filters.status);

      const res = await fetch(`${getBaseUrl()}/api/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters?.type, filters?.status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
