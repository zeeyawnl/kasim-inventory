import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Link href="/inventory/add" className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 font-bold text-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
        <span className="mr-2 bg-white/20 w-7 h-7 rounded-md flex items-center justify-center text-base">+</span> Add Product
      </Link>
      <Link href="/billing/retail" className="inline-flex items-center justify-center px-5 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all shadow-sm font-bold text-sm">
        <span className="mr-2 text-lg">🏪</span> Retail
      </Link>
      <Link href="/billing/wholesale" className="inline-flex items-center justify-center px-5 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all shadow-sm font-bold text-sm">
        <span className="mr-2 text-lg">📦</span> Wholesale
      </Link>
    </div>
  );
}

