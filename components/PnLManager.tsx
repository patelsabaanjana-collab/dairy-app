
import React, { useState } from 'react';
import { FarmData, InvestmentRecord } from '../types';

type Period = '1M' | '6M' | '1Y' | 'ALL';

const PnLManager: React.FC<{ data: FarmData; onBack: () => void }> = ({ data, onBack }) => {
  const [period, setPeriod] = useState<Period>('1M');

  const getFilterDate = (p: Period) => {
    const d = new Date();
    if (p === '1M') d.setMonth(d.getMonth() - 1);
    else if (p === '6M') d.setMonth(d.getMonth() - 6);
    else if (p === '1Y') d.setFullYear(d.getFullYear() - 1);
    else if (p === 'ALL') return new Date(0);
    return d;
  };

  const filterDate = getFilterDate(period);
  const filterFn = (dateStr: string) => new Date(dateStr) >= filterDate;

  // Revenue Calculations
  const milkRevenue = data.milkSales.filter(s => filterFn(s.date)).reduce((acc, curr) => acc + curr.totalAmount, 0);
  const animalSaleRevenue = [
    ...data.cows.map(c => ({ amount: c.salePrice || 0, date: todayStr })), // Simulating date for animal sales
    ...data.calves.map(c => ({ amount: c.salePrice || 0, date: todayStr }))
  ].reduce((acc, curr) => acc + curr.amount, 0);

  const totalRevenue = milkRevenue + animalSaleRevenue;

  // Investment Breakdown
  const categories: InvestmentRecord['category'][] = ['Feed', 'Medicine', 'Genetic', 'Other'];
  const investmentBreakdown = categories.reduce((acc, cat) => {
    let total = 0;
    data.cows.forEach(cow => {
      total += (cow.investments || [])
        .filter(inv => inv.category === cat && filterFn(inv.date))
        .reduce((sum, inv) => sum + inv.amount, 0);
    });
    data.calves.forEach(calf => {
      total += (calf.investments || [])
        .filter(inv => inv.category === cat && filterFn(inv.date))
        .reduce((sum, inv) => sum + inv.amount, 0);
    });
    acc[cat] = total;
    return acc;
  }, {} as Record<InvestmentRecord['category'], number>);

  const totalCategorizedInvestments = Object.values(investmentBreakdown).reduce((a, b) => a + b, 0);

  // Other Expenses
  const totalMiscExpenses = data.expenses.filter(e => filterFn(e.date)).reduce((acc, curr) => acc + curr.amount, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Labour Cost (Simplified for demo)
  const totalLabourCost = data.labours.reduce((acc, worker) => {
    let workerTotal = 0;
    Object.entries(worker.attendance).forEach(([date, status]) => {
      if (filterFn(date)) {
        if (status === 'present') workerTotal += worker.dailySalary;
        if (status === 'half-day') workerTotal += worker.dailySalary / 2;
      }
    });
    return acc + workerTotal;
  }, 0);

  const netProfit = totalRevenue - totalCategorizedInvestments - totalMiscExpenses - totalLabourCost;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h2 className="text-xl font-black mb-1 text-emerald-400">Financial Ledger</h2>
          <div className="flex bg-white/5 p-1 rounded-2xl mt-4 border border-white/10">
            {(['1M', '6M', '1Y', 'ALL'] as Period[]).map(p => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all ${
                  period === p ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Net Periodic Profit</p>
            <p className={`text-4xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{netProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Revenue Sources</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">🥛</span>
              <p className="text-xs font-black text-emerald-800">Milk Collections</p>
            </div>
            <p className="text-sm font-black text-emerald-600">₹{milkRevenue.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">💰</span>
              <p className="text-xs font-black text-blue-800">Animal Sales</p>
            </div>
            <p className="text-sm font-black text-blue-600">₹{animalSaleRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Investment Summary Section */}
      <div className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Animal Investments Breakdown</h3>
        <div className="space-y-4">
          {categories.map(cat => {
            const amount = investmentBreakdown[cat];
            const percent = totalCategorizedInvestments > 0 ? (amount / totalCategorizedInvestments) * 100 : 0;
            const colors = {
              Feed: 'bg-amber-500',
              Medicine: 'bg-rose-500',
              Genetic: 'bg-purple-500',
              Other: 'bg-gray-500'
            };
            const icons = { Feed: '🌾', Medicine: '💊', Genetic: '🧬', Other: '🩹' };

            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between items-end px-1">
                  <p className="text-[11px] font-black text-gray-700 flex items-center gap-2">
                    <span>{icons[cat]}</span> {cat}
                  </p>
                  <p className="text-[11px] font-black text-gray-900">₹{amount.toLocaleString()}</p>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${colors[cat]} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
          <p className="text-[10px] font-black text-gray-400 uppercase">Total Asset Investment</p>
          <p className="text-lg font-black text-gray-900">₹{totalCategorizedInvestments.toLocaleString()}</p>
        </div>
      </div>

      {/* OpEx Section */}
      <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-200">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Operational Expenses</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100">
             <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Labour Staff</p>
             <p className="text-lg font-black text-gray-800">₹{totalLabourCost.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-gray-100">
             <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Misc Expenses</p>
             <p className="text-lg font-black text-gray-800">₹{totalMiscExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <button onClick={onBack} className="w-full py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Return Home</button>
    </div>
  );
};

export default PnLManager;
