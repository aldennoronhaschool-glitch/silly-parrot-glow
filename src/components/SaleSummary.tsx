import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
}

interface SaleSummaryProps {
  currentSaleItems: SaleItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({
  currentSaleItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Current Sale</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {currentSaleItems.length === 0 ? (
          <p className="text-gray-500 italic flex-grow flex items-center justify-center">
            Select items to add to the sale.
          </p>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            {currentSaleItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex-grow">
                  <h4 className="font-medium">{item.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Separator className="my-4" />
        <div className="flex justify-between items-center text-xl font-bold mt-auto pt-2">
          <span>Total Items:</span>
          <span>{currentSaleItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleSummary;