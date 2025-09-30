import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SaleCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCompleteSale: () => void;
}

const SaleCart: React.FC<SaleCartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCompleteSale,
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Current Sale</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-muted-foreground text-center">No items in cart</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-2 border rounded-md">
                <span className="flex-grow">{item.name} (${item.price.toFixed(2)})</span>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                />
                <Button variant="destructive" size="icon" onClick={() => onRemoveItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="p-6 border-t">
        <div className="flex justify-between items-center text-lg font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button onClick={onCompleteSale} disabled={cartItems.length === 0} className="w-full">
          Complete Sale
        </Button>
      </div>
    </Card>
  );
};

export default SaleCart;