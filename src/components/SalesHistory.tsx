import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sale } from '@/pages/SalesTracker'; // Importing Sale interface from the main page

interface SalesHistoryProps {
  sales: Sale[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {sales.length === 0 ? (
          <p className="text-muted-foreground text-center">No sales recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {new Date(sale.timestamp).toLocaleTimeString()}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {new Date(sale.timestamp).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {sale.items.map((item, index) => (
                      <div key={index}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesHistory;