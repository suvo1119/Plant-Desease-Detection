import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Award, Sparkles, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface HeroProps {
  onStartDiagnosis: () => void;
  onSelectSample: (sampleFileName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartDiagnosis, onSelectSample }) => {
  const sampleImages = [
    { name: 'Mango', file: 'sample_mango_diseased.JPG', icon: '🥭' },
    { name: 'Tomato Blight', file: 'sample_tomato_early_blight.JPG', icon: '🍅' },
    { name: 'Lemon', file: 'sample_lemon_diseased.JPG', icon: '🍋' },
    { name: 'Apple Scab', file: 'sample_Apple_scab.JPG', icon: '🍎' },
    { name: 'Corn Rust', file: 'sample_corn_common_rust.JPG', icon: '🌽' },
    { name: 'Guava', file: 'sample_guava_diseased.JPG', icon: '🍈' },
  ];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-brand-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Unified ResNet-34 Deep Learning Engine • 61 Plant Categories</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Instant AI Plant Disease{' '}
            <span className="gradient-text-glow">Diagnosis & Treatment</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto"
          >
            Upload a plant leaf photo for real-time AI pathology analysis. Receive precision confidence metrics, prevention strategies, and recommended remedy supplements in seconds.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onStartDiagnosis}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-emerald-500 to-green-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-extrabold text-base transition-all duration-300 shadow-xl shadow-brand-500/25 flex items-center justify-center gap-3 group active:scale-95"
            >
              <Zap className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>Upload Leaf Photo</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5 text-brand-400" />
              <span>How AI Engine Works</span>
            </a>
          </motion.div>

          {/* Sample Preset Shortcut Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 pt-6 border-t border-slate-800/80 max-w-2xl mx-auto"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Don't have an image ready? Try a sample leaf:
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {sampleImages.map((s) => (
                <button
                  key={s.file}
                  onClick={() => onSelectSample(s.file)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/40 text-xs font-semibold transition-all duration-200"
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Feature Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">39</div>
              <div className="text-xs text-slate-400 font-medium">Plant & Crop Classes</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">98.4%</div>
              <div className="text-xs text-slate-400 font-medium">PyTorch Accuracy</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">&lt; 1 Sec</div>
              <div className="text-xs text-slate-400 font-medium">Instant AI Inference</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">Rx Remedy</div>
              <div className="text-xs text-slate-400 font-medium">Matched Products</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
