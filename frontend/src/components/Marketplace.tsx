import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, ExternalLink } from 'lucide-react';
import { fetchMarketSupplements, type MarketSupplement } from '../services/api';

export const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketSupplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');

  useEffect(() => {
    loadMarket();
  }, []);

  const loadMarket = async () => {
    setLoading(true);
    const data = await fetchMarketSupplements();
    setItems(data);
    setLoading(false);
  };

  const crops = ['All', ...Array.from(new Set(items.map((i) => i.crop)))].filter(Boolean);

  const filteredItems = items.filter((item) => {
    const matchesCrop = selectedCrop === 'All' || item.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesSearch =
      item.supplement_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disease_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <section id="market" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-400" />
              <span>Plant Protection Store</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Remedy & Supplement Market
            </h2>
            <p className="text-slate-400 text-base mt-2 max-w-2xl">
              Authentic fungicides, bactericides, and plant bio-stimulants tailored to treat specific crop infections.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search supplement or crop..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCrop === crop
                  ? 'bg-gradient-to-r from-brand-500 to-emerald-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold">Loading marketplace remedies...</p>
          </div>
        )}

        {/* Market Items Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between glass-card-hover"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 w-full bg-white p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.supplement_image}
                        alt={item.supplement_name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=400&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-extrabold uppercase bg-slate-950/90 text-brand-300 px-2.5 py-1 rounded-md border border-slate-800">
                          {item.crop}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Cures: {item.disease_name.split(' : ')[1] || item.disease_name}
                      </div>
                      <h3 className="text-base font-bold text-white line-clamp-2">
                        {item.supplement_name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a
                      href={item.buy_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-slate-950 font-bold text-xs hover:from-brand-400 hover:to-emerald-400 transition-all shadow-md shadow-brand-500/15 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Buy Remedy</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
