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

export const exportSalesToCsv = (salesHistory: SaleRecord[]) => {
  if (salesHistory.length === 0) {
    alert('No sales data to export!');
    return;
  }

  const headers = ['Sale ID', 'Timestamp', 'Product Name', 'Quantity'];
  let csvContent = headers.join(',') + '\n';

  salesHistory.forEach((sale) => {
    sale.items.forEach((item) => {
      csvContent += `${sale.id},"${sale.timestamp}","${item.name}",${item.quantity}\n`;
    });
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_data_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};