import React from 'react';
import { Leaf, Heart, Mail, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface FooterProps {
  onSelectTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 shadow-md">
                <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold text-white">FloraVision AI</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Empowering farmers, horticulturists, and plant enthusiasts with state-of-the-art PyTorch ResNet-34 computer vision for instant plant pathology diagnosis.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                PyTorch 2.x
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                React 19 + TS
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                Tailwind CSS
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button 
                  onClick={() => onSelectTab?.('detector')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  AI Diagnosis Scanner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab?.('library')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  39 Disease Compendium
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab?.('market')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Remedy & Fertilizer Store
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab?.('contact')}
                  className="hover:text-brand-400 transition-colors text-left text-brand-400 font-bold flex items-center gap-1.5"
                >
                  <span>Contact Developer</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Crops */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Supported Crops</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Tomato, Apple, Corn & Grape</li>
              <li>Potato, Pepper Bell, Strawberry</li>
              <li>Peach, Cherry, Blueberry, Squash</li>
              <li>Soybean, Raspberry & Background</li>
            </ul>
          </div>

          {/* Col 4: Creator & Connect */}
          <div>
            <h4 className="text-white font-bold text-sm mb-2">Project Creator</h4>
            <p className="text-xs text-slate-300 font-semibold mb-1">Suvadip Mondal</p>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Machine Learning & AI Developer focusing on Computer Vision and Deep Learning.
            </p>

            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/suvo1119" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-brand-500/50 hover:bg-slate-800 transition-all"
                title="GitHub: suvo1119"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a 
                href="https://www.linkedin.com/in/suvadip-mondal-sm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:border-blue-500/50 hover:bg-slate-800 transition-all"
                title="LinkedIn: Suvadip Mondal"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a 
                href="mailto:suvadipmondal614@gmail.com" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400 hover:text-brand-300 hover:border-brand-500/50 hover:bg-slate-800 transition-all"
                title="Email: suvadipmondal614@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a 
                href="https://github.com/suvo1119/Plant-Disease-Detection" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
                title="GitHub Repository"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} FloraVision AI &bull; Created by <a href="https://github.com/suvo1119" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-brand-400 font-medium underline-offset-2 hover:underline">Suvadip Mondal</a></p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for plant health</span>
            <Heart className="w-3.5 h-3.5 text-brand-400 fill-brand-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
