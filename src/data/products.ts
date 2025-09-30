interface Product {
  id: string;
  name: string;
  price: number;
}

export const mockProducts: Product[] = [
  { id: 'prod-001', name: 'Cheese Balls', price: 5.00 },
  { id: 'prod-002', name: 'Chicken Nuggets', price: 7.50 },
  { id: 'prod-003', name: 'Chicken Momos', price: 6.00 },
  { id: 'prod-004', name: 'Meat Cutlet (2)', price: 8.00 },
  { id: 'prod-005', name: 'Meat Masala', price: 10.00 },
  { id: 'prod-006', name: 'Chicken Tikka', price: 12.00 },
  { id: 'prod-007', name: 'Chicken Kabab', price: 11.50 },
  { id: 'prod-008', name: 'French Fries', price: 4.00 },
];