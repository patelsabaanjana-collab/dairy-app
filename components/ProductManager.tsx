
import React, { useState } from 'react';
import { FarmData, Product } from '../types';

const ProductManager: React.FC<{ data: FarmData, onUpdate: (d: FarmData) => void, onBack: () => void }> = ({ data, onUpdate }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const addProd = () => {
    if(!name || !price) return;
    // Fix: Added missing required 'stockQty' property
    const p: Product = {
      id: Date.now().toString(),
      name,
      price: Number(price),
      location: 'Main Store',
      lastPurchased: new Date().toISOString().split('T')[0],
      stockQty: 1
    };
    onUpdate({...data, products: [...data.products, p]});
    setName(''); setPrice('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg">
        <h2 className="text-2xl font-black">Farm Inventory</h2>
        <p className="text-indigo-100 text-sm">Equipment & Supplies Management</p>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
        <input placeholder="Item Name" className="w-full border p-2 rounded-lg text-sm" value={name} onChange={e=>setName(e.target.value)}/>
        <input type="number" placeholder="Cost (₹)" className="w-full border p-2 rounded-lg text-sm" value={price} onChange={e=>setPrice(e.target.value)}/>
        <button onClick={addProd} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Register Item</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.products.map(prod => (
          <div key={prod.id} className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="font-bold text-gray-800 text-sm">{prod.name}</p>
            <p className="text-emerald-600 font-bold text-sm mt-1">₹{prod.price}</p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider">{prod.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
