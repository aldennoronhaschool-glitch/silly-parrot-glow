import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface ItemCardProps {
  item: Item;
  onAddItem: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddItem }) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onAddItem(item)}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground">
          ${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
        </p>
        <Button onClick={() => onAddItem(item)} className="w-full mt-2">Add</Button>
      </CardContent>
    </Card>
  );
};

export default ItemCard;