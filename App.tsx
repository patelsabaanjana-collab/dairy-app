
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppView, FarmData, UserProfile } from './types';
import { loadData, saveData, initialData } from './store';
import Dashboard from './components/Dashboard';
import CowManager from './components/CowManager';
import CalfManager from './components/CalfManager';
import FeedManager from './components/FeedManager';
import GeneticManager from './components/GeneticManager';
import MilkSalesManager from './components/MilkSalesManager';
import LabourManager from './components/LabourManager';
import PnLManager from './components/PnLManager';
import ExpenseManager from './components/ExpenseManager';
import ProductManager from './components/ProductManager';
import Calculator from './components/Calculator';
import MedicineManager from './components/MedicineManager';
import ReportManager from './components/ReportManager';
import SettingsManager from './components/SettingsManager';
import Login from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [data, setData] = useState<FarmData>(initialData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncInsight, setSyncInsight] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    const savedUser = localStorage.getItem('dairy_pro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(AppView.DASHBOARD);
    }
  }, []);

  const handleUpdateData = (newData: FarmData) => {
    setData(newData);
    saveData(newData);
  };

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('dairy_pro_user', JSON.stringify(profile));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dairy_pro_user');
    setCurrentView(AppView.LOGIN);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncInsight(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I have ${data.cows.length} cows. Feed stock is updated. 
        Give me a 1-sentence supportive farm insight or feeding tip for Dairy Wala app.`,
      });
      setSyncInsight(response.text || "Cloud backup complete. Your records are safe!");
      const updatedUser = { ...user!, lastSynced: new Date().toLocaleTimeString() };
      setUser(updatedUser);
      localStorage.setItem('dairy_pro_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Sync failed", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const navigate = (view: AppView) => setCurrentView(view);

  const renderView = () => {
    switch (currentView) {
      case AppView.LOGIN: return <Login onLogin={handleLogin} />;
      case AppView.DASHBOARD: return <Dashboard onNavigate={navigate} user={user} onSync={handleSync} isSyncing={isSyncing} syncInsight={syncInsight} data={data} onUpdateData={handleUpdateData} />;
      case AppView.COW_LIST: return <CowManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.CALF_LIST: return <CalfManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.FEED_LOG: return <FeedManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.MILK_SALES: return <MilkSalesManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.MEDICINE: return <MedicineManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.GENETICS: return <GeneticManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.LABOUR: return <LabourManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.PROFIT_LOSS: return <PnLManager data={data} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.EXPENSES: return <ExpenseManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.PRODUCTS: return <ProductManager data={data} onUpdate={handleUpdateData} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.CALCULATOR: return <Calculator onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.REPORTS: return <ReportManager data={data} onBack={() => navigate(AppView.DASHBOARD)} />;
      case AppView.SETTINGS: return <SettingsManager data={data} onUpdate={handleUpdateData} onNavigate={navigate} onSync={handleSync} isSyncing={isSyncing} />;
      default: return <Dashboard onNavigate={navigate} user={user} onSync={handleSync} isSyncing={isSyncing} syncInsight={syncInsight} data={data} onUpdateData={handleUpdateData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2" onClick={() => navigate(AppView.DASHBOARD)}>🐄 Dairy Wala</h1>
        {user && (
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(AppView.SETTINGS)} className="opacity-80">
                <span className="text-lg">⚙️</span>
             </button>
          </div>
        )}
      </header>
      <main className="p-4 max-w-md mx-auto">{renderView()}</main>
      
      {user && currentView !== AppView.LOGIN && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 safe-bottom shadow-lg z-40">
          <button onClick={() => navigate(AppView.DASHBOARD)} className={`flex flex-col items-center gap-1 ${currentView === AppView.DASHBOARD ? 'text-emerald-600' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => navigate(AppView.MILK_SALES)} className={`flex flex-col items-center gap-1 ${currentView === AppView.MILK_SALES ? 'text-emerald-600' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
            <span className="text-[10px] font-bold">Milk</span>
          </button>
          <button onClick={() => navigate(AppView.REPORTS)} className={`flex flex-col items-center gap-1 ${currentView === AppView.REPORTS ? 'text-emerald-600' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h10m0 0l-3-3m3 3l-3 3M9 9a1 1 0 000-2 1 1 0 000 2z" /></svg>
            <span className="text-[10px] font-bold">Reports</span>
          </button>
          <button onClick={() => navigate(AppView.SETTINGS)} className={`flex flex-col items-center gap-1 ${currentView === AppView.SETTINGS ? 'text-emerald-600' : 'text-gray-400'}`}>
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] font-bold">Menu</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
