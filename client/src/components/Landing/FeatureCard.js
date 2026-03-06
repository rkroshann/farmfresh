import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-green-100 hover:-translate-y-3 cursor-default group">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-8 text-green-600 transform transition-transform duration-500 group-hover:rotate-[15deg]">
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;
