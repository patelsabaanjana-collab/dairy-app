
import { FarmData, AppView } from './types';

const STORAGE_KEY = 'dairy_pro_farm_data_v4';

export const defaultModules = [
  { id: AppView.COW_LIST, label: 'Cows', icon: '🐄', enabled: true },
  { id: AppView.CALF_LIST, label: 'Calves', icon: '🍼', enabled: true },
  { id: AppView.MILK_SALES, label: 'Milk Sales', icon: '🥛', enabled: true },
  { id: AppView.REPORTS, label: 'Reports', icon: '📊', enabled: true },
  { id: AppView.FEED_LOG, label: 'Feed', icon: '🌾', enabled: false },
  { id: AppView.LABOUR, label: 'Labour', icon: '👷', enabled: false },
  { id: AppView.MEDICINE, label: 'Medical', icon: '🩹', enabled: false },
  { id: AppView.GENETICS, label: 'Genetics', icon: '🧬', enabled: false },
  { id: AppView.PRODUCTS, label: 'Inventory', icon: '📦', enabled: false },
  { id: AppView.CALCULATOR, label: 'Calc', icon: '🧮', enabled: false },
];

export const initialData: FarmData = {
  cows: [],
  calves: [],
  feeds: [],
  medicines: [],
  genetics: [],
  milkSales: [],
  labours: [],
  expenses: [],
  products: [],
  dashboardModules: defaultModules
};

export const loadData = (): FarmData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialData;
  try {
    const data = JSON.parse(stored);
    if (!data.dashboardModules) data.dashboardModules = defaultModules;
    
    // Ensure cows and calves have the new fields
    data.cows = (data.cows || []).map((c: any) => ({ ...c, isBought: c.isBought ?? true }));
    data.products = (data.products || []).map((p: any) => ({ ...p, stockQty: p.stockQty ?? 1 }));
    
    return data;
  } catch {
    return initialData;
  }
};

export const saveData = (data: FarmData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
