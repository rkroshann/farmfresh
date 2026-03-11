import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  Plus,
  TrendingUp,
  DollarSign,
  Activity,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Wheat
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { productAPI, orderAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const mockSalesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        productAPI.getByFarmer(user.id || user._id),
        orderAPI.getAll() // Assuming this returns farmer's orders
      ]);
      setProducts(productsRes.data?.data?.products || []);
      setOrders(ordersRes.data?.data?.orders || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Stats calculation
  const totalProducts = products.length;
  const activeListings = products.filter(p => p.status === 'active').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col h-full
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-farm-green-600 rounded-xl flex items-center justify-center">
              <Wheat className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Farm<span className="text-farm-green-600">Fresh</span></span>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-8 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${isActive
                    ? 'bg-farm-green-600 text-white shadow-md shadow-farm-green-600/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600 font-semibold rounded-2xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-gray-50">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-farm-green-500 focus:bg-white focus:ring-4 focus:ring-farm-green-500/10 rounded-xl outline-none transition-all w-64 font-medium"
              />
            </div>
            <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 ml-2">
              <div className="w-10 h-10 rounded-full bg-farm-gold text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {(user?.name || 'F')[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.name || 'Farmer'}</p>
                <p className="text-xs font-medium text-gray-500">Verified Seller</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">

              {/* Stats Grid - 4 in a row desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <ShoppingCart size={24} />
                    </div>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm mb-1 uppercase tracking-wide">Total Orders</p>
                  <h3 className="text-3xl font-black text-gray-900">{totalOrders}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm mb-1 uppercase tracking-wide">Total Products</p>
                  <h3 className="text-3xl font-black text-gray-900">{totalProducts}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                      <Activity size={24} />
                    </div>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm mb-1 uppercase tracking-wide">Active Listings</p>
                  <h3 className="text-3xl font-black text-gray-900">{activeListings}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <DollarSign size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <TrendingUp size={12} /> +12%
                    </span>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm mb-1 uppercase tracking-wide">Total Revenue</p>
                  <h3 className="text-3xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</h3>
                </div>
              </div>

              {/* Quick Actions & Recent Additions Row */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Actions Grid */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => navigate('/farmer/create-listing')}
                        className="w-full bg-white border-2 border-farm-green-100 hover:border-farm-green-500 hover:bg-farm-green-50 text-farm-green-700 p-6 rounded-xl flex flex-col items-center justify-center gap-3 font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
                      >
                        <div className="p-3 bg-farm-green-100 rounded-lg group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </div>
                        Add New Product
                      </button>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="w-full bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-700 p-6 rounded-xl flex flex-col items-center justify-center gap-3 font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
                      >
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                          <ShoppingCart size={24} />
                        </div>
                        View Orders
                      </button>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="w-full bg-white border-2 border-purple-100 hover:border-purple-500 hover:bg-purple-50 text-purple-700 p-6 rounded-xl flex flex-col items-center justify-center gap-3 font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
                      >
                        <div className="p-3 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                          <Package size={24} />
                        </div>
                        Manage Products
                      </button>
                    </div>
                  </div>

                  {/* Recent Orders Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                      <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-farm-green-600 hover:text-farm-green-700">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading orders...</td></tr>
                          ) : orders.length > 0 ? (
                            orders.slice(0, 5).map(order => (
                              <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 font-semibold text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                                <td className="px-6 py-4 text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{order.buyer?.name || 'Customer'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                        'bg-orange-100 text-orange-700'}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium bg-gray-50/30">No recent orders found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sidebar Column: Recent Additions */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Products</h3>
                    <button onClick={() => setActiveTab('products')} className="text-sm font-bold text-farm-green-600 hover:text-farm-green-700">View All</button>
                  </div>

                  <div className="space-y-5">
                    {loading ? (
                      <p className="text-gray-500 text-sm">Loading...</p>
                    ) : products.slice(0, 5).map(product => (
                      <div key={product._id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <img
                          src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'}
                          alt={product.title}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{product.title}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-500">₹{product.basePrice} / {product.unit}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {product.status === 'active' ? 'ACTIVE' : 'DRAFT'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && !loading && (
                      <p className="text-gray-500 text-sm italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No products yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== 'dashboard' && (() => {
            const activeItem = menuItems.find(m => m.id === activeTab);
            const ActiveIcon = activeItem?.icon;

            return (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-sm max-w-md w-full">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                    {ActiveIcon && <ActiveIcon size={32} />}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeItem?.label}</h2>
                  <p className="text-gray-500 font-medium">This section is currently under development.</p>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}

export default FarmerDashboard;
