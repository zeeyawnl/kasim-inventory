import CustomerHistory from "../components/CustomerHistory";

export default function CustomerDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
        <p className="text-sm text-gray-500 mt-1">View customer information and history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Information</h3>
          <p className="text-sm text-gray-500">Customer details will appear here</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <CustomerHistory />
        </div>
      </div>
    </div>
  );
}
