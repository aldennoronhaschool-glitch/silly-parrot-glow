import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Still needed if you reintroduce it later, but not used for product search
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { exportSalesToCsv } from '@/utils/csvExport';
import { PlusCircle, MinusCircle, Trash2, Download, History } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
}

interface CartItem extends Product {
  quantity: number;
}

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

const DUMMY_PRODUCTS: Product[] = [
  { id: '1', name: 'Cheese Balls' },
  { id: '2', name: 'Chicken Nuggets' },
  { id: '3', name: 'Chicken Momos' },
  { id: '4', name: 'Meat Cutlet (2)' },
  { id: '5', name: 'Meat Masala' },
  { id: '6', name: 'Chicken Tikka' },
  { id: '7', name: 'Chicken Kabab' },
  { id: '8', name: 'French Fries' },
];

const Index: React.FC = () => {
  const [products] = useState<Product[]>(DUMMY_PRODUCTS); // Removed setProducts as products are static
  // Removed searchTerm state and related functions
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSales = localStorage.getItem('salesHistory');
      return savedSales ? JSON.parse(savedSales) : [];
    }
    return [];
  });
  const [lastRecordedSaleId, setLastRecordedSaleId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    }
  }, [salesHistory]);

  // filteredProducts now always returns all products
  const filteredProducts = products;

  const handleProductSelect = (productId: string) => {
    const existingCartItem = cart.find((item) => item.id === productId);
    if (existingCartItem) {
      // If already in cart, remove it
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      // If not in cart, add it with quantity 1
      const productToAdd = products.find((product) => product.id === productId);
      if (productToAdd) {
        setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleRecordSale = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty. Add items before recording a sale.');
      return;
    }

    const newSale: SaleRecord = {
      id: `SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString(),
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
      })),
    };

    setSalesHistory((prevHistory) => {
      const updatedHistory = [newSale, ...prevHistory]; // Add new sales to the beginning for easier viewing
      setLastRecordedSaleId(newSale.id); // Store ID for undo
      return updatedHistory;
    });
    setCart([]); // Clear cart after recording sale
    toast.success('Sale recorded successfully!');
  };

  const handleUndoLastSale = () => {
    if (!lastRecordedSaleId) {
      toast.error('No sale to undo.');
      return;
    }

    setSalesHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter(
        (sale) => sale.id !== lastRecordedSaleId
      );
      setLastRecordedSaleId(null); // Clear the last sale ID after undo
      return filteredHistory;
    });
    toast.success('Last sale has been undone.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-gray-800">Billing Counter</h1>
        <div className="flex space-x-2">
          <Button
            onClick={handleUndoLastSale}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={!lastRecordedSaleId}
          >
            <History className="h-4 w-4" />
            <span>Undo Last Sale</span>
          </Button>
          <Button
            onClick={() => exportSalesToCsv(salesHistory)}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={salesHistory.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export Sales CSV</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Product Selection Column */}
        <aside className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Products</h2> {/* Added a title for clarity */}
          {/* Removed search input */}
          <ScrollArea className="flex-grow pr-2">
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  isSelected={cart.some((item) => item.id === product.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Sales Area (Current Sale) */}
        <main className="flex-grow bg-gray-50 p-4 flex flex-col w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Sale</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8 border rounded-lg bg-white h-full flex items-center justify-center">
              No items in cart. Select products from the left to start a sale.
            </p>
          ) : (
            <div className="flex-grow overflow-auto border rounded-lg bg-white shadow-sm">
              <Table>
                <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="w-[150px] text-center">Quantity</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="mx-1 font-semibold text-base">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleRecordSale}
              className="px-8 py-3 text-lg font-semibold"
              disabled={cart.length === 0}
            >
              Record Sale
            </Button>
          </div>
        </main>

        {/* Sales History Column */}
        <div className="w-1/4 bg-white border-l border-gray-200 p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales History</h2>
          {salesHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-lg flex-grow flex items-center justify-center">No sales recorded yet.</p>
          ) : (
            <ScrollArea className="flex-grow pr-2">
              <div className="space-y-4">
                {salesHistory.map((sale) => (
                  <div key={sale.id} className="border rounded-lg p-3 bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-700 text-sm">Sale ID: <span className="font-mono text-xs bg-gray-100 px-1 rounded">{sale.id.substring(sale.id.length - 8)}</span></h3>
                      <p className="text-xs text-gray-500">{new Date(sale.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <Separator className="mb-2" />
                    <ul className="list-disc pl-4 text-xs text-gray-600">
                      {sale.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-end mt-2 pt-1 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">
                            Total Items: {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;