"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      // Data type conversions for numbers
      const payload = {
        ...data,
        retailPrice: Number(data.retailPrice),
        wholesalePrice: Number(data.wholesalePrice),
        costPrice: Number(data.costPrice),
        currentStock: Number(data.currentStock || 0),
        minStock: Number(data.minStock || 10),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }

      router.push("/inventory");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new product to your inventory</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
