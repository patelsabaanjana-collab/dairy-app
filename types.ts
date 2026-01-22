
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  COW_LIST = 'COW_LIST',
  CALF_LIST = 'CALF_LIST',
  FEED_LOG = 'FEED_LOG',
  GENETICS = 'GENETICS',
  MILK_SALES = 'MILK_SALES',
  LABOUR = 'LABOUR',
  PROFIT_LOSS = 'PROFIT_LOSS',
  EXPENSES = 'EXPENSES',
  PRODUCTS = 'PRODUCTS',
  CALCULATOR = 'CALCULATOR',
  MEDICINE = 'MEDICINE',
  CALENDAR = 'CALENDAR',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  LOGIN = 'LOGIN'
}

export interface UserProfile {
  name: string;
  email: string;
  photo: string;
  lastSynced?: string;
}

export interface ProtocolStep {
  id: string;
  name: string;
  dayOffset: number;
  plannedDate: string;
  isDone: boolean;
  completionDate?: string;
}

export interface ActiveProtocol {
  id: string;
  protocolName: string;
  startDate: string;
  steps: ProtocolStep[];
}

export interface FeedingProgramStep {
  id: string;
  startAgeDays: number;
  endAgeDays: number;
  feedName: string;
  dailyQty: number;
  dailyCost: number;
}

export interface InvestmentRecord {
  id: string;
  date: string;
  category: 'Feed' | 'Medicine' | 'Genetic' | 'Other';
  amount: number;
  description: string;
}

export type LifeStatus = 'Active' | 'Sold' | 'Dead';

export interface Cow {
  id: string;
  name: string;
  cowNumber: string;
  tagId: string;
  breed: string;
  photo?: string;
  status: 'Milking' | 'Dry' | 'Pregnant' | 'Heifer';
  milkingCapacity: number;
  weight: number;
  lastCalvingDate?: string;
  nextCalvingDate?: string;
  lastHeatDate?: string;
  expectedInseminationDate?: string;
  breedingStatus?: 'Open' | 'Bred' | 'Confirmed' | 'Resting';
  feedChart: string;
  purchasePrice: number;
  protocols: ActiveProtocol[];
  feedingProgram: FeedingProgramStep[];
  investments: InvestmentRecord[];
  isBought: boolean;
  purchaseDate?: string;
  lifeStatus: LifeStatus;
  salePrice?: number;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface Calf {
  id: string;
  name: string;
  tagId: string;
  dob: string;
  motherId: string;
  weightHistory: WeightRecord[];
  generation: string;
  geneticPotential: number;
  vaccinations: any[];
  totalCost: number;
  protocols: ActiveProtocol[];
  feedingProgram: FeedingProgramStep[];
  investments: InvestmentRecord[];
  lifeStatus: LifeStatus;
  salePrice?: number;
}

export interface FeedEntry {
  id: string;
  type: 'Concentrate' | 'Dry Fodder' | 'Green Fodder' | 'Silage' | 'Supplement';
  name: string;
  currentStock: number;
  dailyConsumption: number;
  unitPrice: number;
  threshold: number;
  batchNumber?: string;
  proteinPercent?: number;
  expiryDate?: string;
  supplier?: string;
}

export interface Labour {
  id: string;
  name: string;
  dailySalary: number;
  advanceTaken: number;
  attendance: Record<string, 'present' | 'absent' | 'half-day'>;
  payments: number;
}

export interface MilkSale {
  id: string;
  date: string;
  shift: 'Morning' | 'Evening';
  quantity: number;
  fat: number;
  snf: number;
  rate: number;
  totalAmount: number;
  laborCost: number;
  feedCost: number;
}

export interface Medicine {
  id: string;
  name: string;
  price: number;
  targetId: string;
  dosePerDay: string;
  startDate: string;
  endDate?: string;
  currentStock: number;
  threshold: number;
}

export interface GeneticSemen {
  id: string;
  bullName: string;
  company: string;
  price: number;
  motherMilkCapacity: number;
  expectedMilkYield: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  location: string;
  lastPurchased: string;
  stockQty: number;
}

export interface DashboardModule {
  id: AppView;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface FarmData {
  cows: Cow[];
  calves: Calf[];
  feeds: FeedEntry[];
  medicines: Medicine[];
  genetics: GeneticSemen[];
  milkSales: MilkSale[];
  labours: Labour[];
  expenses: Expense[];
  products: Product[];
  dashboardModules: DashboardModule[];
}
