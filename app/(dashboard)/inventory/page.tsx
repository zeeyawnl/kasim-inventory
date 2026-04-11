"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductTable from "./components/ProductTable";
import ProductFilters from "./components/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import Loader from "@/components/common/Loader";

export default function InventoryPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { products, loading, error, refetch } = useProducts(filters);

  const handleEdit = (id: string) => {
    router.push(`/inventory/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        refetch();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products</p>
        </div>
        <Link
          href="/inventory/add"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <ProductFilters onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })} />
        </div>
        
        {loading ? (
          <Loader size="lg" />
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <ProductTable 
            products={products} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>
    </div>
  );
}
