import { saveAs } from 'file-saver';

interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface SaleRecord {
  id: string;
  timestamp: string;
  items: SaleItem[];
  total: number;
}

export const exportSalesToCsv = (sales: SaleRecord[], filename: string = 'sales_data.csv') => {
  if (sales.length === 0) {
    console.warn("No sales data to export.");
    return;
  }

  // Define CSV headers
  const headers = [
    "Sale ID",
    "Timestamp",
    "Product Name",
    "Quantity",
    "Unit Price",
    "Item Total",
    "Sale Total"
  ];

  // Map sales data to CSV rows
  const rows = sales.flatMap(sale => {
    return sale.items.map((item, index) => {
      const row = [
        `"${sale.id}"`, // Quote to handle commas in ID if any
        `"${sale.timestamp}"`,
        `"${item.name.replace(/"/g, '""')}"`, // Handle quotes in product names
        item.quantity,
        item.price.toFixed(2),
        (item.quantity * item.price).toFixed(2),
        index === 0 ? sale.total.toFixed(2) : '' // Only put sale total on the first item line
      ];
      return row.join(',');
    });
  });

  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};