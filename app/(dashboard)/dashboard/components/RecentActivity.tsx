import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default async function RecentActivity() {
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const recentStockMovements = await prisma.stockMovement.findMany({
    take: 5,
    where: { NOT: { reason: "Sale" } },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const mappedOrders = recentOrders.map((order) => {
    const productNames = order.items.map(i => i.product.name).join(", ");
    const displayName = productNames.length > 40 ? productNames.substring(0, 37) + "..." : productNames;
    return {
      id: `order-${order.id}`,
      action: order.type === "retail" ? "Sold (R)" : "Sold (W)",
      item: displayName || `Order ${order.orderNumber}`,
      amount: formatCurrency(order.total),
      timestamp: order.createdAt,
      time: order.createdAt.toLocaleDateString(),
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      icon: order.type === "retail" ? "🏪" : "🚚",
      color: order.type === "retail" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600",
      amountColor: order.type === "retail" ? "text-green-600" : "text-purple-600",
    };
  });

  const mappedStock = recentStockMovements.map((movement) => ({
    id: `stock-${movement.id}`,
    action: movement.type === "in" ? "Stock In" : "Stock Out",
    item: movement.product.name,
    amount: `${movement.type === "in" ? "+" : "-"}${movement.quantity} units`,
    timestamp: movement.createdAt,
    time: movement.createdAt.toLocaleDateString(),
    status: movement.type === "in" ? "Added" : "Removed",
    icon: movement.type === "in" ? "📦" : "📦",
    color: movement.type === "in" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600",
    amountColor: movement.type === "in" ? "text-blue-600" : "text-red-600",
  }));

  const activities = [...mappedOrders, ...mappedStock]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
          <p className="text-[11px] font-medium text-gray-500 mt-0.5">Latest transactions & movements</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="px-4 py-3 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-base shadow-inner group-hover:scale-105 transition-transform ${activity.color}`}>
                <span>{activity.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">{activity.action}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-medium text-gray-600 truncate max-w-[140px] md:max-w-[180px]">{activity.item}</span>
                  <span className="w-1 h-1 flex-shrink-0 rounded-full bg-gray-300"></span>
                  <span className="text-[11px] font-semibold text-gray-400 flex-shrink-0">{activity.time}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end flex-shrink-0 ml-3">
              <p className={`font-extrabold text-sm ${activity.amountColor}`}>{activity.amount}</p>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                activity.status === 'Completed' ? 'bg-green-100 text-green-700' :
                activity.status === 'Updated' ? 'bg-blue-100 text-blue-700' :
                activity.status === 'Added' ? 'bg-green-100 text-green-700' :
                activity.status === 'Removed' ? 'bg-red-100 text-red-700' :
                activity.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

