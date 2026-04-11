"use client";

import { useState } from "react";
import StockInForm from "./StockInForm";
import StockOutForm from "./StockOutForm";
import MovementHistory from "./MovementHistory";

export default function FormsAndHistory() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <StockInForm onSuccess={handleSuccess} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <StockOutForm onSuccess={handleSuccess} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <MovementHistory refreshKey={refreshKey} />
      </div>
    </div>
  );
}
