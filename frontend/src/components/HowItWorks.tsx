import React from 'react';
import { Upload, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Snap or Upload Leaf',
      desc: 'Capture a close-up photo of any affected plant leaf using your smartphone or desktop browser.',
      icon: Upload,
      color: 'from-brand-500 to-emerald-500',
    },
    {
      num: '02',
      title: 'PyTorch AI Scanning',
      desc: 'Our fine-tuned ResNet-34 neural network processes leaf texture, color variations, and lesions.',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      num: '03',
      title: 'Get Cure & Treatment',
      desc: 'Receive exact confidence percentage, tailored preventative guidelines, and direct remedy supplement links.',
      icon: ShieldCheck,
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FloraVision AI Works
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Engineered with PyTorch deep vision models to diagnose crop ailments in under one second.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card p-8 rounded-3xl border border-slate-800 relative group glass-card-hover"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 shadow-lg`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                      <Icon className="w-6 h-6 text-brand-400" />
                    </div>
                  </div>
                  <span className="text-4xl font-black text-slate-800 group-hover:text-brand-500/30 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
