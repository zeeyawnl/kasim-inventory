import AdminOverviewData from "./components/AdminOverviewData";
import AdminLock from "./components/AdminLock";

export default function OverviewPage() {
  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Critical metrics and executive summary</p>
      </div>

      <AdminLock>
        <AdminOverviewData />
      </AdminLock>
    </div>
  );
}
