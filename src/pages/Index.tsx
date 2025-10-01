import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price?: number;
}

interface SaleRecord {
  id: string;
  timestamp: string;
  items: SaleItem[];
  totalBillAmount: number;
}

const DUMMY_PRODUCTS: Product[] = [
  { id: '1', name: 'Cheese Balls', price: 120.00 },
  { id: '2', name: 'Chicken Nuggets', price: 250.50 },
  { id: '3', name: 'Chicken Momos', price: 180.00 },
  { id: '4', name: 'Meat Cutlet (2)', price: 90.00 },
  { id: '5', name: 'Meat Masala', price: 75.25 },
  { id: '6', name: 'Chicken Tikka', price: 320.00 },
  { id: '7', 'name': 'Chicken Kabab', price: 280.00 },
  { id: '8', name: 'French Fries', price: 60.00 },
];

const Index: React.FC = () => {
  const [products] = useState<Product[]>(DUMMY_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSales = localStorage.getItem('salesHistory');
      if (savedSales) {
        const parsedSales: SaleRecord[] = JSON.parse(savedSales);
        return parsedSales.map(sale => {
          const itemsWithSafePrices = sale.items.map(item => ({
            ...item,
            price: item.price ?? 0
          }));
          const reCalculatedTotal = itemsWithSafePrices.reduce(
            (sum, item) => sum + item.quantity * (item.price ?? 0),
            0
          );
          return {
            ...sale,
            items: itemsWithSafePrices,
            totalBillAmount: reCalculatedTotal
          };
        });
      }
      return [];
    }
    return [];
  });
  const [lastRecordedSaleId, setLastRecordedSaleId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
      if (salesHistory.length > 0) {
        setLastRecordedSaleId(salesHistory[0].id);
      } else {
        setLastRecordedSaleId(null);
      }
    }
  }, [salesHistory]);

  const filteredProducts = products;

  const handleProductSelect = (productId: string) => {
    const existingCartItem = cart.find((item) => item.id === productId);
    if (existingCartItem) {
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      const productToAdd = products.find((product) => product.id === productId);
      if (productToAdd) {
        setCart([...cart, { ...productToAdd, quantity: 1, price: productToAdd.price }]);
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

    const newSaleItems: SaleItem[] = cart.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price ?? 0,
    }));

    const totalBillAmount = newSaleItems.reduce(
      (sum, item) => sum + item.quantity * (item.price ?? 0),
      0
    );

    const newSale: SaleRecord = {
      id: `SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString(),
      items: newSaleItems,
      totalBillAmount: totalBillAmount,
    };

    setSalesHistory((prevHistory) => {
      const updatedHistory = [newSale, ...prevHistory];
      return updatedHistory;
    });
    setCart([]);
    toast.success('Sale recorded successfully!');
  };

  const handleUndoLastSale = () => {
    if (salesHistory.length === 0) {
      toast.error('No sales recorded to undo.');
      return;
    }

    setSalesHistory((prevHistory) => prevHistory.slice(1));
    toast.success('Last sale has been undone.');
  };

  const currentSaleTotal = cart.reduce((sum, item) => sum + item.quantity * (item.price ?? 0), 0);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Billing Counter</h1>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            onClick={handleUndoLastSale}
            variant="outline"
            className="flex items-center space-x-1 sm:space-x-2"
            disabled={salesHistory.length === 0}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Undo Last Sale</span>
            <span className="sm:hidden">Undo</span>
          </Button>
          <Button
            onClick={() => exportSalesToCsv(salesHistory)}
            variant="outline"
            className="flex items-center space-x-1 sm:space-x-2"
            disabled={salesHistory.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Sales CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </header>

      {/* Changed flex-grow container: removed overflow-hidden */}
      <div className="flex flex-grow md:flex-row flex-col">
        {/* Mobile specific layout with Tabs - Added overflow-y-auto */}
        <div className="md:hidden w-full flex flex-col p-4 overflow-y-auto">
          <Tabs defaultValue="current-sale" className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current-sale">Current Sale</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="current-sale" className="flex-grow flex flex-col pt-4">
              {/* Products Section - Removed ScrollArea */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Select Products:</h3>
                <div className="grid grid-cols-2 gap-3 p-2 border rounded-lg bg-white">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={handleProductSelect}
                      isSelected={cart.some((item) => item.id === product.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Current Sale Section */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Sale</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 border rounded-lg bg-white flex-grow flex items-center justify-center mb-6">
                  No items in cart. Select products to start a sale.
                </p>
              ) : (
                <>
                  {/* Current Sale Table - Removed max-h and overflow-y-auto */}
                  <div className="border rounded-lg bg-white shadow-sm mb-4">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="w-[100px] text-center">Qty</TableHead>
                          <TableHead className="w-[100px] text-right">Price</TableHead>
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
                            <TableCell className="text-right">₹{((item.price ?? 0) * item.quantity).toFixed(2)}</TableCell>
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
                  <div className="flex justify-between items-center p-2 border-t bg-white rounded-lg shadow-sm mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Total: ₹{currentSaleTotal.toFixed(2)}</h3>
                    <Button
                      onClick={handleRecordSale}
                      variant="default"
                      className="px-8 py-3 text-lg font-semibold"
                      disabled={cart.length === 0}
                    >
                      Record Sale
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="history" className="flex-grow flex flex-col pt-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales History</h2>
              {salesHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-lg flex-grow flex items-center justify-center">No sales recorded yet.</p>
              ) : (
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
                          <li key={itemIndex} className="flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>₹{((item.price ?? 0) * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">
                          Total Items: {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>
                        <p className="text-md font-bold text-gray-800">
                          Bill: ₹{sale.totalBillAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop specific layout - Hidden on mobile */}
        <aside className="hidden md:flex w-1/4 bg-white border-r border-gray-200 p-4 flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Products</h2>
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

        <main className="hidden md:flex flex-grow bg-gray-50 p-4 flex-col w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Sale</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8 border rounded-lg bg-white h-full flex items-center justify-center">
              No items in cart. Select products from the left to start a sale.
            </p>
          ) : (
            <>
              <div className="flex-grow overflow-auto border rounded-lg bg-white shadow-sm">
                <Table>
                  <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px] text-center">Qty</TableHead>
                      <TableHead className="w-[100px] text-right">Price</TableHead>
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
                        <TableCell className="text-right">₹{((item.price ?? 0) * item.quantity).toFixed(2)}</TableCell>
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
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Total: ₹{currentSaleTotal.toFixed(2)}</h3>
                <Button
                  onClick={handleRecordSale}
                  variant="default"
                  className="px-8 py-3 text-lg font-semibold"
                  disabled={cart.length === 0}
                >
                  Record Sale
                </Button>
              </div>
            </>
          )}
        </main>

        <div className="hidden md:flex w-1/4 bg-white border-l border-gray-200 p-4 flex-col">
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
                        <li key={itemIndex} className="flex justify-between">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>₹{((item.price ?? 0) * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-700">
                        Total Items: {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                      <p className="text-md font-bold text-gray-800">
                        Bill: ₹{sale.totalBillAmount.toFixed(2)}
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