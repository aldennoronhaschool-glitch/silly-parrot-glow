import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface SalesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: SaleRecord[];
}

const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({ isOpen, onClose, sales }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Sales History</DialogTitle>
          <DialogDescription>
            A record of all completed sales.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          {sales.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No sales recorded yet.</p>
          ) : (
            <ScrollArea className="h-full w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Sale ID</TableHead>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium text-xs">{sale.id}</TableCell>
                      <TableCell className="text-sm">{sale.timestamp}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 text-sm">
                          {sale.items.map((item, index) => (
                            <li key={index}>
                              {item.name} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesHistoryModal;