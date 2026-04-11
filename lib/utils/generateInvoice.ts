import { formatCurrency } from "./formatCurrency";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  orderNumber: string;
  date: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  type: "retail" | "wholesale";
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const itemsRows = data.items
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${formatCurrency(item.total)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${data.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        .totals { margin-top: 20px; text-align: right; }
        .totals p { margin: 5px 0; }
        .total-final { font-size: 1.2em; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <p>Order #${data.orderNumber}</p>
        <p>Date: ${data.date}</p>
        <p>Type: ${data.type.toUpperCase()}</p>
      </div>

      ${
        data.customerName
          ? `
        <div class="details">
          <h3>Customer Details</h3>
          <p>Name: ${data.customerName}</p>
          ${data.customerPhone ? `<p>Phone: ${data.customerPhone}</p>` : ""}
          ${data.customerAddress ? `<p>Address: ${data.customerAddress}</p>` : ""}
        </div>
      `
          : ""
      }

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="totals">
        <p>Subtotal: ${formatCurrency(data.subtotal)}</p>
        <p>Tax: ${formatCurrency(data.tax)}</p>
        <p>Discount: ${formatCurrency(data.discount)}</p>
        <p class="total-final">Total: ${formatCurrency(data.total)}</p>
      </div>

      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
    </body>
    </html>
  `;
}
