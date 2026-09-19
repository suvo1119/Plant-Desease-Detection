import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Camera, RefreshCw, AlertTriangle, ShieldCheck, 
  ExternalLink, Image as ImageIcon, Info, Zap, X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { predictDisease, type DiseasePrediction } from '../services/api';

interface DiseaseDetectorProps {
  initialSample?: string | null;
  onClearSample?: () => void;
  onGoToMarket?: () => void;
}

export const DiseaseDetector: React.FC<DiseaseDetectorProps> = ({
  initialSample,
  onClearSample,
}) => {
  const [, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<DiseasePrediction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis steps animation strings
  const analysisPhases = [
    'Transposing EXIF & Normalizing 224x224 RGB Tensor...',
    'Feeding Tensor into PyTorch ResNet-34 Neural Network...',
    'Evaluating Dual-Engine Pathology Classifiers...',
    'Finalizing Consolidated Diagnosis & Remedy Protocol...',
  ];

  // Handle sample image auto-load when triggered from Hero
  useEffect(() => {
    if (initialSample) {
      loadSampleImage(initialSample);
    }
  }, [initialSample]);

  const loadSampleImage = async (filename: string) => {
    try {
      setAnalyzing(true);
      setErrorMsg(null);
      setResult(null);
      
      // Fetch sample image asset from backend or local static
      const sampleUrl = `/static/${filename}`;
      const response = await fetch(sampleUrl).catch(() => fetch(`/static/sample_${filename}`));
      
      if (!response.ok) {
        const fallbackRes = await fetch(`/static/sample_${filename}`);
        const blob = await fallbackRes.blob();
        const file = new File([blob], filename, { type: 'image/jpeg' });
        handleFileSelect(file);
      } else {
        const blob = await response.blob();
        const file = new File([blob], filename, { type: 'image/jpeg' });
        handleFileSelect(file);
      }
    } catch (err) {
      console.warn('Could not auto-fetch sample file, creating fallback file:', err);
      const canvas = document.createElement('canvas');
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 0, 224, 224);
        ctx.fillStyle = '#bbf7d0';
        ctx.beginPath();
        ctx.arc(112, 112, 60, 0, Math.PI * 2);
        ctx.fill();
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: 'image/png' });
          handleFileSelect(file);
        }
      });
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid plant leaf image (JPG, PNG, WEBP).');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg(null);
    setResult(null);
    runAnalysisPipeline(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const runAnalysisPipeline = async (file: File) => {
    setAnalyzing(true);
    setAnalysisStep(0);
    setErrorMsg(null);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisPhases.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 500);

    try {
      const res = await predictDisease(file, 'unified');
      clearInterval(stepInterval);
      setAnalyzing(false);
      setResult(res);

      if (res.is_healthy) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#4ade80', '#86efac']
        });
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setAnalyzing(false);
      setErrorMsg(err.message || 'Failed to analyze image. Please ensure Python backend is running.');
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMsg(null);
    setAnalyzing(false);
    if (onClearSample) onClearSample();
  };

  const sampleLeaves = [
    { name: 'Mango', file: 'sample_mango_diseased.JPG', icon: '🥭' },
    { name: 'Tomato', file: 'sample_tomato_early_blight.JPG', icon: '🍅' },
    { name: 'Lemon', file: 'sample_lemon_diseased.JPG', icon: '🍋' },
    { name: 'Apple Scab', file: 'sample_Apple_scab.JPG', icon: '🍎' },
    { name: 'Corn Rust', file: 'sample_corn_common_rust.JPG', icon: '🌽' },
    { name: 'Pomegranate', file: 'sample_pomegranate_healthy.JPG', icon: '🍎' },
    { name: 'Grape Rot', file: 'sample_grape_black_rot.JPG', icon: '🍇' },
    { name: 'Guava', file: 'sample_guava_diseased.JPG', icon: '🍈' },
  ];

  return (
    <section id="detector" className="py-12 md:py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Unified Dual-Engine AI • 61 Plant Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analyze Plant Health in Seconds
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Upload or drop any plant leaf photo for instant AI diagnosis across 26 plant species & 61 disease categories.
          </p>
        </div>

        {/* Main Detector Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            
            {/* STATE 1: UPLOAD DROPZONE */}
            {!previewUrl && !analyzing && !result && (
              <motion.div
                key="upload-zone"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
                    : 'border-slate-800 hover:border-brand-500/50 bg-slate-900/40 hover:bg-slate-900/80'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />

                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-emerald-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
                  <Upload className="w-8 h-8 stroke-[2]" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5">
                  Drop your plant leaf photo here
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-5">
                  Supports <strong className="text-brand-400">Mango, Tomato, Lemon, Apple, Guava, Grape, Pomegranate, Corn, Potato, Jamun & more (61 categories)</strong>
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-brand-400 hover:to-emerald-400 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Browse Leaf Photo
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all border border-slate-700 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-brand-400" />
                    Camera Capture
                  </button>
                </div>

                {/* Quick Sample Leaf Test Buttons */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="pt-4 border-t border-slate-800/80 max-w-xl mx-auto"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Or test with a sample leaf:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {sampleLeaves.map((s) => (
                      <button
                        key={s.file}
                        type="button"
                        onClick={() => loadSampleImage(s.file)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/40 text-xs font-semibold transition-all"
                      >
                        <span>{s.icon}</span>
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* STATE 2: SCANNING & ANALYSIS ANIMATION */}
            {analyzing && previewUrl && (
              <motion.div
                key="analyzing-zone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="relative w-64 h-64 mx-auto mb-8 rounded-2xl overflow-hidden border-2 border-brand-500/50 shadow-2xl shadow-brand-500/20">
                  {/* Target Image */}
                  <img
                    src={previewUrl}
                    alt="Scanning target"
                    className="w-full h-full object-cover filter contrast-105"
                  />
                  
                  {/* Animated Laser Scanning Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_15px_#22c55e] animate-scan-line" />
                  
                  {/* Radar Corner Brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-400" />
                  
                  {/* Overlay Dark Blur Grid */}
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-brightness-110 pointer-events-none" />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-3">
                  <RefreshCw className="w-4 h-4 text-brand-400 animate-spin" />
                  <span>ResNet-34 AI Neural Engine Active</span>
                </div>

                <h3 className="text-2xl font-bold text-white">Diagnosing Leaf Specimen</h3>
                <p className="text-sm text-brand-400 font-mono mt-2 transition-all">
                  {analysisPhases[analysisStep]}
                </p>

                {/* Progress bar */}
                <div className="w-64 mx-auto mt-6 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-400"
                    initial={{ width: '10%' }}
                    animate={{ width: `${((analysisStep + 1) / analysisPhases.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            )}

            {/* STATE 3: DIAGNOSIS RESULTS DISPLAY */}
            {!analyzing && result && (
              <motion.div
                key="results-zone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Result Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={result.user_image_url || previewUrl || ''}
                      alt="Diagnosed leaf"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 shadow-md"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
                          {result.crop}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                          result.is_healthy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {result.is_healthy ? 'Healthy Leaf' : 'Infection Detected'}
                        </span>
                        {result.model_used && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {result.model_used}
                          </span>
                        )}
                        {result.alternative && (
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/80">
                            Runner-up: {result.alternative.crop} ({result.alternative.confidence}%)
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {result.condition}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={resetAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan New Image</span>
                  </button>
                </div>

                {/* Main Metrics & Disease Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Confidence Gauge Card */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between items-center text-center">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">
                      AI Model Confidence
                    </h4>

                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                          className={result.is_healthy ? 'text-brand-400' : result.confidence > 85 ? 'text-emerald-400' : 'text-amber-400'}
                          strokeDasharray={`${result.confidence}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          initial={{ strokeDasharray: '0, 100' }}
                          animate={{ strokeDasharray: `${result.confidence}, 100` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">{result.confidence}%</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Match Ratio</span>
                      </div>
                    </div>

                    <div className="w-full pt-4 mt-2 border-t border-slate-800/80 text-left">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Classification Model:</span>
                        <span className="text-slate-200 font-bold">ResNet-34</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Class Index:</span>
                        <span className="text-slate-200 font-bold">#{result.pred_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Overview Description */}
                  <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
                      <Info className="w-4 h-4" />
                      <span>Disease Overview & Pathology</span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      {result.description}
                    </p>

                    {/* Prevention Steps */}
                    <div className="pt-4 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Recommended Action Plan & Possible Steps</span>
                      </div>
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                        {result.prevent}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Supplement Remedy Box */}
                {result.supplement && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-emerald-950/80 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      {result.supplement.image && (
                        <img
                          src={result.supplement.image}
                          alt={result.supplement.name}
                          className="w-20 h-20 rounded-xl object-cover bg-white p-1 shadow-lg"
                        />
                      )}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-brand-400">
                          Recommended Remedy & Treatment Supplement
                        </div>
                        <h4 className="text-lg font-bold text-white mt-0.5">
                          {result.supplement.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Specifically formulated to cure {result.condition} and boost crop resilience.
                        </p>
                      </div>
                    </div>

                    {result.supplement.buy_link && (
                      <a
                        href={result.supplement.buy_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-brand-400 hover:to-emerald-400 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                      >
                        <span>Buy Supplement Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                )}

              </motion.div>
            )}

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">Prediction Error</div>
                  <div>{errorMsg}</div>
                </div>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};
