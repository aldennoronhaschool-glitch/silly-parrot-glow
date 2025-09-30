import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react'; // Import an icon for removing items

interface SaleItem {
  productId: string;
  name: string;
  price: number;
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
  const subtotal = currentSaleItems.reduce(
    (sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), // Added Number() and || 0 for robustness
    0
  );

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
                  <p className="text-sm text-gray-600">${(Number(item.price) || 0).toFixed(2)} each</p> {/* Added Number() and || 0 */}
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
                  <span className="font-semibold text-lg w-20 text-right">
                    ${((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)} {/* Added Number() and || 0 for robustness */}
                  </span>
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
          <span>Total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleSummary;