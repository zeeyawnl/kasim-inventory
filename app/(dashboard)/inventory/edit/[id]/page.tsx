"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../components/ProductForm";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import Loader from "@/components/common/Loader";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/api/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching product");
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        retailPrice: Number(data.retailPrice),
        wholesalePrice: Number(data.wholesalePrice),
        costPrice: Number(data.costPrice),
        currentStock: Number(data.currentStock || 0),
        minStock: Number(data.minStock || 10),
      };

      const res = await fetch(`${getBaseUrl()}/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update product");
      }

      router.push("/inventory");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return <Loader size="lg" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update product details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
