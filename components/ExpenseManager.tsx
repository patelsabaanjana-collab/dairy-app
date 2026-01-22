
import React, { useState } from 'react';
import { FarmData, Expense } from '../types';

const ExpenseManager: React.FC<{ data: FarmData, onUpdate: (d: FarmData) => void, onBack: () => void }> = ({ data, onUpdate }) => {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');

  const addExp = () => {
    if(!desc || !amt) return;
    const e: Expense = {
      id: Date.now().toString(),
      category: 'Other',
      amount: Number(amt),
      date: new Date().toISOString().split('T')[0],
      description: desc
    };
    onUpdate({...data, expenses: [...data.expenses, e]});
    setDesc(''); setAmt('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-red-500 p-6 rounded-3xl text-white shadow-lg">
        <h2 className="text-2xl font-black">Expense Tracker</h2>
        <p className="text-red-100 text-sm">Monitor all miscellaneous farm spending</p>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
        <input placeholder="Expense Description" className="w-full border p-2 rounded-lg text-sm" value={desc} onChange={e=>setDesc(e.target.value)}/>
        <input type="number" placeholder="Amount (₹)" className="w-full border p-2 rounded-lg text-sm" value={amt} onChange={e=>setAmt(e.target.value)}/>
        <button onClick={addExp} className="w-full bg-red-600 text-white py-2 rounded-lg font-bold">Record Expense</button>
      </div>

      <div className="space-y-2">
        {data.expenses.map(exp => (
          <div key={exp.id} className="bg-white p-3 rounded-lg border flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{exp.description}</p>
              <p className="text-[10px] text-gray-400">{exp.date}</p>
            </div>
            <p className="font-bold text-red-600">₹{exp.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseManager;
