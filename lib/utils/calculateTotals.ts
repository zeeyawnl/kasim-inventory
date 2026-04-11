interface OrderItem {
  quantity: number;
  price: number;
}

export function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function calculateTax(subtotal: number, taxRate: number = 0): number {
  return subtotal * (taxRate / 100);
}

export function calculateDiscount(subtotal: number, discountPercent: number = 0): number {
  return subtotal * (discountPercent / 100);
}

export function calculateTotal(
  subtotal: number,
  tax: number = 0,
  discount: number = 0
): number {
  return subtotal + tax - discount;
}

export function calculateItemTotal(quantity: number, price: number): number {
  return quantity * price;
}
