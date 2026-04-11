import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default async function AdminOverviewData() {
  const products = await prisma.product.findMany();
  const inventoryValue = products.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStock && p.currentStock > 0).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const todaysOrders = await prisma.order.findMany({
    where: { status: "completed", createdAt: { gte: today } }
  });
  const todaySales = todaysOrders.reduce((acc, order) => acc + order.total, 0);

  const monthlyOrders = await prisma.order.findMany({
    where: { status: "completed", createdAt: { gte: firstDayOfMonth } }
  });
  const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + order.total, 0);

  const pendingOrders = await prisma.order.count({
    where: { status: "pending" }
  });

  const totalCustomers = await prisma.customer.count();

  const stats = [
    { label: "Today's Sales", value: formatCurrency(todaySales), icon: "💰", lightBg: "bg-green-50/50 border-green-100" },
    { label: "Monthly Revenue", value: formatCurrency(monthlyRevenue), icon: "📈", lightBg: "bg-blue-50/50 border-blue-100" },
    { label: "Inventory Value", value: formatCurrency(inventoryValue), icon: "🏦", lightBg: "bg-slate-50/50 border-slate-200" },
    { label: "Pending Orders", value: pendingOrders.toString(), icon: "⏳", lightBg: "bg-orange-50/50 border-orange-100" },
    { label: "Low / Out of Stock", value: `${lowStockCount} / ${outOfStockCount}`, icon: "⚠️", lightBg: "bg-red-50/50 border-red-100" },
    { label: "Total Customers", value: totalCustomers.toString(), icon: "👥", lightBg: "bg-indigo-50/50 border-indigo-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-xl transition-opacity duration-500 pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${stat.lightBg} border group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              <span className="drop-shadow-sm">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
