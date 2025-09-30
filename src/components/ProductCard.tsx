import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Assuming cn utility is available from shadcn/ui setup

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isSelected }) => {
  return (
    <Card
      className={cn(
        "cursor-pointer hover:bg-gray-100 transition-colors",
        isSelected && "border-2 border-blue-500 bg-blue-50"
      )}
      onClick={() => onSelect(product.id)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;