import { Sale } from '@/pages/SalesTracker';

export const exportSalesToCsv = (sales: Sale[]) => {
  if (sales.length === 0) return;

  const headers = ['Sale ID', 'Timestamp', 'Item Name', 'Quantity', 'Unit Price', 'Item Total'];
  let csvContent = headers.join(',') + '\n';

  sales.forEach(sale => {
    sale.items.forEach(item => {
      const row = [
        sale.id,
        new Date(sale.timestamp).toLocaleString(),
        item.name,
        item.quantity.toString(),
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2),
      ];
      csvContent += row.map(e => `"${e}"`).join(',') + '\n';
    });
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sales_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};