
import React from 'react';
import { FarmData, AppView, DashboardModule } from '../types';

interface Props {
  data: FarmData;
  onUpdate: (data: FarmData) => void;
  onNavigate: (view: AppView) => void;
  onSync: () => void;
  isSyncing: boolean;
}

const SettingsManager: React.FC<Props> = ({ data, onUpdate, onNavigate, onSync, isSyncing }) => {
  const toggleModule = (id: AppView) => {
    const updated = data.dashboardModules.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    onUpdate({ ...data, dashboardModules: updated });
  };

  const clearData = () => {
    if (confirm("Are you sure? This will delete all local data. Make sure you have backed up to email first!")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-4">Dashboard Builder</h2>
        <p className="text-xs text-gray-400 font-bold uppercase mb-4 px-1 tracking-widest">Toggle Home Screen Options</p>
        
        <div className="space-y-3">
          {data.dashboardModules.map(mod => (
            <div key={mod.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mod.icon}</span>
                <span className="text-sm font-black text-gray-700">{mod.label}</span>
              </div>
              <button 
                onClick={() => toggleModule(mod.id)}
                className={`w-12 h-6 rounded-full transition-all relative ${mod.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${mod.enabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-4">Cloud & Backup</h2>
        <div className="space-y-3">
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <span className="text-sm font-black uppercase">Auto-Save to Email</span>
            </div>
            {isSyncing ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full"></div> : <span>➜</span>}
          </button>
          
          <button 
            onClick={clearData}
            className="w-full flex items-center justify-between p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🗑️</span>
              <span className="text-sm font-black uppercase">Wipe Local Storage</span>
            </div>
            <span>➜</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-[3rem] text-white">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 text-center">All Tools & Features</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(AppView).filter(v => v !== AppView.LOGIN && v !== AppView.SETTINGS && v !== AppView.DASHBOARD).map(view => {
            const mod = data.dashboardModules.find(m => m.id === view);
            return (
              <button 
                key={view}
                onClick={() => onNavigate(view)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">{mod?.icon || '⚙️'}</div>
                <span className="text-[9px] font-black uppercase opacity-60 text-center">{mod?.label || view}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
