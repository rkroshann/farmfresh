import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, UserPlus, Play } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative h-[75vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center pt-20">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/Farmfresh_animation_farm_to_market_7499fbd687.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>

            {/* Content Overlay */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-[0.2em] mb-5 animate-fade-in-down shadow-xl">
                    <span className="flex h-2 w-2 rounded-full bg-farm-gold animate-pulse"></span>
                    Direct from Local Farms
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black leading-[1.1] mb-5 drop-shadow-2xl">
                    Fresh Farm Produce <br />
                    <span className="text-farm-gold">Delivered Directly</span> <br />
                    To Your Door.
                </h1>

                <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-lg opacity-95">
                    We connect local farmers directly with you. Enjoy fresh organic harvests without the middleman, picked at the peak of perfection.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-farm-green-600 text-white rounded-[2rem] text-xl font-black hover:bg-farm-green-700 transition-all shadow-[0_20px_40px_-10px_rgba(22,163,74,0.5)] hover:-translate-y-1 active:scale-95 group"
                    >
                        <ShoppingBasket size={28} className="group-hover:rotate-12 transition-transform" />
                        <span>Browse Fresh Products</span>
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-white/10 backdrop-blur-lg text-white border-2 border-white/30 rounded-[2rem] text-xl font-bold hover:bg-white hover:text-gray-900 transition-all shadow-xl active:scale-95 group"
                    >
                        <UserPlus size={28} className="group-hover:scale-110 transition-transform" />
                        <span>Become a Farmer Seller</span>
                    </button>
                </div>

                {/* Decorative Scroll Down Indicator */}
                <div className="absolute left-1/2 -bottom-24 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent rounded-full mx-auto"></div>
                </div>
            </div>

            {/* Bottom Curve/Shadow for Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
        </section>
    );
};

export default HeroSection;
