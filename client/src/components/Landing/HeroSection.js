import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, UserPlus } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[700px] h-[700px] bg-green-50 rounded-full blur-[100px] opacity-70 -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-70 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-fade-in-down">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-green-600 animate-ping"></span>
                            Fresh from Local Farms
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-sans font-black text-gray-900 leading-[1.05] mb-8">
                            Fresh Farm Produce <br />
                            <span className="text-green-600">Delivered Directly</span> <br />
                            To Your Door.
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            We connect local farmers directly with you. Skip the middleman and enjoy 100% organic, seasonal harvests picked at the peak of freshness.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-green-600 text-white rounded-[2rem] text-lg font-black hover:bg-green-700 transition-all shadow-2xl shadow-green-200 hover:-translate-y-1 active:scale-95 group"
                            >
                                <ShoppingBasket size={24} className="group-hover:rotate-12 transition-transform" />
                                <span>Browse Fresh Products</span>
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-700 border-2 border-gray-100 rounded-[2rem] text-lg font-bold hover:border-green-200 hover:text-green-600 transition-all shadow-sm active:scale-95"
                            >
                                <UserPlus size={24} />
                                <span>Become a Farmer Seller</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-2xl">
                        <div className="relative p-2 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] -rotate-1 border border-gray-100 overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1488459711612-0717278ca986?auto=format&fit=crop&q=80&w=1000"
                                alt="Fresh Farmers Market"
                                className="w-full h-[500px] object-cover rounded-[2.5rem] transform transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                            {/* Decorative Element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-600/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
