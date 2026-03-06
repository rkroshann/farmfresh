import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const FarmerCard = ({ farmer }) => {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 shadow-inner">
                    <img
                        src={farmer.image || `https://i.pravatar.cc/150?u=${farmer.name}`}
                        alt={farmer.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                </div>
                <div className="absolute -bottom-2 right-0 bg-green-600 text-white p-2 rounded-full shadow-lg">
                    <Star size={14} fill="white" />
                </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">{farmer.name}</h3>
            <div className="flex items-center gap-1 text-gray-400 font-bold text-xs uppercase tracking-wider mb-6">
                <MapPin size={14} />
                <span>{farmer.location}</span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 w-full mb-8">
                <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-tight">Top Produce</p>
                <p className="text-green-700 font-bold text-sm truncate">{farmer.products}</p>
            </div>

            <button className="flex items-center gap-2 text-green-600 font-black hover:gap-4 transition-all group-hover:text-green-700">
                <span>Visit Farm</span>
                <ArrowRight size={20} />
            </button>
        </div>
    );
};

const Star = ({ size, fill }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export default FarmerCard;
