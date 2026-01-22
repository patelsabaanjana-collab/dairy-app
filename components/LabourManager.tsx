
import React, { useState } from 'react';
import { FarmData, Labour } from '../types';

const LabourManager: React.FC<{ data: FarmData, onUpdate: (d: FarmData) => void, onBack: () => void }> = ({ data, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [wage, setWage] = useState('');
  
  const today = new Date().toISOString().split('T')[0];

  const addWorker = () => {
    if (!name || !wage) return;
    const worker: Labour = {
      id: Date.now().toString(),
      name,
      dailySalary: Number(wage),
      advanceTaken: 0,
      attendance: {},
      // Added missing payments property initialization
      payments: 0
    };
    onUpdate({ ...data, labours: [...data.labours, worker] });
    setShowAdd(false); setName(''); setWage('');
  };

  const markAttendance = (id: string, status: 'present' | 'absent' | 'half-day') => {
    const updated = data.labours.map(l => {
      if (l.id === id) {
        return { ...l, attendance: { ...l.attendance, [today]: status } };
      }
      return l;
    });
    onUpdate({ ...data, labours: updated });
  };

  const handleAdvance = (id: string, amount: number) => {
    const updated = data.labours.map(l => {
      if (l.id === id) return { ...l, advanceTaken: l.advanceTaken + amount };
      return l;
    });
    onUpdate({ ...data, labours: updated });
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-orange-600 p-6 rounded-[2.5rem] text-white shadow-xl">
        <h2 className="text-2xl font-black">Staff Ledger</h2>
        <p className="text-orange-100 text-sm opacity-80">Managing attendance and payouts</p>
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Today: {today}</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="text-xs font-black text-orange-600">
          {showAdd ? 'CANCEL' : '+ NEW WORKER'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-5 rounded-3xl border border-orange-50 shadow-sm space-y-3">
          <input placeholder="Worker Name" className="w-full border p-3 rounded-2xl text-sm" value={name} onChange={e => setName(e.target.value)} />
          <input type="number" placeholder="Daily Wage (₹)" className="w-full border p-3 rounded-2xl text-sm" value={wage} onChange={e => setWage(e.target.value)} />
          <button onClick={addWorker} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100">Register Staff Member</button>
        </div>
      )}

      <div className="space-y-4">
        {data.labours.map(worker => (
          <div key={worker.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-gray-800">{worker.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Daily Wage: ₹{worker.dailySalary}</p>
              </div>
              <div className="bg-orange-50 px-3 py-1 rounded-full">
                <span className="text-[10px] font-black text-orange-600 uppercase">Adv: ₹{worker.advanceTaken}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button onClick={() => markAttendance(worker.id, 'present')} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${worker.attendance[today] === 'present' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>PRESENT</button>
              <button onClick={() => markAttendance(worker.id, 'half-day')} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${worker.attendance[today] === 'half-day' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>1/2 DAY</button>
              <button onClick={() => markAttendance(worker.id, 'absent')} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${worker.attendance[today] === 'absent' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>ABSENT</button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <button 
                onClick={() => {
                  const amt = Number(prompt("Enter Advance Amount:"));
                  if(amt) handleAdvance(worker.id, amt);
                }}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg"
              >
                + Pay Advance
              </button>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Payout Pending</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabourManager;
