import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  // You can add more product details here if needed, e.g., image, price
  // image?: string;
  // price?: number;
}

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isSelected }) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg ${
        isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'
      }`}
      onClick={() => onSelect(product.id)}
    >
      <CardContent className="flex flex-col items-center justify-center p-2 text-center h-full"> {/* Decreased padding */}
        {/* If you had product images, you might adjust their size here too */}
        {/* {product.image && <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mb-2" />} */}
        <h3 className="text-sm font-semibold mb-1 truncate w-full"> {/* Decreased font size */}
          {product.name}
        </h3>
        {/* Optionally add price here with smaller font */}
        {/* {product.price && <p className="text-xs text-gray-600">${product.price.toFixed(2)}</p>} */}
        <Button
          variant={isSelected ? 'default' : 'outline'}
          size="sm" // Decreased button size
          className="mt-1 w-full text-xs" // Decreased font size for button
        >
          {isSelected ? 'Added' : 'Add'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;