"use client";

import React from "react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import Button from "@/components/common/Button";

export default function CustomerForm({ onSubmitSuccess, onCancel }: { onSubmitSuccess?: () => void, onCancel?: () => void }) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      setLoading(true);
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save customer");
      onSubmitSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Customer Name" name="name" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Phone" name="phone" type="tel" />
        <InputField label="Location" name="address" />
      </div>
      <SelectField
        label="Customer Type"
        name="type"
        options={[
          { value: "retail", label: "Retail" },
          { value: "wholesale", label: "Wholesale" },
        ]}
      />
      <div className="flex justify-end gap-3 mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Customer</Button>
      </div>
    </form>
  );
}
