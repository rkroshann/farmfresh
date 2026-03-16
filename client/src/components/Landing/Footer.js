import React from 'react';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-32 pb-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/4 h-full bg-green-600/5 -skew-x-12"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-4 gap-20 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="text-4xl filter drop-shadow-md">
                                🌾
                            </div>
                            <span className="text-3xl font-black tracking-tighter">FarmFresh</span>
                        </div>
                        <p className="text-gray-400 text-lg mb-10 max-w-sm font-medium leading-relaxed">
                            We're building the bridge between the hardworking farmers of our land and your dinner table. Quality harvest, fair prices.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <div key={idx} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-green-600 hover:border-green-600 transition-all active:scale-90">
                                    <Icon size={20} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black text-xl mb-10 text-green-400 uppercase tracking-widest text-sm">Quick Links</h4>
                        <ul className="space-y-5 text-gray-400 font-bold">
                            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="/marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
                            <li><a href="/farmer/dashboard" className="hover:text-white transition-colors text-green-600">Farmer Seller Portal</a></li>
                            <li><a href="/chats" className="hover:text-white transition-colors">Customer Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-xl mb-10 text-green-400 uppercase tracking-widest text-sm">Join Our Newsletter</h4>
                        <p className="text-gray-500 mb-6 font-medium">Stay updated with fresh arrivals and seasonal harvests.</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-12 focus:outline-none focus:border-green-600 transition-all"
                            />
                            <button className="absolute right-3 top-2.5 bg-green-600 p-2 rounded-xl hover:bg-green-700 transition-colors">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                        &copy; 2026 FarmFresh Marketplace &bull; Made with 💚
                    </p>
                    <div className="flex gap-8 text-gray-600 font-bold text-xs uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
