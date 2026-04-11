"use client";

import React from "react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import Button from "@/components/common/Button";
import { UNITS } from "@/lib/constants/units";

interface ProductFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
}

const categories = [
  { value: "soap", label: "Soap" },
  { value: "shampoo", label: "Shampoo" },
  { value: "hair_oil", label: "Hair Oil" },
  { value: "conditioner", label: "Conditioner" },
  { value: "facewash", label: "Face Wash" },
  { value: "skincare", label: "Skincare" },
  { value: "detergents", label: "Detergents" },
  { value: "cleaning", label: "Cleaning Supplies" },
  { value: "personal_hygiene", label: "Personal Hygiene" },
  { value: "other", label: "Other" },
];
export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Product Name" name="name" defaultValue={initialData?.name as string} required />
        <InputField label="SKU" name="sku" defaultValue={initialData?.sku as string} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField label="Category" name="category" defaultValue={initialData?.category as string} options={categories} required />
        <SelectField label="Unit" name="unit" defaultValue={initialData?.unit as string} options={[...UNITS]} required />
        <SelectField 
          label="Sales Channel" 
          name="salesChannel" 
          defaultValue={(initialData?.salesChannel as string) || "both"} 
          options={[
            { value: "retail", label: "Retail Only" },
            { value: "wholesale", label: "Wholesale Only" },
            { value: "both", label: "Both" }
          ]} 
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Cost Price" name="costPrice" type="number" step="0.01" defaultValue={initialData?.costPrice as number} required />
        <InputField label="Retail Price" name="retailPrice" type="number" step="0.01" defaultValue={initialData?.retailPrice as number} required />
        <InputField label="Wholesale Price" name="wholesalePrice" type="number" step="0.01" defaultValue={initialData?.wholesalePrice as number} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Current Stock" name="currentStock" type="number" defaultValue={(initialData?.currentStock as number) || "0"} />
        <InputField label="Min Stock Level" name="minStock" type="number" defaultValue={(initialData?.minStock as number) || "10"} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData?.description as string}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save Product
        </Button>
      </div>
    </form>
  );
}
