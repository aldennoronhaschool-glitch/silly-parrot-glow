interface Product {
  id: string;
  name: string;
  price: number;
}

export const mockProducts: Product[] = [
  { id: 'prod-001', name: 'Coffee (Small)', price: 2.50 },
  { id: 'prod-002', name: 'Coffee (Medium)', price: 3.00 },
  { id: 'prod-003', name: 'Coffee (Large)', price: 3.50 },
  { id: 'prod-004', name: 'Espresso', price: 2.00 },
  { id: 'prod-005', name: 'Latte', price: 4.00 },
  { id: 'prod-006', name: 'Cappuccino', price: 4.00 },
  { id: 'prod-007', name: 'Croissant', price: 3.00 },
  { id: 'prod-008', name: 'Muffin', price: 2.75 },
  { id: 'prod-009', name: 'Sandwich', price: 6.50 },
  { id: 'prod-010', name: 'Water Bottle', price: 1.50 },
  { id: 'prod-011', name: 'Juice', price: 2.25 },
  { id: 'prod-012', name: 'Pastry', price: 3.20 },
];