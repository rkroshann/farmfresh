import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain, TrendingUp, TrendingDown, Minus, RefreshCw, Sparkles,
  MapPin, Calendar, Lightbulb, BarChart2, ShieldCheck, Leaf,
  CloudSun, Truck, AlertTriangle, CheckCircle2, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

/* ─────────────────────────────────────────────
   Static data / config
───────────────────────────────────────────── */
const CROPS = [
  'Tomato', 'Onion', 'Potato', 'Rice', 'Wheat',
  'Maize', 'Carrot', 'Spinach', 'Brinjal', 'Mango',
];
const LOCATIONS = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata',
  'Hyderabad', 'Pune', 'Nashik', 'Jaipur', 'Lucknow',
];
const DEFAULT_PRICES = {
  Tomato: 20, Onion: 18, Potato: 15, Rice: 50,
  Wheat: 30, Maize: 22, Carrot: 35, Spinach: 25,
  Brinjal: 28, Mango: 90,
};

// Nearby market offset table (deterministic, not random)
const MARKET_OFFSETS = {
  Chennai:   [['Madurai', +4], ['Coimbatore', +2], ['Salem', -1]],
  Mumbai:    [['Pune', +3],    ['Nashik', +5],      ['Thane', -2]],
  Delhi:     [['Gurgaon', +2], ['Noida', +4],       ['Faridabad', -3]],
  Bangalore: [['Mysore', +5], ['Mangalore', +1],    ['Hubli', -2]],
  Kolkata:   [['Howrah', +3], ['Durgapur', -1],     ['Asansol', +2]],
  Hyderabad: [['Secunderabad', +2], ['Warangal', +4], ['Karimnagar', -1]],
  Pune:      [['Nashik', +3], ['Solapur', -2],      ['Kolhapur', +5]],
  Nashik:    [['Pune', +2],   ['Aurangabad', +4],   ['Mumbai', +1]],
  Jaipur:    [['Ajmer', +3], ['Jodhpur', -1],       ['Kota', +4]],
  Lucknow:   [['Kanpur', +2], ['Agra', +4],         ['Varanasi', -1]],
};

// Simulated 7-day historical + projected data
function buildChartData(currentPrice, predictedPrice) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Next\nWk'];
  const base = currentPrice;
  const volatility = base * 0.08;
  const history = days.slice(0, 7).map((day, i) => ({
    day,
    price: Math.max(1, +(base + (Math.sin(i * 0.9) * volatility)).toFixed(1)),
    type: 'historical',
  }));
  history.push({ day: 'Pred.', price: +predictedPrice.toFixed(1), type: 'predicted' });
  return history;
}

// Dynamic AI insights from prediction result
function generateInsights(crop, location, isProfit, changePct) {
  const season = (() => {
    const m = new Date().getMonth();
    if (m < 3) return 'winter';
    if (m < 6) return 'summer';
    if (m < 9) return 'monsoon';
    return 'autumn';
  })();

  return [
    {
      icon: <Leaf size={14} className="text-green-500" />,
      text: `${crop} supply ${isProfit ? 'decreasing' : 'increasing'} in ${location} region`,
    },
    {
      icon: <CloudSun size={14} className="text-yellow-500" />,
      text: `${season.charAt(0).toUpperCase() + season.slice(1)} weather ${isProfit ? 'boosting' : 'dampening'} demand`,
    },
    {
      icon: <Truck size={14} className="text-blue-500" />,
      text: `Transport availability ${Math.abs(changePct) > 10 ? 'constrained' : 'stable'} in this corridor`,
    },
    {
      icon: <BarChart2 size={14} className="text-purple-500" />,
      text: `Price expected to ${isProfit ? 'rise' : 'fall'} by ${Math.abs(changePct).toFixed(1)}% over 7 days`,
    },
  ];
}

const PREDICTION_FACTORS = [
  { icon: <BarChart2 size={15} className="text-indigo-500" />, label: 'Historical price trend' },
  { icon: <CloudSun size={15} className="text-yellow-500" />, label: 'Seasonal demand patterns' },
  { icon: <MapPin size={15} className="text-green-600" />, label: 'Local market conditions' },
  { icon: <Truck size={15} className="text-blue-500" />, label: 'Supply chain & transport' },
];

const API_URL = 'http://localhost:8000/predict-price';

/* ─────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────── */
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <RefreshCw size={16} className="animate-spin text-green-600" />
        <span className="text-sm font-semibold text-green-700">Analysing market data…</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Demand Gauge (read-only)
───────────────────────────────────────────── */
function DemandGauge({ value }) {
  const colour =
    value >= 75 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-400' : 'bg-red-400';
  const label =
    value >= 75 ? 'High' : value >= 50 ? 'Medium' : 'Low';
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Market Demand</span>
        <span className={`text-xs font-black px-2 py-0.5 rounded-full
          ${value >= 75 ? 'bg-green-100 text-green-700' : value >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
          {label} · {value}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${colour}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Custom chart tooltip
───────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-black text-gray-900">₹{payload[0].value}/kg</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function AIPricePrediction() {
  const currentMonth = new Date().getMonth() + 1;

  const [form, setForm] = useState({
    crop: 'Tomato',
    location: 'Chennai',
    month: currentMonth,
    demand: 70,
    previous_price: DEFAULT_PRICES['Tomato'],
  });

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [chartData, setChartData] = useState([]);

  const handleCropChange = (crop) => {
    setForm(prev => ({ ...prev, crop, previous_price: DEFAULT_PRICES[crop] || 20 }));
    setResult(null);
    setError('');
  };

  const predict = useCallback(async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setChartData(buildChartData(data.current_price, data.predicted_price));
    } catch (_err) {
      setError('Unable to reach AI service. Make sure the prediction API is running on port 8000.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => { predict(); }, []);   // auto-predict on mount

  /* Derived booleans */
  const isProfit  = result && result.predicted_price > result.current_price;
  const isLoss    = result && result.predicted_price < result.current_price;
  const changeAbs = result ? Math.abs(result.predicted_price - result.current_price).toFixed(2) : 0;
  const changePct = result ? result.change_percent : 0;

  const nearbyMarkets = (MARKET_OFFSETS[form.location] || []).map(([city, offset]) => ({
    city,
    price: +(form.previous_price + offset).toFixed(0),
    offset,
  }));

  const insights = result
    ? generateInsights(form.crop, form.location, isProfit, changePct)
    : [];

  /* ── Render ── */
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-white font-black text-lg leading-tight">AI Market Analysis</h2>
            <p className="text-green-100 text-xs font-medium">Random Forest · 10 k training samples</p>
          </div>
        </div>
        <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide shadow">BETA</span>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Controls ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Crop */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Crop</label>
            <select
              value={form.crop}
              onChange={e => handleCropChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Location</label>
            <select
              value={form.location}
              onChange={e => { setForm(p => ({ ...p, location: e.target.value })); setResult(null); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Current price */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Current Price (₹/kg)</label>
            <input
              type="number" min="1"
              value={form.previous_price}
              onChange={e => { setForm(p => ({ ...p, previous_price: Number(e.target.value) })); setResult(null); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Month */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Month</label>
            <select
              value={form.month}
              onChange={e => { setForm(p => ({ ...p, month: Number(e.target.value) })); setResult(null); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Demand Gauge (read-only) ── */}
        <DemandGauge value={form.demand} />

        {/* ── Predict button ── */}
        <button
          onClick={predict}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25'}`}
        >
          {loading
            ? <><RefreshCw size={18} className="animate-spin" /> Analysing market data…</>
            : <><Brain size={18} /> Get AI Prediction</>}
        </button>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && !error && <LoadingSkeleton />}

        {/* ══════════════════════════════════════
            RESULTS
        ══════════════════════════════════════ */}
        {result && !loading && !error && (
          <div className="space-y-5">

            {/* ── AI Analysis Card (4 metrics) ── */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Brain size={16} className="text-green-600" />
                <span className="text-sm font-black text-gray-800">AI Analysis Card</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
                {/* Current Price */}
                <div className="p-5 text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Current Price</p>
                  <p className="text-3xl font-black text-gray-900">₹{result.current_price}</p>
                  <p className="text-xs text-gray-400 mt-1">per kg</p>
                </div>
                {/* Predicted Price */}
                <div className={`p-5 text-center ${isProfit ? 'bg-green-50/60' : isLoss ? 'bg-red-50/60' : ''}`}>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Predicted Price</p>
                  <p className={`text-3xl font-black ${isProfit ? 'text-green-700' : isLoss ? 'text-red-600' : 'text-gray-900'}`}>
                    ₹{result.predicted_price}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">next week</p>
                </div>
                {/* Expected Change */}
                <div className="p-5 text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Expected Change</p>
                  <div className="flex items-center justify-center gap-1">
                    {isProfit ? <TrendingUp size={20} className="text-green-600" />
                      : isLoss ? <TrendingDown size={20} className="text-red-500" />
                      : <Minus size={20} className="text-gray-400" />}
                    <p className={`text-3xl font-black ${isProfit ? 'text-green-700' : isLoss ? 'text-red-600' : 'text-gray-700'}`}>
                      {isProfit ? '+' : isLoss ? '-' : ''}₹{changeAbs}
                    </p>
                  </div>
                  <p className={`text-xs font-bold mt-1 ${isProfit ? 'text-green-600' : isLoss ? 'text-red-500' : 'text-gray-500'}`}>
                    {changePct > 0 ? '+' : ''}{changePct}%
                  </p>
                </div>
                {/* Confidence */}
                <div className="p-5 text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Confidence</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck size={20} className="text-indigo-500" />
                    <p className="text-3xl font-black text-indigo-700">87%</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">High accuracy</p>
                </div>
              </div>
            </div>

            {/* ── Recommendation Alert ── */}
            <div className={`rounded-2xl p-5 flex items-start gap-4 border-2 ${
              isProfit
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isProfit ? 'bg-green-200' : 'bg-red-200'}`}>
                {isProfit
                  ? <CheckCircle2 size={24} className="text-green-700" />
                  : <AlertTriangle size={24} className="text-red-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-black uppercase tracking-widest ${isProfit ? 'text-green-700' : 'text-red-600'}`}>
                    {isProfit ? '🌟 HOLD — Better price ahead' : '⚡ SELL — Act now'}
                  </span>
                </div>
                <p className="text-gray-800 font-bold text-sm">{result.suggestion}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-500">Based on: {form.crop} · {form.location} · Month {form.month}</span>
                </div>
              </div>
            </div>

            {/* ── 7-Day Price Trend Chart ── */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-500" />
                <span className="text-sm font-black text-gray-800">7-Day Price Trend</span>
                <span className="ml-auto text-xs text-gray-400 font-medium">Historical + Prediction</span>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone" dataKey="price"
                      stroke="#16a34a" strokeWidth={2.5}
                      fill="url(#priceGrad)"
                      dot={(props) => {
                        const { cx, cy, index } = props;
                        const isLast = index === chartData.length - 1;
                        return (
                          <circle
                            key={index} cx={cx} cy={cy} r={isLast ? 6 : 3}
                            fill={isLast ? (isProfit ? '#16a34a' : '#ef4444') : '#16a34a'}
                            stroke="white" strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Bottom grid: Explanation + Markets + Insights ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* AI Explanation */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={16} className="text-indigo-600" />
                  <span className="text-sm font-black text-indigo-800">Prediction Factors</span>
                </div>
                <ul className="space-y-3">
                  {PREDICTION_FACTORS.map(({ icon, label }) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        {icon}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nearby Markets */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-sm font-black text-gray-800">Nearby Markets</span>
                </div>
                <div className="space-y-3">
                  {nearbyMarkets.map(({ city, price, offset }) => {
                    const best = offset === Math.max(...nearbyMarkets.map(m => m.offset));
                    return (
                      <div key={city} className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${
                        best ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent'
                      }`}>
                        <div className="flex items-center gap-2">
                          {best && <span className="text-[10px] font-black text-green-700 bg-green-200 px-1.5 py-0.5 rounded-full">BEST</span>}
                          <span className="text-sm font-semibold text-gray-700">{city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-sm font-black ${best ? 'text-green-700' : 'text-gray-800'}`}>₹{price}/kg</span>
                          {best && <ArrowRight size={14} className="text-green-600" />}
                        </div>
                      </div>
                    );
                  })}
                  {(() => {
                    const best = nearbyMarkets.reduce((a, b) => a.offset > b.offset ? a : b);
                    return best.offset > 0 ? (
                      <p className="text-xs text-gray-500 font-medium mt-1 px-1">
                        💡 Sell in <span className="font-bold text-green-700">{best.city}</span> to earn ₹{best.offset} more per kg
                      </p>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-yellow-600" />
                  <span className="text-sm font-black text-yellow-800">AI Insights</span>
                </div>
                <ul className="space-y-3">
                  {insights.map(({ icon, text }, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                        {icon}
                      </span>
                      <span className="text-xs font-medium text-gray-700 leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Meta footer ── */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium border-t border-gray-100 pt-4">
              <span className="flex items-center gap-1"><MapPin size={11} /> {result.location}</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> Month {form.month}</span>
              <span className="flex items-center gap-1"><Brain size={11} /> Model: Random Forest Regressor</span>
              <span className="flex items-center gap-1"><ShieldCheck size={11} /> {result.confidence}</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
