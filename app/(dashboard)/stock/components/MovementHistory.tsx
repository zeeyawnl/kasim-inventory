"use client";

import { useEffect } from "react";
import { useStock } from "@/hooks/useStock";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/tables/DataTable";

export default function MovementHistory({ refreshKey }: { refreshKey?: number }) {
  const { movements, loading, refetch } = useStock();

  // If refreshKey changes, fetch again
  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  if (loading) return <Loader />;

  const columns = [
    { key: "createdAt", label: "Date", render: (m: any) => new Date(m.createdAt).toLocaleString() },
    { key: "product", label: "Product", render: (m: any) => m.product?.name || m.productId },
    { key: "type", label: "Type", render: (m: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${m.type === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {m.type.toUpperCase()}
      </span>
    )},
    { key: "quantity", label: "Quantity" },
    { key: "reason", label: "Reason" },
    { key: "reference", label: "Reference" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Movement History</h3>
        <button onClick={refetch} className="text-sm text-blue-600">Refresh</button>
      </div>
      <DataTable 
        data={movements} 
        columns={columns} 
        emptyMessage="No stock movements recorded yet" 
      />
    </div>
  );
}
