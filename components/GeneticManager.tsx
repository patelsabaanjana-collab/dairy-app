
import React, { useState } from 'react';
import { FarmData, GeneticSemen } from '../types';

const GeneticManager: React.FC<{ data: FarmData, onUpdate: (d: FarmData) => void, onBack: () => void }> = ({ data, onUpdate }) => {
  const [bull, setBull] = useState('');
  const [yieldExp, setYieldExp] = useState('');

  const saveSemen = () => {
    if(!bull || !yieldExp) return;
    const newSemen: GeneticSemen = {
      id: Date.now().toString(),
      bullName: bull,
      company: 'Premier Genetics',
      price: 1500,
      motherMilkCapacity: 35,
      expectedMilkYield: Number(yieldExp)
    };
    onUpdate({...data, genetics: [...data.genetics, newSemen]});
    setBull(''); setYieldExp('');
  };

  return (
    <div className="space-y-4">
       <div className="bg-purple-600 p-6 rounded-3xl text-white shadow-lg">
        <h2 className="text-2xl font-black">Genetics Hub</h2>
        <p className="text-purple-100 text-sm">Optimizing herd production potential</p>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-600">New Semen Entry</h3>
        <input placeholder="Bull Name / Code" className="w-full border p-2 rounded-lg text-sm" value={bull} onChange={e=>setBull(e.target.value)}/>
        <input type="number" placeholder="Exp. Yield of Offspring (L/d)" className="w-full border p-2 rounded-lg text-sm" value={yieldExp} onChange={e=>setYieldExp(e.target.value)}/>
        <button onClick={saveSemen} className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold">Save Genetic Data</button>
      </div>

      <div className="space-y-2">
        {data.genetics.map(g => (
          <div key={g.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{g.bullName}</p>
              <p className="text-xs text-purple-600 font-medium">Expected Yield: {g.expectedMilkYield}L</p>
            </div>
            <div className="text-right text-[10px] text-gray-400 font-bold uppercase">
              Genetic Value
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneticManager;
