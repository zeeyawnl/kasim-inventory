"use client";

import { formatCurrency } from "@/lib/utils/formatCurrency";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  retailPrice: number;
  wholesalePrice: number;
}

interface ProductTableProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No products found. Add your first product.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">SKU</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Stock</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Retail</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Wholesale</th>
            <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
              <td className="px-4 py-3 text-gray-600">{product.sku}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`font-medium ${
                    product.currentStock <= product.minStock
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {product.currentStock}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(product.retailPrice)}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(product.wholesalePrice)}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(product.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(product.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
