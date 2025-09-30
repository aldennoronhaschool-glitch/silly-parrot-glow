import { saveAs } from 'file-saver';

interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
}

interface SaleRecord {
  id: string;
  timestamp: string;
  items: SaleItem[];
}

export const exportSalesToCsv = (sales: SaleRecord[], filename: string = 'sales_data.csv') => {
  if (sales.length === 0) {
    console.warn("No sales data to export.");
    return;
  }

  // Define CSV headers without price or total columns
  const headers = [
    "Sale ID",
    "Timestamp",
    "Product Name",
    "Quantity",
  ];

  // Map sales data to CSV rows, excluding price and total
  const rows = sales.flatMap(sale => {
    return sale.items.map((item) => {
      const row = [
        `"${sale.id}"`, // Quote to handle commas in ID if any
        `"${sale.timestamp}"`,
        `"${item.name.replace(/"/g, '""')}"`, // Handle quotes in product names
        item.quantity,
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