"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { DownloadCloud, Undo2, X } from "lucide-react";
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
  const [currentSelection, setCurrentSelection] = useState([]); // Changed to an array for multiple items
  const salesHistory = useRef([]);

  useEffect(() => {
    const storedSales = localStorage.getItem('billingCounterSales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('billingCounterSales', JSON.stringify(sales));
  }, [sales]);

  const handleItemClick = (itemId) => {
    setCurrentSelection(prevSelection => {
      const existingItemIndex = prevSelection.findIndex(item => item.id === itemId);
      const itemToAdd = items.find(item => item.id === itemId);

      if (!itemToAdd) return prevSelection;

      if (existingItemIndex > -1) {
        // If item already exists, increment quantity
        const newSelection = [...prevSelection];
        newSelection[existingItemIndex].quantity += 1;
        return newSelection;
      } else {
        // If item is new, add it with quantity 1
        return [...prevSelection, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (itemId, quantity) => {
    const numQuantity = parseInt(quantity, 10);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      setCurrentSelection(prevSelection =>
        prevSelection.map(item =>
          item.id === itemId ? { ...item, quantity: numQuantity } : item
        )
      );
    } else if (quantity === "") {
       setCurrentSelection(prevSelection =>
        prevSelection.map(item =>
          item.id === itemId ? { ...item, quantity: "" } : item
        )
      );
    }
  };

  const removeItemFromSelection = (itemId) => {
    setCurrentSelection(prevSelection =>
      prevSelection.filter(item => item.id !== itemId)
    );
  };

  const addSelectionToSales = () => {
    if (currentSelection.length === 0) return;

    salesHistory.current.push([...sales]); // Save current state

    const newSalesEntries = currentSelection
      .filter(item => item.quantity !== "" && item.quantity > 0) // Ensure valid quantity
      .map(selectedItem => ({
        id: Date.now() + Math.random(), // Unique ID for each sale entry
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: selectedItem.quantity,
        total: selectedItem.price * selectedItem.quantity,
      }));

    setSales(prevSales => [...prevSales, ...newSalesEntries]);
    setCurrentSelection([]); // Clear the current selection
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
                  className={`w-full justify-center h-12 ${currentSelection.some(sel => sel.id === item.id) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Selection</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {currentSelection.length === 0 && <p className="text-gray-500 text-center">Select items to add</p>}

            {currentSelection.map((selectedItem) => (
              <div key={selectedItem.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-grow mr-2">
                  <p className="font-semibold text-sm">{selectedItem.name}</p>
                  <Input
                    type="number"
                    min="1"
                    value={selectedItem.quantity === "" ? "" : selectedItem.quantity}
                    onChange={(e) => handleQuantityChange(selectedItem.id, e.target.value)}
                    className="text-center h-8 w-20"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItemFromSelection(selectedItem.id)} className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </Button>
              </div>
            ))}
            {currentSelection.length > 0 && (
               <Button onClick={addSelectionToSales} className="w-full mt-4">Add to Sale</Button>
            )}
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