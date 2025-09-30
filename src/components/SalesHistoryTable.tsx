import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface SalesHistoryTableProps {
  sales: SaleRecord[];
}

const SalesHistoryTable: React.FC<SalesHistoryTableProps> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Past Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">No sales recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Past Sales</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Items Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id.substring(0, 8)}...</TableCell> {/* Shorten ID for display */}
                <TableCell>{sale.timestamp}</TableCell>
                <TableCell>
                  {sale.items.map((item, index) => (
                    <div key={index}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalesHistoryTable;