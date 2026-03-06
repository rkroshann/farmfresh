import React from 'react';
import { Eye } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
    return (
        <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-green-100 hover:-translate-y-2 group">
            <div className="relative overflow-hidden h-64">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                        Fresh
                    </span>
                </div>
            </div>

            <div className="p-7">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-gray-900 line-clamp-1">{product.name}</h3>
                    <span className="text-green-600 font-extrabold text-lg">₹{product.price}</span>
                </div>

                <p className="text-gray-400 text-sm font-bold mb-6 italic">by {product.farmerName || 'Local Farmer'}</p>

                <button
                    onClick={() => onClick(product.id)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-700 font-black rounded-2xl hover:bg-green-600 hover:text-white transition-all active:scale-95 group/btn"
                >
                    <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                    <span>View Details</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
