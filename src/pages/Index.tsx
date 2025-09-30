import React, { useState } from 'react';
import SaleCart from '../components/SaleCart'; // Now importing as a default export

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const IndexPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Laptop', price: 1200.00, quantity: 1 },
    { id: '2', name: 'Mouse', price: 25.50, quantity: 2 },
    { id: '3', name: 'Keyboard', price: 75.00, quantity: 1 },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your App</h1>
      <p className="mb-6">This is your main page. Below is the Sale Cart component.</p>
      <SaleCart
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default IndexPage;