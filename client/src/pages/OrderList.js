import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  CreditCard,
  Package,
  RefreshCw,
  Truck,
  ChevronRight,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart, updateQuantity } from '../utils/cartManager';

const STATUS_META = {
  delivered: {
    label: 'Delivered',
    badge: 'bg-green-100 text-green-800 border-green-200'
  },
  processing: {
    label: 'Processing',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-100 text-red-800 border-red-200'
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

function OrderCard({ order, onViewDetails, onReorder, onTrack }) {
  const status = STATUS_META[order.status] || STATUS_META.processing;
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = makeDemoImageDataUri('FarmFresh');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="font-black text-gray-900 tracking-tight">{order.displayId}</span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{order.dateLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="capitalize">{order.paymentMethodLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-extrabold ${status.badge}`}>
              {status.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-black text-green-700">{formatINR(order.total)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-extrabold text-gray-800 flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-green-600" />
            Products
          </h4>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImgError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: <span className="font-semibold text-gray-700">{item.quantity}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    Price: <span className="font-semibold text-gray-700">{formatINR(item.price)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Subtotal</p>
                  <p className="font-extrabold text-gray-900">{formatINR(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onViewDetails}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-extrabold shadow-sm hover:bg-green-700 active:scale-[0.99] transition"
          >
            View Details
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onReorder}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-extrabold hover:border-green-200 hover:bg-green-50 active:scale-[0.99] transition"
          >
            <RefreshCw className="w-5 h-5 text-green-700" />
            Reorder
          </button>
          <button
            onClick={onTrack}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-extrabold hover:border-yellow-200 hover:bg-yellow-50 active:scale-[0.99] transition"
          >
            <Truck className="w-5 h-5 text-yellow-700" />
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all | delivered | processing | cancelled
  const [query, setQuery] = useState('');

  // Dummy data (until backend order history is wired)
  const orders = useMemo(
    () => [
      {
        id: 'FF1001',
        displayId: '#FF1001',
        dateLabel: '25 March 2026',
        total: 120,
        paymentMethodLabel: 'UPI',
        status: 'delivered',
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

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchStatus = filter === 'all' ? true : o.status === filter;
      const matchQuery =
        q.length === 0
          ? true
          : `${o.displayId} ${o.dateLabel} ${o.paymentMethodLabel} ${o.status} ${o.items.map((i) => i.name).join(' ')}`
              .toLowerCase()
              .includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, filter, query]);

  const handleReorder = (order) => {
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

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'processing', label: 'Processing' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

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
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">My Orders</h1>
            <div className="text-xs text-gray-500 mt-1">
              <span className="hover:text-green-700 cursor-pointer" onClick={() => navigate('/')}>
                Home
              </span>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-green-700 font-extrabold">My Orders</span>
            </div>
          </div>

          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold border transition ${
                    filter === f.id
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 relative top-px" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders, products..."
                className="w-full pl-9 pr-3 py-2.5 leading-6 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900">No orders yet</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Once you place an order, it will show up here with tracking and reorder options.
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-extrabold hover:bg-green-700 active:scale-[0.99] transition"
            >
              Browse Marketplace
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {visibleOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => navigate(`/orders/${order.id}`, { state: { order } })}
                onReorder={() => handleReorder(order)}
                onTrack={() => toast('Tracking coming soon', { icon: '📦' })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderList;
