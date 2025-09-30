import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import SaleSummary from '../components/SaleSummary';
import SaleControls from '../components/SaleControls';
import { mockProducts } from '../data/products';
import { exportSalesToCsv } from '../utils/csvExport';
import { v4 as uuidv4 } from 'uuid';

// Define types for better type safety
interface Product {
  id: string;
  name: string;
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

const IndexPage: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [currentSaleItems, setCurrentSaleItems] = useState<SaleItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>(() => {
    // Load sales history from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedSales = localStorage.getItem('salesHistory');
      return savedSales ? JSON.parse(savedSales) : [];
    }
    return [];
  });

  // Effect to save sales history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    }
  }, [salesHistory]);

  const handleProductSelection = useCallback((productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCurrentSaleItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        // If item exists, increment quantity
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: (Number(item.quantity) || 0) + 1 } : item
        );
      } else {
        // If item is new, add it with quantity 1
        return [...prevItems, { productId: product.id, name: product.name, quantity: 1 }];
      }
    });
  }, [products]);

  const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCurrentSaleItems((prevItems) =>
      prevItems
        .map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity becomes 0 or less
    );
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCurrentSaleItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const handleRecordSale = useCallback(() => {
    if (currentSaleItems.length === 0) return;

    const newSale: SaleRecord = {
      id: uuidv4(), // Generate a unique ID for the sale
      timestamp: new Date().toLocaleString(),
      items: currentSaleItems,
    };

    setSalesHistory((prevHistory) => [...prevHistory, newSale]);
    setCurrentSaleItems([]); // Clear current sale after recording
  }, [currentSaleItems]);

  const handleUndoLastSale = useCallback(() => {
    setSalesHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  }, []);

  const handleExportSales = useCallback(() => {
    exportSalesToCsv(salesHistory);
  }, [salesHistory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Billing Counter (Quantity Tracker)</h1>
      </header>

      <main className="flex-grow container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection Area */}
        <section className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto flex-grow pr-2">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleProductSelection}
                isSelected={currentSaleItems.some((item) => item.productId === product.id)}
              />
            ))}
          </div>
        </section>

        {/* Sale Summary and Controls Area */}
        <section className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <SaleSummary
            currentSaleItems={currentSaleItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
          <SaleControls
            onRecordSale={handleRecordSale}
            onUndoLastSale={handleUndoLastSale}
            onExportSales={handleExportSales}
            hasCurrentSaleItems={currentSaleItems.length > 0}
            hasSalesHistory={salesHistory.length > 0}
          />
        </section>
      </main>
    </div>
  );
};

export default IndexPage;