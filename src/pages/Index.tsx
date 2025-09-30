import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { exportSalesToCsv } from '@/utils/csvExport';
import { PlusCircle, MinusCircle, Trash2, Download } from 'lucide-react';
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
  { id: '1', name: 'Meat Masala' },
  { id: '2', name: 'Chicken Masala' },
  { id: '3', name: 'Garam Masala' },
  { id: '4', name: 'Paneer Masala' },
  { id: '5', name: 'Fish Masala' },
  { id: '6', name: 'Biryani Masala' },
  { id: '7', name: 'Tea Powder' },
  { id: '8', name: 'Coffee Beans' },
  { id: '9', name: 'Sugar' },
  { id: '10', name: 'Salt' },
  { id: '11', name: 'Turmeric Powder' },
  { id: '12', name: 'Red Chilli Powder' },
];

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedSales = localStorage.getItem('salesHistory');
      return savedSales ? JSON.parse(savedSales) : [];
    }
    return [];
  });

  useEffect(() => {
    // Save to localStorage whenever salesHistory changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    }
  }, [salesHistory]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (productId: string) => {
    const existingCartItem = cart.find((item) => item.id === productId);
    if (existingCartItem) {
      setCart(cart.filter((item) => item.id !== productId));
    } else {
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
        .filter((item) => item.quantity > 0)
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

    setSalesHistory((prevHistory) => [...prevHistory, newSale]);
    setCart([]); // Clear cart after recording sale
    toast.success('Sale recorded successfully!');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sales Register</h1>
        <Button onClick={() => exportSalesToCsv(salesHistory)} variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Sales CSV</span>
        </Button>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Product Selection Sidebar */}
        <aside className="w-1/3 bg-white border-r border-gray-200 p-4 flex flex-col">
          <Input
            type="text"
            placeholder="Search products..."
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="flex-grow pr-2">
            <div className="grid grid-cols-2 gap-2"> {/* Adjusted gap for smaller cards */}
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

        {/* Main Sales Area */}
        <main className="flex-grow p-4 flex flex-col bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Current Sale</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items in cart. Select products from the left.</p>
          ) : (
            <div className="flex-grow overflow-auto border rounded-lg bg-white">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7"
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
              className="px-6 py-3 text-lg" // Make it larger and more prominent
              disabled={cart.length === 0}
            >
              Record Sale
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;