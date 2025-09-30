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

  // Define CSV headers
  const headers = [
    "Sale ID",
    "Timestamp",
    "Items Sold", // Consolidated column for all items
  ];

  // Map sales data to CSV rows, consolidating items for each sale
  const rows = sales.map(sale => {
    // Format items into a single string: "Item Name (xQuantity), Another Item (xQuantity)"
    const itemsSoldString = sale.items.map(item =>
      `${item.name} (x${item.quantity})`
    ).join('; '); // Using semicolon to avoid conflict with potential commas in item names/quantities

    const row = [
      `"${sale.id}"`, // Quote to handle commas in ID if any
      `"${sale.timestamp}"`,
      `"${itemsSoldString.replace(/"/g, '""')}"`, // Handle quotes within the items string
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