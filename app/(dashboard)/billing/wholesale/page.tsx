"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import Loader from "@/components/common/Loader";

interface CartItem {
  product: any;
  quantity: number;
}

export default function WholesalePOSPage() {
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const itemsPerPage = 6;

  const wholesaleProducts = products.filter((p) => !p.salesChannel || p.salesChannel === "wholesale" || p.salesChannel === "both");
  const filteredProducts = wholesaleProducts.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== id));
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === id ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => setCart([]);
  const total = cart.reduce((acc, item) => acc + item.product.wholesalePrice * item.quantity, 0);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      const orderData = {
        orderNumber: `WHO-${Date.now()}`,
        type: "wholesale",
        status: "completed",
        subtotal: total,
        total: total,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.wholesalePrice,
          total: item.product.wholesalePrice * item.quantity
        }))
      };

      const res = await fetch(`${getBaseUrl()}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        throw new Error("Failed to save order");
      }

      window.print();
      setTimeout(() => clearCart(), 1000);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // Changed: Used md:flex-row to trigger side-by-side on tablets, adjusting gap sizes.
    <div className="h-full min-h-[calc(100vh-200px)] flex flex-col md:flex-row gap-4 lg:gap-6">

      {/* Products Left Section */}
      <div className="flex-1 flex flex-col h-[600px] md:h-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Wholesale Billing</h2>
              <p className="text-xs font-medium text-gray-500">Tap products to add to invoice</p>
            </div>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search products by name or SKU..."
            className="w-full px-4 py-2.5 border text-black border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          />
        </div>

        <div className="p-4 lg:p-6 flex-1 overflow-y-auto bg-gray-50/30">
          {loading ? (
            <div className="flex justify-center py-12"><Loader size="lg" /></div>
          ) : wholesaleProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-medium">No wholesale products found in inventory.</div>
          ) : (
            // Changed: Grid set to 2 columns on md to fit beside the cart, 3 columns on lg
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
              {currentProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5 text-left hover:border-emerald-500 hover:shadow-md transition-all active:scale-95 flex flex-col justify-between aspect-[4/3] group relative overflow-hidden"
                >
                  <div className="mb-2 z-10">
                    <p className="text-xs font-bold text-gray-400 mb-1">{product.sku}</p>
                    <h3 className="text-sm lg:text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
                  </div>
                  <div className="z-10 mt-auto">
                    <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] lg:text-xs font-bold rounded mb-1 lg:mb-2">
                      Stock: {product.currentStock}
                    </span>
                    <p className="text-lg lg:text-xl font-black text-emerald-600">{formatCurrency(product.wholesalePrice)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold disabled:opacity-50 transition hover:bg-gray-200">Prev</button>
          <span className="text-xs lg:text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold disabled:opacity-50 transition hover:bg-gray-200">Next</button>
        </div>
      </div>

      {/* Cart Right Section */}
      {/* Changed: Added dynamic widths for md and lg, and independent height scrolling */}
      <div className="w-full md:w-[320px] lg:w-[360px] xl:w-[420px] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-[500px] md:h-auto md:max-h-full print:hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100 bg-emerald-600 text-white flex justify-between items-center shadow-inner">
          <h2 className="text-lg lg:text-xl font-bold">Current Bill</h2>
          <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] lg:text-xs font-bold text-white uppercase tracking-wider">Wholesale POS</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 pt-16">
              <span className="text-5xl lg:text-6xl drop-shadow-sm grayscale opacity-60">🛒</span>
              <p className="font-bold text-base lg:text-lg">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between p-3 border border-emerald-100 bg-emerald-50/30 rounded-xl shadow-sm hover:shadow transition">
                <div className="flex-1 pr-2 lg:pr-3">
                  <h4 className="text-sm lg:text-base font-bold text-gray-900 leading-tight">{item.product.name}</h4>
                  <p className="text-xs lg:text-sm text-emerald-600 font-extrabold mt-1">{formatCurrency(item.product.wholesalePrice)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-gray-400 rounded-lg text-lg font-bold hover:bg-red-50 hover:text-red-600 transition border border-gray-200 bg-white">-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 h-7 lg:w-14 lg:h-8 text-center font-bold text-gray-900 border border-gray-200 rounded-lg text-xs lg:text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-gray-400 rounded-lg text-lg font-bold hover:bg-green-50 hover:text-green-600 transition border border-gray-200 bg-white">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 lg:p-6 border-t border-gray-100 bg-gray-50 space-y-3 lg:space-y-4 shadow-inner">
          <div className="flex justify-between items-center pb-3 lg:pb-4 border-b border-gray-200">
            <span className="font-bold text-gray-500 text-base lg:text-lg uppercase tracking-wide">Total</span>
            <span className="text-2xl lg:text-4xl font-black text-gray-900 drop-shadow-sm">{formatCurrency(total)}</span>
          </div>
          <button disabled={cart.length === 0 || isProcessing} onClick={handleConfirmOrder} className="w-full py-3 lg:py-4 bg-emerald-600 text-white font-bold text-lg lg:text-xl rounded-xl hover:bg-emerald-700 transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 lg:gap-3">
            <span className="text-xl lg:text-2xl">🖨️</span> {isProcessing ? "Processing..." : "Confirm & Print"}
          </button>
          <button disabled={cart.length === 0 || isProcessing} onClick={clearCart} className="w-full py-2 lg:py-2.5 text-gray-400 font-bold text-xs lg:text-sm hover:bg-red-50 hover:text-red-500 rounded-lg transition disabled:text-gray-300 disabled:hover:bg-transparent">
            Clear Cart
          </button>
        </div>
      </div>

      {/* Print View (Unchanged) */}
      <div className="hidden print:block fixed top-0 left-0 w-screen min-h-screen bg-white z-[9999] p-8 font-mono text-black">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 inline-block">City Shop Centre</h1>
          <p className="text-lg mt-3">Shop no. B-10, sachdeo arcade, Subhash Rd,</p>
          <p className="text-lg">Rajwada Nagar, Nashik, Maharashtra 422001</p>
          <p className="text-lg mt-1 font-bold">Contact: +91 8379898206</p>
          <p className="text-xl mt-4 font-bold border border-black inline-block px-4 py-1 uppercase rounded">Wholesale Invoice</p>
        </div>

        <div className="flex justify-between border-b-2 border-dashed border-black pb-6 mb-6 text-lg">
          <div>
            <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
            <p><span className="font-bold">Time:</span> {new Date().toLocaleTimeString()}</p>
          </div>
          <div className="text-right">
            <p className="font-black text-2xl uppercase">INVOICE</p>
            <p className="mt-1">Wholesale POS System</p>
          </div>
        </div>

        <table className="w-full text-lg mb-8 border-b-2 border-dashed border-black pb-6">
          <thead>
            <tr className="text-left border-b border-black">
              <th className="pb-3 text-2xl">Product</th>
              <th className="pb-3 text-center text-2xl">Qty</th>
              <th className="pb-3 text-right text-2xl">Unit Price</th>
              <th className="pb-3 text-right text-2xl">Amount</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.product.id} className="border-b border-gray-200">
                <td className="py-4 pr-4">{item.product.name}</td>
                <td className="py-4 text-center font-bold">{item.quantity}</td>
                <td className="py-4 text-right">{item.product.wholesalePrice.toFixed(2)}</td>
                <td className="py-4 text-right font-bold">{(item.product.wholesalePrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center text-3xl font-black border-b-2 border-dashed border-black pb-6 mb-8">
          <span>GRAND TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <div className="text-center text-xl mt-12 space-y-3 font-bold">
          <p>Thank you for your wholesale business!</p>
          <div className="mt-8 pt-4 flex flex-col items-center opacity-70">
            <p className="text-sm text-gray-600 font-normal">Software by Zeeya</p>
            <p className="text-sm text-gray-600 font-normal">Ph: +91 7823842448</p>
          </div>
        </div>
      </div>
    </div>
  );
}