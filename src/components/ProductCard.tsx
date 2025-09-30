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
        <CardTitle className="text-lg text-center">{product.name}</CardTitle> {/* Centered text */}
      </CardHeader>
      {/* Price removed from CardContent */}
      <CardContent className="flex items-center justify-center h-12">
         {/* No content needed here as price is removed */}
      </CardContent>
    </Card>
  );
};

export default ProductCard;