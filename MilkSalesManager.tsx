
import React, { useState } from 'react';
import { FarmData, MilkSale } from './types';

interface Props {
  data: FarmData;
  onUpdate: (data: FarmData) => void;
  onBack: () => void;
}

const MilkSalesManager: React.FC<Props> = ({ data, onUpdate, onBack }) => {
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');

  const addSale = () => {
    if (!qty || !rate) return;
    const q = Number(qty);
    const r = Number(rate);
    const newSale: MilkSale = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      // Fixed: added missing required properties shift, fat, and snf
      shift: 'Morning',
      fat: 0,
      snf: 0,
      quantity: q,
      rate: r,
      totalAmount: q * r,
      laborCost: 150, // Example fixed cost
      feedCost: q * 15 // Example logic
    };
    onUpdate({ ...data, milkSales: [newSale, ...data.milkSales] });
    setQty('');
    setRate('');
  };

  const totalSales = data.milkSales.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-black text-emerald-600">₹{totalSales.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sold Today</p>
          <p className="text-xl font-black text-gray-800">
            {data.milkSales.find(s => s.date === new Date().toISOString().split('T')[0])?.quantity || 0} L
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
        <h3 className="font-bold text-gray-700">Record New Sale</h3>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="number" 
            placeholder="Quantity (L)" 
            className="border p-2 rounded-lg text-sm"
            value={qty}
            onChange={e => setQty(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Rate (₹/L)" 
            className="border p-2 rounded-lg text-sm"
            value={rate}
            onChange={e => setRate(e.target.value)}
          />
        </div>
        <button 
          onClick={addSale}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold"
        >
          Submit Daily Sale
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-gray-600 text-sm px-1">Recent Sales</h3>
        {data.milkSales.map(sale => (
          <div key={sale.id} className="bg-white px-4 py-3 rounded-lg border flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-gray-800">{sale.date}</p>
              <p className="text-xs text-gray-500">{sale.quantity}L @ ₹{sale.rate}/L</p>
            </div>
            <div className="text-right">
              <p className="font-black text-emerald-600">₹{sale.totalAmount}</p>
              <p className="text-[10px] text-gray-400">Net: ₹{sale.totalAmount - sale.laborCost - sale.feedCost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilkSalesManager;
