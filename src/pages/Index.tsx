"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { DownloadCloud, Undo2 } from "lucide-react";
import * as XLSX from 'xlsx';

const items = [
  { id: 1, name: "Coffee", price: 2.50 },
  { id: 2, name: "Tea", price: 2.00 },
  { id: 3, name: "Pastry", price: 3.00 },
  { id: 4, name: "Sandwich", price: 5.50 },
  { id: 5, name: "Water Bottle", price: 1.50 },
];

const Index = () => {
  const [sales, setSales] = useState([]);
  const [currentSale, setCurrentSale] = useState({ itemId: null, quantity: 1 });
  const salesHistory = useRef([]);

  useEffect(() => {
    // Load sales from local storage if available
    const storedSales = localStorage.getItem('billingCounterSales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }
  }, []);

  useEffect(() => {
    // Save sales to local storage whenever sales state changes
    localStorage.setItem('billingCounterSales', JSON.stringify(sales));
  }, [sales]);

  const handleItemClick = (itemId) => {
    setCurrentSale({ itemId, quantity: 1 });
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setCurrentSale({ ...currentSale, quantity });
    } else if (e.target.value === "") {
      setCurrentSale({ ...currentSale, quantity: "" });
    }
  };

  const addSale = () => {
    if (currentSale.itemId !== null && currentSale.quantity !== "" && currentSale.quantity > 0) {
      salesHistory.current.push([...sales]); // Save current state before making changes
      const newItem = items.find(item => item.id === currentSale.itemId);
      if (newItem) {
        setSales(prevSales => [
          ...prevSales,
          {
            id: Date.now(),
            name: newItem.name,
            price: newItem.price,
            quantity: currentSale.quantity,
            total: newItem.price * currentSale.quantity
          }
        ]);
      }
      setCurrentSale({ itemId: null, quantity: 1 });
    }
  };

  const undoLastSale = () => {
    if (salesHistory.current.length > 0) {
      setSales(salesHistory.current.pop());
    }
  };

  const exportToExcel = () => {
    if (sales.length === 0) {
      alert("No sales data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  const totalAmount = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Billing Counter</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full justify-center h-12 ${currentSale.itemId === item.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {currentSale.itemId && (
              <>
                <p className="text-lg font-semibold">
                  {items.find(item => item.id === currentSale.itemId)?.name}
                </p>
                <Input
                  type="number"
                  min="1"
                  value={currentSale.quantity === "" ? "" : currentSale.quantity}
                  onChange={handleQuantityChange}
                  placeholder="Quantity"
                  className="text-center"
                />
                <Button onClick={addSale} className="w-full">Add to Sale</Button>
              </>
            )}
            {!currentSale.itemId && <p className="text-gray-500">Select an item</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.name}</TableCell>
                  <TableCell>${sale.price.toFixed(2)}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end items-center space-x-4">
            <p className="text-lg font-bold">Total: ${totalAmount.toFixed(2)}</p>
            <Button onClick={undoLastSale} variant="outline" className="space-x-2">
              <Undo2 size={16} />
              <span>Undo Last</span>
            </Button>
            <Button onClick={exportToExcel} className="space-x-2">
              <DownloadCloud size={16} />
              <span>Export to Excel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;