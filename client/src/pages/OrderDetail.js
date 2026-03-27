import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  ExternalLink,
  Home,
  Package,
  RefreshCw,
  Truck,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart, updateQuantity } from '../utils/cartManager';

const STATUS_META = {
  delivered: {
    label: 'Delivered',
    badge: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2
  },
  processing: {
    label: 'Processing',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Truck
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  }
};

function formatINR(amount) {
  const n = typeof amount === 'number' ? amount : Number(amount || 0);
  return `₹${n.toFixed(0)}`;
}

function makeDemoImageDataUri(label) {
  const safe = String(label || 'FarmFresh').slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#e8f5e9"/>
      <stop offset="1" stop-color="#c8e6c9"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="28" fill="url(#g)"/>
  <circle cx="74" cy="78" r="22" fill="#4caf50" opacity="0.18"/>
  <circle cx="170" cy="164" r="34" fill="#388e3c" opacity="0.12"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        font-size="18" font-weight="800" fill="#1b5e20">${safe}</text>
  <text x="50%" y="66%" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        font-size="12" font-weight="700" fill="#2e7d32">FarmFresh</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function OrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = makeDemoImageDataUri('FarmFresh');
  };

  // Same dummy dataset used in OrderList (fallback when deep-linking directly).
  const dummyOrders = useMemo(
    () => [
      {
        id: 'FF1001',
        displayId: '#FF1001',
        dateLabel: '25 March 2026',
        total: 120,
        paymentMethodLabel: 'UPI',
        status: 'delivered',
        deliveryFee: 30,
        etaLabel: 'Today, 8 PM',
        items: [
          {
            id: 'p-tomatoes',
            name: 'Fresh Organic Tomatoes',
            image: makeDemoImageDataUri('Tomatoes'),
            quantity: 1,
            price: 60
          },
          {
            id: 'p-milk',
            name: 'Farm Fresh Milk (1L)',
            image: makeDemoImageDataUri('Milk 1L'),
            quantity: 1,
            price: 60
          }
        ]
      },
      {
        id: 'FF1002',
        displayId: '#FF1002',
        dateLabel: '20 March 2026',
        total: 210,
        paymentMethodLabel: 'Card',
        status: 'processing',
        deliveryFee: 30,
        etaLabel: 'Tomorrow, 10 AM',
        items: [
          {
            id: 'p-eggs',
            name: 'Desi Eggs (12 pack)',
            image: makeDemoImageDataUri('Eggs'),
            quantity: 1,
            price: 90
          },
          {
            id: 'p-spinach',
            name: 'Fresh Spinach',
            image: makeDemoImageDataUri('Spinach'),
            quantity: 2,
            price: 60
          }
        ]
      },
      {
        id: 'FF1003',
        displayId: '#FF1003',
        dateLabel: '12 March 2026',
        total: 180,
        paymentMethodLabel: 'Cash on Delivery',
        status: 'cancelled',
        deliveryFee: 30,
        etaLabel: '—',
        items: [
          {
            id: 'p-bananas',
            name: 'Bananas (1 dozen)',
            image: makeDemoImageDataUri('Bananas'),
            quantity: 2,
            price: 45
          },
          {
            id: 'p-apples',
            name: 'Apples (1 kg)',
            image: makeDemoImageDataUri('Apples'),
            quantity: 1,
            price: 90
          }
        ]
      }
    ],
    []
  );

  const order = useMemo(() => {
    const fromState = location.state?.order;
    if (fromState) return fromState;
    const normalizedId = (id || '').replace('#', '');
    return dummyOrders.find((o) => o.id === normalizedId) || null;
  }, [location.state, id, dummyOrders]);

  const meta = STATUS_META[order?.status] || STATUS_META.processing;
  const StatusIcon = meta.icon;

  const computedSubtotal = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }, [order]);

  const deliveryFee = order?.deliveryFee ?? 30;
  const finalTotal = order?.total ?? computedSubtotal + deliveryFee;

  const handleReorder = () => {
    if (!order) return;
    try {
      order.items.forEach((item) => {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          unit: 'unit'
        });
        updateQuantity(item.id, item.quantity);
      });
      toast.success('Items added to cart');
      navigate('/cart');
    } catch {
      toast.error('Failed to reorder');
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900">Order not found</h1>
          <p className="text-gray-500 mt-2">This order doesn’t exist (yet) in demo data.</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-extrabold hover:bg-green-700 active:scale-[0.99] transition"
          >
            Back to My Orders
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 font-bold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Order Details</h1>
            <div className="text-xs text-gray-500 mt-1">
              <span className="hover:text-green-700 cursor-pointer" onClick={() => navigate('/')}>
                Home
              </span>
              <span className="mx-2 text-gray-300">/</span>
              <span className="hover:text-green-700 cursor-pointer" onClick={() => navigate('/orders')}>
                My Orders
              </span>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-green-700 font-extrabold">{order.displayId}</span>
            </div>
          </div>

          <button
            onClick={() => toast('Invoice download coming soon', { icon: '🧾' })}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 font-bold transition"
          >
            <ExternalLink className="w-5 h-5" />
            Invoice
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tight">{order.displayId}</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{order.dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{order.paymentMethodLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>ETA: {order.etaLabel || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-extrabold ${meta.badge}`}>
                    <StatusIcon className="w-4 h-4" />
                    {meta.label}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Final total</p>
                    <p className="text-2xl font-black text-green-700">{formatINR(finalTotal)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => toast('Tracking coming soon', { icon: '📦' })}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-extrabold hover:border-yellow-200 hover:bg-yellow-50 active:scale-[0.99] transition"
                >
                  <Truck className="w-5 h-5 text-yellow-700" />
                  Track Order
                </button>
                <button
                  onClick={handleReorder}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-extrabold hover:border-green-200 hover:bg-green-50 active:scale-[0.99] transition"
                >
                  <RefreshCw className="w-5 h-5 text-green-700" />
                  Reorder
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white font-extrabold hover:bg-black active:scale-[0.99] transition"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Items in this order
              </h2>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/40"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-white shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={handleImgError}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: <span className="font-extrabold text-gray-900">{item.quantity}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        Price: <span className="font-extrabold text-gray-900">{formatINR(item.price)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Subtotal</p>
                      <p className="text-lg font-black text-gray-900">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-24">
              <h3 className="text-lg font-black text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{formatINR(computedSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery charge</span>
                  <span className="font-bold text-gray-900">{formatINR(deliveryFee)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-900 font-black">Final total</span>
                  <span className="text-green-700 font-black text-xl">{formatINR(finalTotal)}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-xs font-extrabold text-green-800">FarmFresh Tip</p>
                <p className="text-sm text-green-900 mt-1">
                  Reorder your favorites in one click and get farm-fresh delivery again.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default OrderDetail;
