import StatsCards from "./components/StatsCards";
import LowStockList from "./components/LowStockList";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-500 tracking-tight">CITY SHOP CENTRE</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Dashboard Overview &bull; Welcome back!</p>
        </div>
        <QuickActions />
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main Grid — side by side on tablet */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <RecentActivity />
        </div>
        <div className="md:col-span-2">
          <LowStockList />
        </div>
      </div>
    </div>
  );
}
