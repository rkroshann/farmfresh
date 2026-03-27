import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Home, 
  ShoppingBag, 
  ChevronRight,
  Package,
  Calendar,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clearCart } from '../utils/cartManager';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, total } = location.state || { orderId: 'FF-123456', total: 0 };

  // Clear cart on mount
  React.useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-600 p-10 flex flex-col items-center text-white relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <CheckCircle2 className="w-24 h-24 mb-4 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-center"
          >
            Order Placed Successfully!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-green-100 mt-2 text-center text-sm"
          >
            Your fresh farm produce is on its way.
          </motion.p>
        </div>

        {/* Order Details Card */}
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Order ID</p>
                    <p className="font-bold text-gray-800 tracking-tight">{orderId}</p>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-700">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Delivery</span>
                  </div>
                  <p className="font-bold text-gray-800 text-sm">Today, 8 PM</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1 text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Amount</span>
                  </div>
                  <p className="font-bold text-gray-800 text-sm">₹{total}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button 
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-bold group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span>View Orders</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-bold shadow-lg shadow-gray-200"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 px-4">
            A confirmation email has been sent to your registered email address with full order details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
