"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useSuppliers } from "@/hooks/useSuppliers";
import CustomerForm from "./components/CustomerForm";
import SupplierForm from "./components/SupplierForm";
import Modal from "@/components/common/Modal";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/tables/DataTable";

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "suppliers">("customers");
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isSupplierModalOpen, setSupplierModalOpen] = useState(false);
  
  const { customers, loading: loadingCustomers, refetch: refetchCustomers } = useCustomers();
  const { suppliers, loading: loadingSuppliers, refetch: refetchSuppliers } = useSuppliers();

  const handleCustomerSuccess = () => {
    setCustomerModalOpen(false);
    refetchCustomers();
  };

  const handleSupplierSuccess = () => {
    setSupplierModalOpen(false);
    refetchSuppliers();
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        refetchCustomers();
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting customer");
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/suppliers/${id}`, { method: "DELETE" });
      if (res.ok) {
        refetchSuppliers();
      } else {
        alert("Failed to delete supplier");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting supplier");
    }
  };

  const customerColumns = [
    { key: "name", label: "Name", className: "font-medium" },
    { key: "address", label: "Location" },
    { key: "phone", label: "Phone" },
    { key: "type", label: "Type", render: (c: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${c.type === "retail" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
        {c.type.toUpperCase()}
      </span>
    ) },
    { key: "createdAt", label: "Date Created", render: (c: any) => new Date(c.createdAt).toLocaleDateString() },
    { key: "actions", label: "Actions", render: (c: any) => (
      <button
        onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(c.id); }}
        className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors"
      >
        Delete
      </button>
    ) },
  ];

  const supplierColumns = [
    { key: "name", label: "Supplier Name", className: "font-medium" },
    { key: "productType", label: "Product Type" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Location" },
    { key: "createdAt", label: "Date Added", render: (s: any) => new Date(s.createdAt).toLocaleDateString() },
    { key: "actions", label: "Actions", render: (s: any) => (
      <button
        onClick={(e) => { e.stopPropagation(); handleDeleteSupplier(s.id); }}
        className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors"
      >
        Delete
      </button>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customers and suppliers</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setSupplierModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            + Add Supplier
          </button>
          <button 
            onClick={() => setCustomerModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            + Add Customer
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("customers")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "customers" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Customers
        </button>
        <button 
          onClick={() => setActiveTab("suppliers")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "suppliers" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Suppliers
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {activeTab === "customers" ? (
          loadingCustomers ? (
            <Loader size="lg" />
          ) : (
            <DataTable 
              data={customers} 
              columns={customerColumns} 
              emptyMessage="No customers found. Add your first customer." 
            />
          )
        ) : (
          loadingSuppliers ? (
            <Loader size="lg" />
          ) : (
            <DataTable 
              data={suppliers} 
              columns={supplierColumns} 
              emptyMessage="No suppliers found. Add your first supplier." 
            />
          )
        )}
      </div>

      <Modal isOpen={isCustomerModalOpen} onClose={() => setCustomerModalOpen(false)} title="Add New Customer">
        <CustomerForm onSubmitSuccess={handleCustomerSuccess} onCancel={() => setCustomerModalOpen(false)} />
      </Modal>

      <Modal isOpen={isSupplierModalOpen} onClose={() => setSupplierModalOpen(false)} title="Add New Supplier">
        <SupplierForm onSubmitSuccess={handleSupplierSuccess} onCancel={() => setSupplierModalOpen(false)} />
      </Modal>
    </div>
  );
}
