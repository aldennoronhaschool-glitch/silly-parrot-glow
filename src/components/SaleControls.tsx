import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Download } from 'lucide-react'; // Icons for undo and export

interface SaleControlsProps {
  onRecordSale: () => void;
  onUndoLastSale: () => void;
  onExportSales: () => void;
  hasCurrentSaleItems: boolean;
  hasSalesHistory: boolean;
}

const SaleControls: React.FC<SaleControlsProps> = ({
  onRecordSale,
  onUndoLastSale,
  onExportSales,
  hasCurrentSaleItems,
  hasSalesHistory,
}) => {
  return (
    <div className="flex flex-col space-y-4 p-4 border-t">
      <Button
        onClick={onRecordSale}
        disabled={!hasCurrentSaleItems}
        className="w-full py-3 text-lg"
      >
        Record Sale
      </Button>
      <div className="flex space-x-4">
        <Button
          onClick={onUndoLastSale}
          disabled={!hasSalesHistory}
          variant="outline"
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Undo Last Sale
        </Button>
        <Button
          onClick={onExportSales}
          disabled={!hasSalesHistory}
          variant="outline"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" /> Export Sales (CSV)
        </Button>
      </div>
    </div>
  );
};

export default SaleControls;