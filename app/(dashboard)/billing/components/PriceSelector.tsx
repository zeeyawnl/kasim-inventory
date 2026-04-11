"use client";

interface PriceSelectorProps {
  type: "retail" | "wholesale";
  retailPrice: number;
  wholesalePrice: number;
}

export default function PriceSelector({
  type,
  retailPrice,
  wholesalePrice,
}: PriceSelectorProps) {
  const price = type === "retail" ? retailPrice : wholesalePrice;

  return (
    <span className="font-medium text-gray-900">
      ₹{price.toFixed(2)}
    </span>
  );
}
