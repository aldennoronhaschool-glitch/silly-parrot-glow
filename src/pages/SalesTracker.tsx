import React, { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard';
import SaleCart, { CartItem } from '@/components/SaleCart';
import SalesHistory from '@/components/SalesHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { exportSalesToCsv } from '@/utils/exportToCsv';
import { Toaster } from '@/components/ui/toaster';


interface Item {
  id: string;
  name: string;
  price: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
}

const predefinedItems: Item[] = [
  { id: '1', name: 'Coffee', price: 2.50 },
  { id: '2', name: 'Croissant', price: 3.00 },
  { id: '3', name: 'Sandwich', price: 7.50 },
  { id: '4', name: 'Juice', price: 3.25 },
  { id: '5', name: 'Muffin', price: 2.75 },
  { id: '6', name: 'Salad', price: 8.00 },
  { id: '7', name: 'Water Bottle', price: 1.50 },
  { id: '8', name: 'Pastry', price: 4.00 },
];

const SalesTracker: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>(() => {
    // Load sales history from local storage on initial render
    const savedSales = localStorage.getItem('salesHistory');
    return savedSales ? JSON.parse(savedSales) : [];
  });

  useEffect(() => {
    // Save sales history to local storage whenever it changes
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
  }, [salesHistory]);

  const handleAddItemToCart = (item: Item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    toast({
      title: "Item added",
      description: `${item.name} added to cart.`,
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.id === id ? { ...item, quantity: quantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity drops to 0
    );
  };

  const handleRemoveItemFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item removed from cart.",
    });
  };

  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      toast({
        title: "No items",
        description: "Please add items to the cart before completing a sale.",
        variant: "destructive",
      });
      return;
    }

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      timestamp: Date.now(),
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    setSalesHistory((prevHistory) => [...prevHistory, newSale]);
    setCartItems([]); // Clear cart after sale
    toast({
      title: "Sale Completed!",
      description: `Total: $${newSale.total.toFixed(2)}`,
    });
  };

  const handleUndoLastSale = () => {
    if (salesHistory.length > 0) {
      const lastSale = salesHistory[salesHistory.length - 1];
      setSalesHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove last sale
      // Optionally, add items back to cart or log for review
      toast({
        title: "Sale Undone",
        description: `Sale ${lastSale.id} has been undone.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "No sales to undo",
        description: "There are no previous sales in the history.",
      });
    }
  };

  const handleExportSales = () => {
    exportSalesToCsv(salesHistory);
    toast({
      title: "Exporting Sales",
      description: "Your sales data is being downloaded as sales_data.csv.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Toaster />
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Available Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {predefinedItems.map((item) => (
            <ItemCard key={item.id} item={item} onAddItem={handleAddItemToCart} />
          ))}
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={handleUndoLastSale} variant="outline" disabled={salesHistory.length === 0}>
            Undo Last Sale
          </Button>
          <Button onClick={handleExportSales} disabled={salesHistory.length === 0}>
            Export to Excel (CSV)
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Sales History</h2>
        <Card className="h-[400px]">
            <SalesHistory sales={salesHistory} />
        </Card>
      </div>

      <div>
        <SaleCart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveItemFromCart}
          onCompleteSale={handleCompleteSale}
        />
      </div>
    </div>
  );
};

export default SalesTracker;