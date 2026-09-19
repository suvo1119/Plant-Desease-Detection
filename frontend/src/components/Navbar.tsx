import React, { useState, useEffect } from 'react';
import { Leaf, Search, ShoppingBag, Menu, X, Cpu, Sparkles, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, serverOnline }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'detector', label: 'AI Diagnosis', icon: Cpu },
    { id: 'library', label: 'Disease Library', icon: Search },
    { id: 'market', label: 'Remedy Market', icon: ShoppingBag },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('detector')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">FloraVision</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20 uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Plant Pathology & Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navTabHighlight"
                      className="absolute inset-0 bg-gradient-to-r from-brand-600 to-emerald-600 rounded-xl shadow-md shadow-brand-500/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-brand-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-medium text-slate-300">
                {serverOnline ? 'PyTorch AI Online' : 'Offline Mode'}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('detector')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-brand-500/25 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Diagnose Leaf</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-4 pb-6 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-left transition-colors ${
                      isActive ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-brand-400" />
                    {item.label}
                  </button>
                );
              })}

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">AI Server Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${serverOnline ? 'bg-brand-500/20 text-brand-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {serverOnline ? 'PyTorch ResNet-34 Connected' : 'Local Fallback'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
