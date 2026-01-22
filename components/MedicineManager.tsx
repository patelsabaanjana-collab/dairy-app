
import React, { useState } from 'react';
import { FarmData, Medicine } from '../types';

const MedicineManager: React.FC<{ data: FarmData; onUpdate: (d: FarmData) => void; onBack: () => void }> = ({ data, onUpdate }) => {
  const [name, setName] = useState('');
  const [targetId, setTargetId] = useState('');
  const [dose, setDose] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [threshold, setThreshold] = useState('2'); // Default alert at 2 units

  const addMed = () => {
    if(!name || !targetId || !dose) return;
    const med: Medicine = {
      id: Date.now().toString(),
      name,
      targetId,
      dosePerDay: dose,
      price: Number(price) || 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      currentStock: Number(stock) || 0,
      threshold: Number(threshold) || 1
    };
    onUpdate({...data, medicines: [...data.medicines, med]});
    setName(''); setTargetId(''); setDose(''); setPrice(''); setStock(''); setThreshold('2');
  };

  const getTargetInfo = (id: string) => {
    const cow = data.cows.find(c => c.id === id);
    if (cow) return { name: cow.name, sub: `#${cow.cowNumber}`, type: 'COW' };
    
    const calf = data.calves.find(c => c.id === id);
    if (calf) return { name: calf.name || 'Unnamed Calf', sub: `Tag: ${calf.tagId}`, type: 'CALF' };
    
    return { name: "Unknown", sub: "ID: " + id, type: 'OTHER' };
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-rose-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">Medical Protocol</h2>
          <p className="text-rose-100 text-sm opacity-80">Herd health & dispensary management</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Prescription Details</h3>
        <input 
          placeholder="Medicine Name (e.g. Advil/Oxytocin)" 
          className="w-full border-gray-100 border-2 p-4 rounded-2xl text-sm outline-none focus:border-rose-200 transition-all" 
          value={name} 
          onChange={e=>setName(e.target.value)}
        />
        
        <div className="space-y-1">
          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Assign to Animal</label>
          <select 
            className="w-full border-gray-100 border-2 p-4 rounded-2xl text-sm bg-gray-50 outline-none focus:border-rose-200" 
            value={targetId} 
            onChange={e=>setTargetId(e.target.value)}
          >
            <option value="">Choose Cow or Calf...</option>
            <optgroup label="🐄 Active Herd (Cows)">
              {data.cows.map(c => <option key={c.id} value={c.id}>{c.name} (Tag: {c.tagId})</option>)}
            </optgroup>
            <optgroup label="🍼 Young Stock (Calves)">
              {data.calves.map(c => <option key={c.id} value={c.id}>{c.name || 'Calf'} (Tag: {c.tagId})</option>)}
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Daily Dose" className="border-gray-100 border-2 p-4 rounded-2xl text-sm outline-none" value={dose} onChange={e=>setDose(e.target.value)}/>
          <input type="number" placeholder="Cost (₹)" className="border-gray-100 border-2 p-4 rounded-2xl text-sm outline-none" value={price} onChange={e=>setPrice(e.target.value)}/>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Units in Stock</label>
            <input type="number" placeholder="Qty" className="w-full border-gray-100 border-2 p-4 rounded-2xl text-sm outline-none" value={stock} onChange={e=>setStock(e.target.value)}/>
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Alert Threshold</label>
            <input type="number" placeholder="Min level" className="w-full border-gray-100 border-2 p-4 rounded-2xl text-sm outline-none" value={threshold} onChange={e=>setThreshold(e.target.value)}/>
          </div>
        </div>

        <button onClick={addMed} className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black shadow-lg shadow-rose-100 active:scale-95 transition-all">REGISTER TREATMENT</button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest px-2">Active Dispensary</h3>
        {data.medicines.map(m => {
          const info = getTargetInfo(m.targetId);
          const isLow = m.currentStock <= m.threshold;
          const isOut = m.currentStock <= 0;

          return (
            <div key={m.id} className={`bg-white p-6 rounded-[2.5rem] border transition-all ${isLow ? 'border-rose-200' : 'border-gray-100'} shadow-sm`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-2xl ${isOut ? 'bg-gray-100 text-gray-400' : 'bg-rose-50 text-rose-500 shadow-inner'}`}>
                    {isOut ? '🫙' : '💊'}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-lg leading-tight">{m.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                        info.type === 'COW' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {info.type}
                      </span>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                        {info.name} <span className="text-gray-300 font-medium">({info.sub})</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-rose-600">{m.dosePerDay}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Daily Dose</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Inventory Status</p>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-xl font-black ${isOut ? 'text-gray-400' : isLow ? 'text-rose-600 animate-pulse' : 'text-gray-800'}`}>
                      {m.currentStock}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Units Left</p>
                  </div>
                </div>
                {isLow && (
                  <div className="bg-rose-600 text-white px-4 py-2 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-tighter">{isOut ? 'STOCK EMPTY' : 'LOW STOCK'}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4 px-1">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Protocol Start: {m.startDate}</p>
                <p className="text-[9px] text-gray-800 font-black">Est. Value: ₹{m.price}</p>
              </div>
            </div>
          );
        })}
        {data.medicines.length === 0 && (
          <div className="py-12 text-center opacity-30 grayscale">
            <span className="text-5xl">🩹</span>
            <p className="text-xs font-black uppercase tracking-widest mt-4">No active treatments recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineManager;
