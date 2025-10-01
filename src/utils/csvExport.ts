import { SaleRecord } from '@/pages/Index'; // Assuming SaleRecord is defined in Index.tsx for now

// Re-defining SaleItem interface to ensure it's available here
interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

// Re-defining SaleRecord interface to ensure it's available here
interface SaleRecord {
  id: string;
  timestamp: string;
  items: SaleItem[];
  totalBillAmount: number;
}


export const exportSalesToCsv = (salesHistory: SaleRecord[]) => {
  if (salesHistory.length === 0) {
    alert('No sales data to export.');
    return;
  }

  // Aggregate sales data by product
  const aggregatedProducts = new Map<string, { name: string; totalQuantity: number; totalRevenue: number }>();

  salesHistory.forEach(sale => {
    sale.items.forEach(item => {
      const productId = item.productId;
      if (!aggregatedProducts.has(productId)) {
        aggregatedProducts.set(productId, {
          name: item.name,
          totalQuantity: 0,
          totalRevenue: 0,
        });
      }
      const current = aggregatedProducts.get(productId)!;
      current.totalQuantity += item.quantity;
      current.totalRevenue += item.quantity * (item.price ?? 0); // Use price from item, default to 0
    });
  });

  const headers = ['Product ID', 'Product Name', 'Total Quantity Sold', 'Total Revenue'];
  const rows = Array.from(aggregatedProducts.entries()).map(([productId, data]) => [
    productId,
    data.name,
    data.totalQuantity,
    data.totalRevenue.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'aggregated_sales_summary.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Aggregated sales summary exported successfully!');
  }
};