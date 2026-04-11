"use client";

import React from "react";

export default function InvoiceForm({ type = "retail" }: { type?: string }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        New {type === "retail" ? "Retail" : "Wholesale"} Invoice
      </h3>
      <p className="text-sm text-gray-500">Invoice form coming soon</p>
    </div>
  );
}
