import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AIPricePrediction from '../components/AIPricePrediction';

export default function AIPredictionPage() {
  const navigate = useNavigate();

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
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              AI Crop Price Prediction
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Get smart insights on when to sell your crops
            </p>
          </div>

          <div className="w-24 flex justify-end">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-100">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-extrabold">AI Insights</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <AIPricePrediction />
      </main>
    </div>
  );
}

