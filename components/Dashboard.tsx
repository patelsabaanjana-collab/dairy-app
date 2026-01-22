
import React from 'react';
import { AppView, UserProfile, FarmData } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  user: UserProfile | null;
  data: FarmData;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  syncInsight: string | null;
  onUpdateData: (newData: FarmData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, data, onSync, isSyncing, syncInsight }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Daily Financials
  const todayMilkRevenue = data.milkSales
    .filter(s => s.date === todayStr)
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
  
  const todayLabourExpense = data.labours.reduce((acc, curr) => {
    const status = curr.attendance[todayStr];
    if (status === 'present') return acc + curr.dailySalary;
    if (status === 'half-day') return acc + (curr.dailySalary / 2);
    return acc;
  }, 0);

  const todayFeedExpense = data.feeds.reduce((acc, curr) => acc + (curr.dailyConsumption * curr.unitPrice), 0);
  const netDailyProfit = todayMilkRevenue - todayLabourExpense - todayFeedExpense;

  const totalCowValue = data.cows.reduce((a, c) => a + c.purchasePrice + (c.investments || []).reduce((i, r) => i + r.amount, 0), 0);
  const totalCalfValue = data.calves.reduce((a, c) => a + c.totalCost + (c.investments || []).reduce((i, r) => i + r.amount, 0), 0);

  const enabledModules = data.dashboardModules.filter(m => m.enabled);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`}></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {isSyncing ? 'Securing to Cloud...' : 'Farm Secured'}
          </p>
        </div>
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm"
        >
          <span className="text-lg">⚙️</span>
        </button>
      </div>

      {syncInsight && (
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-[10px] font-bold text-emerald-800">
          ✨ {syncInsight}
        </div>
      )}

      <div className="bg-emerald-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Today's Performance</p>
          <h2 className="text-4xl font-black mb-6">₹{netDailyProfit.toFixed(0)}</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <p className="text-[9px] font-bold opacity-60 uppercase">Herd Value</p>
              <p className="text-lg font-black">₹{(totalCowValue + totalCalfValue).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex flex-col justify-center items-center" onClick={() => onNavigate(AppView.REPORTS)}>
              <p className="text-[10px] font-black uppercase">Full Report ➜</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-2 gap-3">
        {enabledModules.map(mod => (
          <button 
            key={mod.id}
            onClick={() => onNavigate(mod.id)} 
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-[1.8rem] flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              {mod.icon}
            </div>
            <span className="text-xs font-black text-gray-800 uppercase tracking-tight">{mod.label}</span>
          </button>
        ))}
        
        {/* Always visible Add button if fewer than 4 modules */}
        {enabledModules.length < 4 && (
          <button 
            onClick={() => onNavigate(AppView.SETTINGS)}
            className="bg-dashed border-2 border-dashed border-gray-200 p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-400"
          >
            <span className="text-2xl mb-1">+</span>
            <span className="text-[9px] font-black uppercase">Add Tool</span>
          </button>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-[2.5rem] text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Herd Summary</h3>
          <span className="text-[10px] font-black text-emerald-400">{data.cows.length + data.calves.length} Total Head</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-l-2 border-emerald-500 pl-3">
            <p className="text-lg font-black">{data.cows.length}</p>
            <p className="text-[9px] text-gray-500 uppercase font-black">Active Cows</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-3">
            <p className="text-lg font-black">{data.calves.length}</p>
            <p className="text-[9px] text-gray-500 uppercase font-black">Young Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
