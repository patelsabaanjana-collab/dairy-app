
import React, { useState } from 'react';
import { FarmData, AppView } from '../types';

interface Props {
  data: FarmData;
  onBack: () => void;
}

type Period = '1M' | '6M' | '1Y' | '5Y';

const ReportManager: React.FC<Props> = ({ data, onBack }) => {
  const [period, setPeriod] = useState<Period>('1M');

  const getFilterDate = (p: Period) => {
    const d = new Date();
    if (p === '1M') d.setMonth(d.getMonth() - 1);
    else if (p === '6M') d.setMonth(d.getMonth() - 6);
    else if (p === '1Y') d.setFullYear(d.getFullYear() - 1);
    else if (p === '5Y') d.setFullYear(d.getFullYear() - 5);
    return d;
  };

  const filterDate = getFilterDate(period);
  const filterFn = (dateStr: string) => new Date(dateStr) >= filterDate;

  const filteredSales = data.milkSales.filter(s => filterFn(s.date));
  const totalMilkVolume = filteredSales.reduce((a, b) => a + b.quantity, 0);
  const totalMilkRevenue = filteredSales.reduce((a, b) => a + b.totalAmount, 0);

  const filteredExpenses = data.expenses.filter(e => filterFn(e.date));
  const feedPurchaseTotal = filteredExpenses
    .filter(e => e.category.toLowerCase().includes('feed'))
    .reduce((a, b) => a + b.amount, 0);
  
  const miscExpenseTotal = filteredExpenses
    .filter(e => !e.category.toLowerCase().includes('feed'))
    .reduce((a, b) => a + b.amount, 0);

  let totalLabourCost = 0;
  data.labours.forEach(worker => {
    Object.entries(worker.attendance).forEach(([date, status]) => {
      if (filterFn(date)) {
        if (status === 'present') totalLabourCost += worker.dailySalary;
        if (status === 'half-day') totalLabourCost += (worker.dailySalary / 2);
      }
    });
  });

  const grandTotalSpending = feedPurchaseTotal + miscExpenseTotal + totalLabourCost;
  const netProfit = totalMilkRevenue - grandTotalSpending;

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1 text-emerald-400">Executive Report</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Time-Series Performance Hub</p>
          
          <div className="flex bg-white/5 p-1 rounded-2xl mt-6 border border-white/10">
            {(['1M', '6M', '1Y', '5Y'] as Period[]).map(p => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${
                  period === p ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'
                }`}
              >
                {p === '1M' ? 'MONTH' : p === '6M' ? '6 MO' : p === '1Y' ? 'YEAR' : '5 YR'}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Milk</p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-2xl font-black text-slate-800">{totalMilkVolume.toLocaleString()}</h4>
            <span className="text-[10px] font-bold text-gray-400">L</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
          <h4 className="text-2xl font-black text-emerald-600">₹{totalMilkRevenue.toLocaleString()}</h4>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest px-2">Spending Analysis</h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-xl">🌾</div>
              <div>
                <p className="text-[12px] font-black text-gray-800">Feed Purchase</p>
                <p className="text-[9px] font-bold text-gray-400">Bulk Stock Buying</p>
              </div>
            </div>
            <p className="text-sm font-black text-slate-800">₹{feedPurchaseTotal.toLocaleString()}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">👷</div>
              <div>
                <p className="text-[12px] font-black text-gray-800">Labour Cost</p>
                <p className="text-[9px] font-bold text-gray-400">Salaries & Advances</p>
              </div>
            </div>
            <p className="text-sm font-black text-slate-800">₹{totalLabourCost.toLocaleString()}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-xl">🩹</div>
              <div>
                <p className="text-[12px] font-black text-gray-800">Operationals</p>
                <p className="text-[9px] font-bold text-gray-400">Meds & Routine</p>
              </div>
            </div>
            <p className="text-sm font-black text-slate-800">₹{miscExpenseTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated PnL</p>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {netProfit >= 0 ? 'Surplus' : 'Deficit'}
            </span>
          </div>
          <h3 className={`text-4xl font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{netProfit.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="flex gap-3 px-1">
        <button onClick={onBack} className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl text-[11px] font-black text-slate-500 uppercase">Back</button>
        <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-slate-200">Export Report</button>
      </div>
    </div>
  );
};

export default ReportManager;
