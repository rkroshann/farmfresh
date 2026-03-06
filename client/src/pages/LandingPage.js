import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Leaf,
    BadgeCheck,
    Zap,
    Star
} from 'lucide-react';

// Modular Components
import Navbar from '../components/Landing/Navbar';
import HeroSection from '../components/Landing/HeroSection';
import FeatureCard from '../components/Landing/FeatureCard';
import ProductCard from '../components/Landing/ProductCard';
import HowItWorks from '../components/Landing/HowItWorks';
import FarmerCard from '../components/Landing/FarmerCard';
import Footer from '../components/Landing/Footer';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Users,
            title: 'Direct from Farmers',
            description: 'Buying directly empowers local agriculture communities and ensures transparency.'
        },
        {
            icon: Leaf,
            title: '100% Fresh & Organic',
            description: 'Our farmers follow strict standards to provide you with the healthiest, pesticide-free produce.'
        },
        {
            icon: BadgeCheck,
            title: 'Fair Prices',
            description: 'Zero middlemen means you get better prices and farmers earn what they actually deserve.'
        },
        {
            icon: Zap,
            title: 'Fast Local Delivery',
            description: 'Sourced from farms near you for the fastest delivery and minimal carbon footprint.'
        }
    ];

    const sampleProducts = [
        { id: 1, name: 'Organic Red Tomatoes', price: 40, farmerName: 'Harish Kumar', image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?auto=format&fit=crop&q=80&w=500' },
        { id: 2, name: 'Fresh Farm Milk', price: 60, farmerName: 'Suresh Dairy', image: 'https://images.unsplash.com/photo-1550583724-125581cc25fb?auto=format&fit=crop&q=80&w=500' },
        { id: 3, name: 'Green Bell Peppers', price: 35, farmerName: 'Anita Singh', image: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?auto=format&fit=crop&q=80&w=500' },
        { id: 4, name: 'Golden Honey', price: 250, farmerName: 'The Bee Farm', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=500' },
    ];

    const sampleFarmers = [
        { name: 'Harish Kumar', location: 'Punjab, India', products: 'Grains, Vegetables', image: 'https://i.pravatar.cc/150?u=harish' },
        { name: 'Anita Singh', location: 'Haryana, India', products: 'Organic Fruits', image: 'https://i.pravatar.cc/150?u=anita' },
        { name: 'Suresh Rai', location: 'UP, India', products: 'Dairy, Milk Products', image: 'https://i.pravatar.cc/150?u=suresh' },
    ];

    const testimonials = [
        { name: 'Raj Kumar', role: 'Home Cook', comment: 'The quality of the vegetables is simply amazing. I can taste the difference!' },
        { name: 'Megha Sharma', role: 'Nutritionist', comment: 'I always recommend FarmFresh to my clients for their 100% organic produce.' }
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden pt-20">
            <Navbar />

            <HeroSection />

            {/* Feature Highlights */}
            <section className="py-32 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">Featured Today</h2>
                            <p className="text-gray-500 font-medium text-lg italic">Explore the freshest arrivals from our passionate farmers.</p>
                        </div>
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="px-10 py-5 bg-green-50 text-green-700 rounded-2xl font-black hover:bg-green-600 hover:text-white transition-all active:scale-95"
                        >
                            Explore Full Marketplace
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {sampleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} onClick={(id) => navigate(`/products/${id}`)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black mb-8">Simple & Transparent</h2>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed lowercase tracking-tight">Three steps to get the harvest of the season on your table.</p>
                    </div>
                    <HowItWorks />
                </div>
            </section>

            {/* Farmer Spotlight */}
            <section className="py-32 bg-gray-50/30 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl font-black text-green-600 mb-2 uppercase tracking-[0.2em] text-sm">Farmer Spotlight</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900">Meet Your Heroes</h3>
                        </div>
                        <p className="text-gray-500 max-w-sm font-medium leading-relaxed italic">The hardworking faces behind every fresh harvest you enjoy.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {sampleFarmers.map((farmer, idx) => (
                            <FarmerCard key={idx} farmer={farmer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight font-sans">Trusted by the Community</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-10">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-white p-12 rounded-[3rem] border-2 border-gray-50 shadow-sm relative transition-all hover:bg-green-600 group">
                                <div className="absolute top-10 right-10 text-green-100/30 text-8xl transition-colors group-hover:text-white/10">"</div>
                                <div className="flex gap-1 mb-8">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#facc15" stroke="#facc15" />)}
                                </div>
                                <p className="text-xl font-bold text-gray-700 line-height-relaxed italic mb-10 transition-colors group-hover:text-white">"{t.comment}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center font-black text-green-600 text-xl group-hover:bg-white group-hover:text-green-600 transition-colors">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-lg text-gray-900 group-hover:text-white transition-colors">{t.name}</h4>
                                        <p className="text-gray-400 font-black text-xs uppercase tracking-widest group-hover:text-green-200 transition-colors">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-900 rounded-[4rem] p-16 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-full blur-[120px] opacity-30"></div>
                        <div className="relative z-10">
                            <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter">Ready for better food?</h2>
                            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">Join the community of conscious consumers who are transforming the way we source our food.</p>
                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/marketplace')}
                                    className="bg-green-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-green-700 transition-all shadow-xl active:scale-95"
                                >
                                    Start Shopping Now
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-white/10 border border-white/20 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-white/20 transition-all"
                                >
                                    Register as Farmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
