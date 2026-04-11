import FormsAndHistory from "./components/FormsAndHistory";

export default function StockPage() {
  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stock Management</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Manage stock in and stock out operations</p>
      </div>

      <FormsAndHistory />
    </div>
  );
}
