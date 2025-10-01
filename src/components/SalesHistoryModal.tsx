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
import { Separator } from '@/components/ui/separator';

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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Sales History</DialogTitle>
          <DialogDescription>
            A detailed record of all completed sales.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden mt-4">
          {sales.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-lg">No sales recorded yet.</p>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {sales.map((sale, index) => (
                  <div key={sale.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">Sale ID: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{sale.id}</span></h3>
                      <p className="text-sm text-gray-500">{sale.timestamp}</p>
                    </div>
                    <Separator className="mb-3" />
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-right w-[100px]">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sale.items.map((item, itemIndex) => (
                          <TableRow key={itemIndex}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
                        <p className="text-md font-semibold text-gray-700">
                            Total Items: {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesHistoryModal;