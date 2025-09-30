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

export const exportSalesToCsv = (sales: SaleRecord[], filename: string = 'total_items_sold.csv') => {
  if (sales.length === 0) {
    console.warn("No sales data to export.");
    return;
  }

  // Aggregate quantities for each product
  const productQuantities = new Map<string, number>(); // Map<ProductName, TotalQuantity>

  sales.forEach(sale => {
    sale.items.forEach(item => {
      const currentQuantity = productQuantities.get(item.name) || 0;
      productQuantities.set(item.name, currentQuantity + item.quantity);
    });
  });

  // Define CSV headers
  const headers = [
    "Product Name",
    "Total Quantity Sold",
  ];

  // Map aggregated data to CSV rows
  const rows = Array.from(productQuantities.entries()).map(([productName, totalQuantity]) => {
    const row = [
      `"${productName.replace(/"/g, '""')}"`, // Handle quotes in product names
      totalQuantity,
    ];
    return row.join(',');
  });

  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};