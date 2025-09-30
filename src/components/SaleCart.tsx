import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Define a type for your cart items if you don't have one already
interface CartItem {
  id: string;
  name: string;
  price?: number; // Make price optional as it might be undefined
  quantity: number;
}

interface SaleCartProps {
  cartItems: CartItem[]; // Assuming cart items are passed as a prop
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function SaleCart({ cartItems, onRemoveItem, onUpdateQuantity }: SaleCartProps) {
  // Calculate subtotal, ensuring price is treated as 0 if undefined
  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * (item.price ?? 0), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Cart</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your selected items before checkout.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    Quantity:
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 ml-2 inline-block"
                      min="1"
                    />
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price ?? 0).toFixed(2)}</p>
                  <Button variant="link" size="sm" onClick={() => onRemoveItem(item.id)}>Remove</Button>
                </div>
              </div>
            ))
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Subtotal:</span>
          <span>${(subtotal ?? 0).toFixed(2)}</span>
        </div>
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button type="submit">Proceed to Checkout</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}