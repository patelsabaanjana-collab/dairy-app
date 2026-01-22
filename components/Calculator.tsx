
import React, { useState } from 'react';

const DENSITY = 1.03; // Approx density of milk (kg/L)

const Calculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [kg, setKg] = useState('');
  const [liter, setLiter] = useState('');

  const convertKgToL = (val: string) => {
    setKg(val);
    if (!val) { setLiter(''); return; }
    const result = parseFloat(val) / DENSITY;
    setLiter(result.toFixed(2));
  };

  const convertLToKg = (val: string) => {
    setLiter(val);
    if (!val) { setKg(''); return; }
    const result = parseFloat(val) * DENSITY;
    setKg(result.toFixed(2));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-emerald-800">Milk Converter</h2>
        <p className="text-gray-500 text-sm">Density used: {DENSITY} kg/L</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
          
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (KG)</label>
          <input 
            type="number" 
            className="w-full text-4xl font-bold bg-transparent border-none outline-none focus:ring-0 text-emerald-600 placeholder-gray-200"
            placeholder="0.00"
            value={kg}
            onChange={(e) => convertKgToL(e.target.value)}
          />
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-emerald-600 text-white p-2 rounded-full shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
          </div>
        </div>

        <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-tr-full -ml-10 -mb-10"></div>
          
          <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Volume (Liters)</label>
          <input 
            type="number" 
            className="w-full text-4xl font-bold bg-transparent border-none outline-none focus:ring-0 text-white placeholder-emerald-400"
            placeholder="0.00"
            value={liter}
            onChange={(e) => convertLToKg(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-xs text-amber-700 leading-relaxed">
        <strong>Tip:</strong> One liter of milk typically weighs around 1.03 kilograms. Variations occur based on fat and solid content. Use this for quick farm estimates!
      </div>
      
      <button 
        onClick={onBack}
        className="w-full py-4 text-gray-500 font-bold"
      >
        Go Back
      </button>
    </div>
  );
};

export default Calculator;
