import { prisma } from "@/lib/prisma";

export default async function StatsCards() {
  const products = await prisma.product.findMany();
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  
  const stats = [
    { label: "Total Products", value: totalProducts.toString(), icon: "📦", lightBg: "bg-purple-50/50 border-purple-100" },
    { label: "Low Stock Items", value: lowStockCount.toString(), icon: "⚠️", lightBg: "bg-amber-50/50 border-amber-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-lg transition-opacity duration-500 pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.lightBg} border transition-transform duration-300 shadow-sm`}>
              <span className="drop-shadow-sm">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
