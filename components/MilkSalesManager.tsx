
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FarmData, MilkSale } from '../types';

interface Props {
  data: FarmData;
  onUpdate: (data: FarmData) => void;
  onBack: () => void;
}

const MilkSalesManager: React.FC<Props> = ({ data, onUpdate, onBack }) => {
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');
  const [fat, setFat] = useState('');
  const [snf, setSnf] = useState('');
  const [shift, setShift] = useState<'Morning' | 'Evening'>('Morning');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
              { text: "Extract milk slip data: Quantity (liters), Fat (%), SNF (%), and Rate per liter (INR). Return ONLY valid JSON with fields: qty, fat, snf, rate. Use 0 if not found." }
            ]
          }
        });

        try {
          const result = JSON.parse(response.text.replace(/```json|```/g, '').trim());
          setQty(result.qty?.toString() || '');
          setFat(result.fat?.toString() || '');
          setSnf(result.snf?.toString() || '');
          setRate(result.rate?.toString() || '');
        } catch (e) {
          alert("Could not parse slip clearly. Please try again or enter manually.");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const addSale = () => {
    if (!qty || !rate) return;
    const q = Number(qty);
    const r = Number(rate);
    const newSale: MilkSale = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      shift,
      quantity: q,
      fat: Number(fat) || 0,
      snf: Number(snf) || 0,
      rate: r,
      totalAmount: q * r,
      // Fixed: added missing laborCost and feedCost required by MilkSale interface
      laborCost: 150,
      feedCost: q * 15
    };
    onUpdate({ ...data, milkSales: [newSale, ...data.milkSales] });
    setQty(''); setRate(''); setFat(''); setSnf('');
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySales = data.milkSales.filter(s => s.date === today);
  const dailyTotal = todaySales.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-200">Today's Revenue</p>
            <p className="text-4xl font-black">₹{dailyTotal.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all flex items-center gap-2"
          >
            {isScanning ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>📷 Scan Slip</span>}
          </button>
        </div>
        <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleScan} />
      </div>

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button onClick={() => setShift('Morning')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${shift === 'Morning' ? 'bg-white shadow-sm text-sky-600' : 'text-gray-400'}`}>Morning</button>
          <button onClick={() => setShift('Evening')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${shift === 'Evening' ? 'bg-white shadow-sm text-sky-600' : 'text-gray-400'}`}>Evening</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Quantity (L)</label>
            <input type="number" placeholder="0.00" className="w-full border p-3 rounded-2xl text-sm" value={qty} onChange={e => setQty(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Rate (₹/L)</label>
            <input type="number" placeholder="0.00" className="w-full border p-3 rounded-2xl text-sm" value={rate} onChange={e => setRate(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Fat (%)</label>
            <input type="number" placeholder="0.0" className="w-full border p-3 rounded-2xl text-sm" value={fat} onChange={e => setFat(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">SNF (%)</label>
            <input type="number" placeholder="0.0" className="w-full border p-3 rounded-2xl text-sm" value={snf} onChange={e => setSnf(e.target.value)} />
          </div>
        </div>

        <button onClick={addSale} className="w-full bg-sky-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-sky-100">Save Sale Record</button>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-gray-800 text-sm px-1">Collection History</h3>
        {data.milkSales.map(sale => (
          <div key={sale.id} className="bg-white p-4 rounded-3xl border border-gray-50 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${sale.shift === 'Morning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {sale.shift === 'Morning' ? '☀️' : '🌙'}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{sale.date}</p>
                <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase">
                  <span>{sale.quantity}L</span>
                  <span>F:{sale.fat}%</span>
                  <span>S:{sale.snf}%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-emerald-600 text-base">₹{sale.totalAmount}</p>
              <p className="text-[9px] text-gray-400 font-bold">₹{sale.rate}/L</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilkSalesManager;
