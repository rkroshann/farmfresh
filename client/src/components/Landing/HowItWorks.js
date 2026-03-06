import React from 'react';
import { Search, ShoppingCart, Truck } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: 'Browse Fresh Products',
            description: 'Explore a wide variety of local farm produce including vegetables, fruits, and dairy.'
        },
        {
            icon: ShoppingCart,
            title: 'Order Direct',
            description: 'Connect with local farmers and place your orders directly without any middlemen.'
        },
        {
            icon: Truck,
            title: 'Home Delivery',
            description: 'Get your orders delivered straight from the farm to your doorstep at peak freshness.'
        }
    ];

    return (
        <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector lines (Desktop) */}
            <div className="hidden lg:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-dashed bg-green-100 -z-10"></div>

            {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-white border-2 border-green-50 rounded-full flex items-center justify-center mb-8 shadow-xl relative transition-all duration-500 group-hover:bg-green-600 group-hover:border-green-600 group-hover:-translate-y-2">
                        <step.icon size={36} className="text-green-600 group-hover:text-white transition-colors duration-500" />
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-4 border-white">
                            {idx + 1}
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed px-4">
                        {step.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default HowItWorks;
