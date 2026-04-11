"use client";

import { useOrders } from "@/hooks/useOrders";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/tables/DataTable";

export default function InvoiceTable({ type }: { type?: string }) {
  const { orders, loading } = useOrders({ type });

  if (loading) return <Loader />;

  const columns = [
    { key: "orderNumber", label: "Invoice #" },
    { key: "createdAt", label: "Date", render: (o: any) => new Date(o.createdAt).toLocaleDateString() },
    { key: "total", label: "Total", render: (o: any) => `₹${o.total.toFixed(2)}` },
    { key: "status", label: "Status", render: (o: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${o.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {o.status.toUpperCase()}
      </span>
    ) },
  ];

  return (
    <DataTable 
      data={orders} 
      columns={columns} 
      emptyMessage="No invoices found." 
    />
  );
}
