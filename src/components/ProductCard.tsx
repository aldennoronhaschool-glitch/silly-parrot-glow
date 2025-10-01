import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
}

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isSelected }) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg ${
        isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'
      }`}
      onClick={() => onSelect(product.id)}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
        <h3 className="text-md font-semibold truncate w-full">
          {product.name}
        </h3>
        {isSelected && (
          <CheckCircle2 className="absolute top-2 right-2 text-blue-600 h-5 w-5" />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;