import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wheat, Search, Menu, X, LogIn } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-green-600 p-2 rounded-xl text-white">
                            <Wheat size={24} />
                        </div>
                        <span className="text-2xl font-extrabold text-green-800 tracking-tighter">FarmFresh</span>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search fresh products..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
                            />
                            <Search className="absolute left-3.5 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-7">
                        <Link to="/" className="text-gray-600 hover:text-green-600 font-bold transition-colors">Home</Link>
                        <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-bold transition-colors">Marketplace</Link>
                        <Link to="/orders" className="text-gray-600 hover:text-green-600 font-bold transition-colors">Orders</Link>
                        <Link to="/chats" className="text-gray-600 hover:text-green-600 font-bold transition-colors">Chat</Link>
                        <Link to="/farmer/dashboard" className="text-gray-600 hover:text-green-600 font-bold transition-colors text-sm bg-green-50 px-3 py-1.5 rounded-lg">Farmer Portal</Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-7 py-2.5 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95"
                        >
                            <LogIn size={18} />
                            <span>Login</span>
                        </button>
                        <button
                            className="md:hidden p-2 text-gray-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 py-4 animate-in slide-in-from-top">
                    <div className="flex flex-col gap-4 px-6 font-bold text-gray-700">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
                        <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                        <Link to="/chats" onClick={() => setIsMenuOpen(false)}>Chat</Link>
                        <Link to="/farmer/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                        <hr className="border-gray-100" />
                        <button
                            onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                            className="bg-green-600 text-white py-3 rounded-2xl w-full"
                        >
                            Login / Register
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
