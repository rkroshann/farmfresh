import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ChevronRight, 
  ArrowLeft, 
  Loader2,
  ShieldCheck,
  Package,
  Truck
} from 'lucide-react';
import { getCart, getCartTotal } from '../utils/cartManager';
import toast from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    upiId: ''
  });

  useEffect(() => {
    const cartData = getCart();
    if (cartData.length === 0) {
      navigate('/marketplace');
    }
    setCart(cartData);
  }, [navigate]);

  const subtotal = getCartTotal();
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast.success('Payment Successful!');
      navigate('/order-success', { 
        state: { 
          orderId: `FF-${Math.floor(Math.random() * 900000) + 100000}`,
          total: total
        } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Cart</span>
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Secure Payment</h1>
          </div>
          <div className="w-24"></div> {/* Spacer */}
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex text-sm text-gray-500 items-center gap-2 mb-8">
          <span className="hover:text-green-600 cursor-pointer" onClick={() => navigate('/cart')}>Cart</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-green-600 font-semibold">Payment</span>
          <ChevronRight className="w-4 h-4" />
          <span>Success</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Select Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* UPI Option */}
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === 'upi' ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-green-200'
                  }`}
                >
                  <div className={`p-3 rounded-full ${paymentMethod === 'upi' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className={`font-bold ${paymentMethod === 'upi' ? 'text-green-800' : 'text-gray-500'}`}>UPI</span>
                </button>

                {/* Card Option */}
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-green-200'
                  }`}
                >
                  <div className={`p-3 rounded-full ${paymentMethod === 'card' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className={`font-bold ${paymentMethod === 'card' ? 'text-green-800' : 'text-gray-500'}`}>Card</span>
                </button>

                {/* COD Option */}
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-green-200'
                  }`}
                >
                  <div className={`p-3 rounded-full ${paymentMethod === 'cod' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Banknote className="w-6 h-6" />
                  </div>
                  <span className={`font-bold ${paymentMethod === 'cod' ? 'text-green-800' : 'text-gray-500'}`}>Cash on Delivery</span>
                </button>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Cardholder Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Card Number</label>
                        <input 
                          type="text" 
                          name="cardNumber"
                          required
                          maxLength="16"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transition-all font-mono"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Expiry Date</label>
                        <input 
                          type="text" 
                          name="expiry"
                          required
                          maxLength="5"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">CVV</label>
                        <input 
                          type="password" 
                          name="cvv"
                          required
                          maxLength="3"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                          placeholder="***"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-semibold text-gray-600">UPI ID</label>
                    <input 
                      type="text" 
                      name="upiId"
                      required
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                      placeholder="username@bank"
                    />
                    <p className="text-xs text-gray-400 mt-2">Enter your UPI ID linked to GPay, PhonePe, or Paytm</p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white shrink-0">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-800">Cash on Delivery Info</h4>
                      <p className="text-sm text-yellow-700">Please keep the exact change ready for a faster delivery experience. ₹30 delivery fee applies.</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 mt-6 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                    loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay ₹{total}
                    </>
                  )}
                </button>
              </form>
            </section>

            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>PCI-DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      <p className="text-green-600 font-bold text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-gray-800 pt-2 border-t mt-4">
                  <span>Total</span>
                  <span className="text-green-600">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c8e6c9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Payment;
