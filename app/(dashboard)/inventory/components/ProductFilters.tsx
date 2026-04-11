"use client";

import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";

interface ProductFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
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

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange?.({ [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <InputField
          label="Search"
          name="search"
          placeholder="Search by name or SKU..."
          onChange={handleChange}
        />
      </div>
      <div className="w-48">
        <SelectField
          label="Category"
          name="category"
          options={categories}
          placeholder="All Categories"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
