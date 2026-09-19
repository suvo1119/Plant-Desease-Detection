import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldCheck, ExternalLink, X, BookOpen, Leaf } from 'lucide-react';
import { fetchAllDiseases, type DiseaseItem } from '../services/api';

export const DiseaseLibrary: React.FC = () => {
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState<DiseaseItem | null>(null);

  useEffect(() => {
    loadDiseases();
  }, []);

  const loadDiseases = async () => {
    setLoading(true);
    const data = await fetchAllDiseases();
    setDiseases(data);
    setLoading(false);
  };

  // Extract unique crop categories for filter tabs
  const cropCategories = ['All', ...Array.from(new Set(diseases.map((d) => d.crop)))].filter(Boolean);

  const filteredDiseases = diseases.filter((item) => {
    const matchesCrop = selectedCrop === 'All' || item.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesSearch =
      item.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <section id="library" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              <span>Plant Disease Compendium</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              39 Crop Disease Knowledge Base
            </h2>
            <p className="text-slate-400 text-base mt-2 max-w-2xl">
              Browse detailed pathology profiles, visual symptoms, and curative protocols for all 39 supported plant species.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crop or disease..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {cropCategories.map((crop) => (
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
            <p className="text-sm font-semibold">Loading plant disease database...</p>
          </div>
        )}

        {/* Disease Cards Grid */}
        {!loading && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredDiseases.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveModalItem(item)}
                  className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden cursor-pointer glass-card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.disease_name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback placeholder image on broken external URLs
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-extrabold uppercase bg-slate-950/80 backdrop-blur-md text-brand-300 px-2.5 py-1 rounded-md border border-slate-700">
                          {item.crop}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.is_healthy ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                        }`}>
                          {item.is_healthy ? 'Healthy' : 'Diseased'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {item.condition}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-xs text-brand-400 font-bold">
                    <span>View Treatment Protocol</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredDiseases.length === 0 && (
          <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Leaf className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No plant disease found</h3>
            <p className="text-sm text-slate-500 mt-1">Try changing your search term or crop filter pill.</p>
          </div>
        )}

      </div>

      {/* DETAIL MODAL POPUP */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel max-w-2xl w-full rounded-3xl border border-slate-700 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header Image */}
              <div className="relative h-56 bg-slate-900 overflow-hidden shrink-0">
                <img
                  src={activeModalItem.image_url}
                  alt={activeModalItem.disease_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-bold uppercase text-brand-400 bg-brand-500/20 px-2.5 py-1 rounded-md border border-brand-500/30">
                    {activeModalItem.crop}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {activeModalItem.disease_name}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Pathology & Symptoms
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeModalItem.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Prevention & Treatment Protocol</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                    {activeModalItem.prevent}
                  </p>
                </div>

                {activeModalItem.supplement && activeModalItem.supplement.buy_link && (
                  <div className="pt-2">
                    <a
                      href={activeModalItem.supplement.buy_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-brand-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Buy {activeModalItem.supplement.name}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
