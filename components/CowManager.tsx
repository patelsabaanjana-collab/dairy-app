
import React, { useState } from 'react';
import { FarmData, Cow, FeedingProgramStep, InvestmentRecord, LifeStatus } from '../types';

interface CowManagerProps {
  data: FarmData;
  onUpdate: (data: FarmData) => void;
  onBack: () => void;
}

const CowManager: React.FC<CowManagerProps> = ({ data, onUpdate, onBack }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [newCow, setNewCow] = useState<Partial<Cow>>({
    name: '', cowNumber: '', tagId: '', breed: '', status: 'Milking',
    milkingCapacity: 0, weight: 0, purchasePrice: 0, feedingProgram: [], investments: [],
    isBought: true
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const updateLifeStatus = (cowId: string, status: LifeStatus) => {
    let salePrice = 0;
    if (status === 'Sold') {
      const price = prompt("Enter Sale Price (₹):");
      if (price === null) return;
      salePrice = Number(price);
    } else if (status === 'Dead') {
      if (!confirm("Are you sure you want to mark this cow as DEAD?")) return;
    }

    onUpdate({
      ...data,
      cows: data.cows.map(c => c.id === cowId ? { ...c, lifeStatus: status, salePrice } : c)
    });
  };

  const logInvestment = (cowId: string) => {
    const category = prompt("Select Category: 1.Feed, 2.Medicine, 3.Genetic, 4.Other", "1");
    const catMap: Record<string, InvestmentRecord['category']> = { "1": "Feed", "2": "Medicine", "3": "Genetic", "4": "Other" };
    const selectedCat = catMap[category || "4"] || "Other";
    
    const desc = prompt("Investment Description:");
    const amt = prompt("Amount (₹):");
    if (!desc || !amt) return;

    const inv: InvestmentRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: todayStr,
      category: selectedCat,
      amount: Number(amt),
      description: desc
    };

    onUpdate({
      ...data,
      cows: data.cows.map(c => c.id === cowId ? { ...c, investments: [...(c.investments || []), inv] } : c)
    });
  };

  const addStatusFeed = (cowId: string, status: 'Milking' | 'Dry') => {
    const name = status === 'Milking' ? 'Milking Ration' : 'Dry Maintenance';
    const cost = status === 'Milking' ? '180' : '90';
    
    const step: FeedingProgramStep = {
      id: Math.random().toString(36).substr(2, 9),
      startAgeDays: 0,
      endAgeDays: 9999,
      feedName: name,
      dailyQty: 5,
      dailyCost: Number(cost)
    };

    onUpdate({
      ...data,
      cows: data.cows.map(c => c.id === cowId ? { ...c, feedingProgram: [...(c.feedingProgram || []), step] } : c)
    });
  };

  const handleAdd = () => {
    if (!newCow.name || !newCow.cowNumber) return;
    const cow: Cow = {
      id: Date.now().toString(),
      name: newCow.name || 'Unnamed',
      cowNumber: newCow.cowNumber || '000',
      tagId: newCow.tagId || 'No-Tag',
      breed: newCow.breed || 'Jersey',
      status: (newCow.status as Cow['status']) || 'Milking',
      milkingCapacity: newCow.milkingCapacity || 0,
      weight: newCow.weight || 400,
      feedChart: 'Standard',
      purchasePrice: newCow.purchasePrice || 0,
      protocols: [],
      feedingProgram: [],
      investments: [],
      isBought: true,
      lifeStatus: 'Active'
    };
    onUpdate({ ...data, cows: [...data.cows, cow] });
    setShowAdd(false);
    setNewCow({ name: '', cowNumber: '', tagId: '', breed: '', status: 'Milking', purchasePrice: 0, isBought: true });
  };

  const displayedCows = data.cows.filter(c => showArchive ? (c.lifeStatus !== 'Active') : (c.lifeStatus === 'Active'));

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Herd Management</h2>
          <button onClick={() => setShowArchive(!showArchive)} className="text-[9px] font-black text-emerald-600 underline">
            {showArchive ? 'SHOW ACTIVE HERD' : 'VIEW SOLD/DEAD RECORDS'}
          </button>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black">
          {showAdd ? 'CLOSE' : '+ BUY NEW COW'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-emerald-50 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" className="col-span-2 border p-4 rounded-2xl" value={newCow.name} onChange={e => setNewCow({...newCow, name: e.target.value})} />
            <input placeholder="Cow #" className="border p-4 rounded-2xl" value={newCow.cowNumber} onChange={e => setNewCow({...newCow, cowNumber: e.target.value})} />
            <input type="number" placeholder="Purchase Price (₹)" className="border p-4 rounded-2xl" value={newCow.purchasePrice || ''} onChange={e => setNewCow({...newCow, purchasePrice: Number(e.target.value)})} />
          </div>
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">REGISTER ASSET</button>
        </div>
      )}

      <div className="space-y-4">
        {displayedCows.map(cow => {
          const medCosts = data.medicines.filter(m => m.targetId === cow.id).reduce((a, b) => a + b.price, 0);
          const totalInv = cow.purchasePrice + medCosts + (cow.investments || []).reduce((a, b) => a + b.amount, 0);

          return (
            <div key={cow.id} className={`bg-white p-6 rounded-[3rem] shadow-sm border space-y-6 ${cow.lifeStatus === 'Dead' ? 'opacity-60 grayscale' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-3xl ${cow.lifeStatus === 'Active' ? 'bg-amber-50' : 'bg-gray-100'}`}>
                    {cow.lifeStatus === 'Dead' ? '💀' : '🐮'}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-none">
                      {cow.name} <span className="text-emerald-600 ml-1">₹{totalInv.toLocaleString()}</span>
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      TAG: {cow.tagId} • {cow.lifeStatus}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => logInvestment(cow.id)} className="bg-gray-100 p-2 rounded-xl text-lg" title="Add Investment">💰</button>
                  {cow.lifeStatus === 'Active' && (
                    <div className="relative group">
                      <button className="bg-gray-100 p-2 rounded-xl text-lg">⚙️</button>
                      <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-2xl rounded-2xl border p-2 z-50 w-32">
                        <button onClick={() => updateLifeStatus(cow.id, 'Sold')} className="w-full text-left text-[10px] font-black p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 uppercase">Mark as Sold</button>
                        <button onClick={() => updateLifeStatus(cow.id, 'Dead')} className="w-full text-left text-[10px] font-black p-2 hover:bg-rose-50 rounded-lg text-rose-600 uppercase">Mark as Dead</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {cow.lifeStatus === 'Active' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feed Portfolio</h4>
                    <div className="flex gap-2">
                      <button onClick={() => addStatusFeed(cow.id, 'Milking')} className="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-black">MILKING DIET</button>
                      <button onClick={() => addStatusFeed(cow.id, 'Dry')} className="text-[8px] bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-black">DRY DIET</button>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {(cow.feedingProgram || []).map(step => (
                      <div key={step.id} className="min-w-[140px] bg-gray-50 p-3 rounded-2xl border border-gray-100 flex-shrink-0">
                        <p className="text-[10px] font-black text-gray-800 truncate">{step.feedName}</p>
                        <p className="text-[9px] font-bold text-emerald-600">₹{step.dailyCost}/day</p>
                      </div>
                    ))}
                    {cow.feedingProgram.length === 0 && <p className="text-[9px] text-gray-300 font-bold italic p-2">No active feed plan</p>}
                  </div>
                </div>
              )}

              {cow.lifeStatus === 'Sold' && (
                <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase">Sold Revenue</p>
                  <p className="text-xl font-black text-emerald-800">₹{cow.salePrice?.toLocaleString()}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CowManager;
