"use client";

import React, { useState } from "react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import Button from "@/components/common/Button";
import { useProducts } from "@/hooks/useProducts";

export default function StockInForm({ onSuccess }: { onSuccess?: () => void }) {
  const { products } = useProducts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      setLoading(true);
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: data.productId,
          type: "in",
          quantity: Number(data.quantity),
          reason: data.reason as string,
          reference: data.reference as string,
        }),
      });

      if (!res.ok) throw new Error("Failed to add stock");
      form.reset();
      onSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-gray-900">Stock In</h3>
      <SelectField 
        label="Product" 
        name="productId" 
        options={products.map(p => ({ value: p.id, label: p.name }))} 
        required 
      />
      <InputField label="Quantity" name="quantity" type="number" min="1" required />
      <InputField label="Reason" name="reason" placeholder="e.g., Purchase, Return" />
      <InputField label="Reference" name="reference" placeholder="e.g., PO-001" />
      <Button type="submit" loading={loading}>Add Stock</Button>
    </form>
  );
}
