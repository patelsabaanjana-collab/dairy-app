
import React, { useState } from 'react';
import { FarmData, Calf, WeightRecord, FeedingProgramStep, InvestmentRecord, LifeStatus } from '../types';

interface Props {
  data: FarmData;
  onUpdate: (data: FarmData) => void;
  onBack: () => void;
}

const GrowthChart = ({ history }: { history: WeightRecord[] }) => {
  if (history.length < 2) {
    return (
      <div className="bg-gray-50 rounded-[2rem] py-8 flex flex-col items-center justify-center border border-dashed border-gray-200">
        <span className="text-2xl mb-2 opacity-40">📊</span>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Needs 2+ weight logs</p>
      </div>
    );
  }

  const weights = history.map(h => h.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 10;
  const yMin = minW - (range * 0.3);
  const yMax = maxW + (range * 0.4);
  const yRange = yMax - yMin;
  const width = 400;
  const height = 120;
  const paddingX = 25;
  const paddingY = 20;

  const getX = (i: number) => (i / (history.length - 1)) * (width - 2 * paddingX) + paddingX;
  const getY = (w: number) => height - ((w - yMin) / yRange) * (height - 2 * paddingY) - paddingY;

  const points = history.map((h, i) => `${getX(i)},${getY(h.weight)}`).join(' ');

  return (
    <div className="bg-blue-50/30 rounded-[2.5rem] p-4 border border-blue-100/50">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-sm overflow-visible">
        <polyline fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {history.map((h, i) => (
          <circle key={i} cx={getX(i)} cy={getY(h.weight)} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
};

const CalfManager: React.FC<Props> = ({ data, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [newCalf, setNewCalf] = useState({
    name: '', tagId: '', dob: '', motherId: '', birthWeight: '', initialCost: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const updateLifeStatus = (calfId: string, status: LifeStatus) => {
    let salePrice = 0;
    if (status === 'Sold') {
      const price = prompt("Enter Sale Price (₹):");
      if (price === null) return;
      salePrice = Number(price);
    } else if (status === 'Dead') {
      if (!confirm("Are you sure you want to mark this calf as DEAD?")) return;
    }

    onUpdate({
      ...data,
      calves: data.calves.map(c => c.id === calfId ? { ...c, lifeStatus: status, salePrice } : c)
    });
  };

  const addFeedingProgram = (calfId: string, template?: { s: number, e: number, n: string, c: number }) => {
    let start = template?.s.toString() || prompt("Start Age (Days):", "0");
    let end = template?.e.toString() || prompt("End Age (Days):", "90");
    let name = template?.n || prompt("Feed Name:", "Calf Starter");
    let cost = template?.c.toString() || prompt("Daily Cost (₹):", "40");

    if (!name || !cost) return;

    const step: FeedingProgramStep = {
      id: Math.random().toString(36).substr(2, 9),
      startAgeDays: Number(start),
      endAgeDays: Number(end),
      feedName: name,
      dailyQty: 1,
      dailyCost: Number(cost)
    };

    onUpdate({
      ...data,
      calves: data.calves.map(c => c.id === calfId ? { ...c, feedingProgram: [...(c.feedingProgram || []), step] } : c)
    });
  };

  const logManualInvestment = (calfId: string) => {
    const category = prompt("Select Category: 1.Feed, 2.Medicine, 3.Genetic, 4.Other", "1");
    const catMap: Record<string, InvestmentRecord['category']> = { "1": "Feed", "2": "Medicine", "3": "Genetic", "4": "Other" };
    const selectedCat = catMap[category || "4"] || "Other";
    
    const desc = prompt("Expense Description (e.g. Vaccination, Vet):");
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
      calves: data.calves.map(c => c.id === calfId ? { ...c, investments: [...(c.investments || []), inv] } : c)
    });
  };

  const addCalf = () => {
    if (!newCalf.tagId || !newCalf.dob) return;
    const calf: Calf = {
      id: Date.now().toString(),
      name: newCalf.name,
      tagId: newCalf.tagId,
      dob: newCalf.dob,
      motherId: newCalf.motherId,
      weightHistory: [{ date: newCalf.dob, weight: Number(newCalf.birthWeight) || 35 }],
      generation: 'F1',
      geneticPotential: 15,
      vaccinations: [],
      totalCost: Number(newCalf.initialCost) || 0,
      protocols: [],
      feedingProgram: [],
      investments: [],
      lifeStatus: 'Active'
    };
    onUpdate({ ...data, calves: [...data.calves, calf] });
    setNewCalf({ name: '', tagId: '', dob: '', motherId: '', birthWeight: '', initialCost: '' });
    setShowAdd(false);
  };

  const displayedCalves = data.calves.filter(c => showArchive ? (c.lifeStatus !== 'Active') : (c.lifeStatus === 'Active'));

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Calf Growth Assets</h2>
          <button onClick={() => setShowArchive(!showArchive)} className="text-[9px] font-black text-blue-600 underline">
            {showArchive ? 'SHOW ACTIVE CALVES' : 'VIEW SOLD/DEAD RECORDS'}
          </button>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black shadow-lg">
          {showAdd ? 'CANCEL' : '+ BUY NEW CALF'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" className="border p-3 rounded-2xl text-sm" value={newCalf.name} onChange={e => setNewCalf({...newCalf, name: e.target.value})} />
            <input placeholder="Tag ID" className="border p-3 rounded-2xl text-sm font-bold" value={newCalf.tagId} onChange={e => setNewCalf({...newCalf, tagId: e.target.value})} />
            <input type="date" className="border p-3 rounded-2xl text-sm" value={newCalf.dob} onChange={e => setNewCalf({...newCalf, dob: e.target.value})} />
            <input type="number" placeholder="Birth Value (₹)" className="border p-3 rounded-2xl text-sm" value={newCalf.initialCost} onChange={e => setNewCalf({...newCalf, initialCost: e.target.value})} />
          </div>
          <button onClick={addCalf} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Register Calf</button>
        </div>
      )}

      <div className="space-y-6">
        {displayedCalves.map(calf => {
          const dob = new Date(calf.dob);
          const ageDays = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 3600 * 24));
          const ageMonths = Math.floor(ageDays / 30);
          
          const cumulativeFeedCost = (calf.feedingProgram || []).reduce((acc, step) => {
            const actualStart = Math.max(0, step.startAgeDays);
            const actualEnd = Math.min(ageDays, step.endAgeDays);
            if (actualEnd > actualStart) return acc + (actualEnd - actualStart) * step.dailyCost;
            return acc;
          }, 0);

          const totalInvestment = calf.totalCost + cumulativeFeedCost + (calf.investments || []).reduce((a, b) => a + b.amount, 0);

          return (
            <div key={calf.id} className={`bg-white p-6 rounded-[2.5rem] border shadow-md space-y-6 ${calf.lifeStatus === 'Dead' ? 'opacity-50 grayscale' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${calf.lifeStatus === 'Active' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                    {calf.lifeStatus === 'Dead' ? '💀' : '🍼'}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">
                      {calf.name || 'Calf'} 
                      <span className="text-emerald-600 ml-2">₹{totalInvestment.toLocaleString()}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Tag: {calf.tagId} • {calf.lifeStatus === 'Active' ? `${ageMonths} Months` : calf.lifeStatus}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => logManualInvestment(calf.id)} className="bg-gray-100 p-2 rounded-xl text-lg" title="Add Investment">💰</button>
                  {calf.lifeStatus === 'Active' && (
                    <div className="relative group">
                      <button className="bg-gray-100 p-2 rounded-xl text-lg">⚙️</button>
                      <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-2xl rounded-2xl border p-2 z-50 w-32">
                        <button onClick={() => updateLifeStatus(calf.id, 'Sold')} className="w-full text-left text-[10px] font-black p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 uppercase">Mark as Sold</button>
                        <button onClick={() => updateLifeStatus(calf.id, 'Dead')} className="w-full text-left text-[10px] font-black p-2 hover:bg-rose-50 rounded-lg text-rose-600 uppercase">Mark as Dead</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {calf.lifeStatus === 'Active' && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Feeding Plan</h4>
                      <div className="flex gap-2">
                        <button onClick={() => addFeedingProgram(calf.id, {s: 4, e: 90, n: 'Starter (4d-3m)', c: 45})} className="text-[8px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-black">PHASE 1</button>
                        <button onClick={() => addFeedingProgram(calf.id, {s: 91, e: 180, n: 'Grower (4-6m)', c: 65})} className="text-[8px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-black">PHASE 2</button>
                        <button onClick={() => addFeedingProgram(calf.id, {s: 181, e: 390, n: 'Heifer (7-13m)', c: 85})} className="text-[8px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-black">PHASE 3</button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {(calf.feedingProgram || []).map(step => (
                        <div key={step.id} className={`flex items-center justify-between p-3 rounded-2xl border ${ageDays >= step.startAgeDays && ageDays <= step.endAgeDays ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                          <div>
                            <p className="text-[11px] font-black text-gray-800">{step.feedName}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Days {step.startAgeDays} - {step.endAgeDays}</p>
                          </div>
                          <p className="text-[11px] font-black text-emerald-600">₹{step.dailyCost}/day</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <GrowthChart history={calf.weightHistory} />
                </>
              )}

              {calf.lifeStatus === 'Sold' && (
                <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase">Sold Revenue</p>
                  <p className="text-xl font-black text-emerald-800">₹{calf.salePrice?.toLocaleString()}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalfManager;
