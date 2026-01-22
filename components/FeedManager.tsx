
import React, { useState } from 'react';
import { FarmData, FeedEntry } from '../types';

const FeedManager: React.FC<{ data: FarmData; onUpdate: (d: FarmData) => void; onBack: () => void }> = ({ data, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newFeed, setNewFeed] = useState<Partial<FeedEntry>>({
    name: '', type: 'Concentrate', currentStock: 0, dailyConsumption: 0, unitPrice: 0,
    batchNumber: '', proteinPercent: 18, expiryDate: '', supplier: ''
  });

  const addFeed = () => {
    if (!newFeed.name) return;
    const feed: FeedEntry = {
      id: Date.now().toString(),
      name: newFeed.name,
      type: newFeed.type as any,
      currentStock: Number(newFeed.currentStock),
      dailyConsumption: Number(newFeed.dailyConsumption),
      unitPrice: Number(newFeed.unitPrice),
      threshold: Number(newFeed.dailyConsumption) * 5,
      batchNumber: newFeed.batchNumber,
      proteinPercent: Number(newFeed.proteinPercent),
      expiryDate: newFeed.expiryDate,
      supplier: newFeed.supplier
    };
    onUpdate({ ...data, feeds: [...data.feeds, feed] });
    setShowAdd(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const totalMilk = data.milkSales.filter(s => s.date === today).reduce((a,c) => a + c.quantity, 0);
  const suggestedGrain = totalMilk * 0.4;

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-green-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <h2 className="text-2xl font-black mb-1">Advanced Nutrition</h2>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/20 mt-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-200">Recommended Grain</p>
          <p className="text-2xl font-black">{suggestedGrain.toFixed(1)} KG Today</p>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Supply Inventory</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="text-xs font-black text-green-600 underline">
          {showAdd ? 'CANCEL' : '+ ADD NEW FEED'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase">General Info</label>
            <input placeholder="Feed Name" className="w-full border p-4 rounded-2xl text-sm" value={newFeed.name} onChange={e => setNewFeed({...newFeed, name: e.target.value})} />
            <select className="w-full border p-4 rounded-2xl text-sm bg-gray-50" value={newFeed.type} onChange={e => setNewFeed({...newFeed, type: e.target.value as any})}>
               <option value="Concentrate">Grain/Dana</option>
               <option value="Silage">Silage</option>
               <option value="Green Fodder">Hara Chara</option>
               <option value="Dry Fodder">Bhusa</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <input type="number" placeholder="Price (₹/kg)" className="border p-4 rounded-2xl text-xs" onChange={e => setNewFeed({...newFeed, unitPrice: Number(e.target.value)})} />
             <input type="number" placeholder="Stock (kg)" className="border p-4 rounded-2xl text-xs" onChange={e => setNewFeed({...newFeed, currentStock: Number(e.target.value)})} />
             <input placeholder="Batch #" className="border p-4 rounded-2xl text-xs" onChange={e => setNewFeed({...newFeed, batchNumber: e.target.value})} />
             <input type="number" placeholder="Protein %" className="border p-4 rounded-2xl text-xs" onChange={e => setNewFeed({...newFeed, proteinPercent: Number(e.target.value)})} />
          </div>
          <button onClick={addFeed} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg">Register Feed Stock</button>
        </div>
      )}

      <div className="space-y-4">
        {data.feeds.map(feed => {
          const daysLeft = Math.floor(feed.currentStock / (feed.dailyConsumption || 1));
          return (
            <div key={feed.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
              {feed.proteinPercent && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[8px] font-black border border-blue-100">
                    {feed.proteinPercent}% PROTEIN
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl">🌾</div>
                <div>
                  <h4 className="font-black text-gray-800 text-base">{feed.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Batch: {feed.batchNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Current Stock</p>
                  <p className="text-xl font-black text-gray-800">{feed.currentStock} KG</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-green-600 uppercase mb-1">Est. {daysLeft} Days</p>
                  <p className="text-sm font-black text-gray-400">₹{feed.unitPrice}/kg</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedManager;
