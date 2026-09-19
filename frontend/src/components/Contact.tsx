import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Code2, 
  ExternalLink, 
  MessageSquare, 
  Cpu, 
  Award, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'AI Model & Research Inquiry',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailAddress = 'suvadipmondal614@gmail.com';
  const githubUrl = 'https://github.com/suvo1119';
  const linkedinUrl = 'https://www.linkedin.com/in/suvadip-mondal-sm/';
  const repoUrl = 'https://github.com/suvo1119/Plant-Disease-Detection';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Fallback gracefully
      }
    }, 800);
  };

  const handleSendDirectEmail = () => {
    const subjectEncoded = encodeURIComponent(`[FloraVision AI] ${formData.subject || 'Inquiry'}`);
    const bodyEncoded = encodeURIComponent(
      `Hello Suvadip,\n\nName: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\n\nMessage:\n${formData.message || 'I would like to connect regarding FloraVision AI.'}`
    );
    window.open(`mailto:${emailAddress}?subject=${subjectEncoded}&body=${bodyEncoded}`, '_blank');
  };

  return (
    <section id="contact" className="py-12 md:py-20 relative">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Project Creator & AI Architect</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            Get In Touch with <span className="gradient-text">Suvadip Mondal</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg mt-3"
          >
            Passionate Machine Learning & AI Developer crafting Deep Learning CNN models, Computer Vision systems, and practical agricultural pathology solutions.
          </motion.p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Creator Profile & Direct Contact Links (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Developer Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-brand-500/20 to-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Avatar & Status */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 via-emerald-600 to-teal-700 p-0.5 shadow-xl shadow-brand-500/20 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <span className="text-3xl font-extrabold text-white font-sans tracking-tight">S</span>
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-400 border-2 border-slate-950 rounded-full animate-pulse" title="Online" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Suvadip Mondal</h2>
                  </div>
                  <p className="text-sm font-semibold text-brand-400 mt-0.5">Machine Learning & AI Developer</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Open for Research & Collaboration</span>
                  </div>
                </div>
              </div>

              {/* Bio & Focus */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Developer of FloraVision AI. Specialized in fine-tuning Convolutional Neural Networks (ResNet-34) on CUDA GPUs, computer vision preprocessing, and deploying real-time diagnostic systems for crop diseases.
              </p>

              {/* Focus tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  PyTorch ResNet-34
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  Computer Vision
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  Flask & React
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 text-xs font-mono text-brand-400">
                  99.89% Model Acc
                </span>
              </div>

              {/* Social Media & Quick Contact Bar (Compact Circular Icons) */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connect & Socials</span>
                  
                  {/* Copy Email Button Pill */}
                  <button
                    onClick={handleCopyEmail}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      copied 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' 
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                    title="Copy email address"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-400" />
                        <span>Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* GitHub */}
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-md group"
                    title="GitHub Profile (@suvo1119)"
                  >
                    <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-950/40 text-blue-400 hover:text-blue-300 flex items-center justify-center transition-all duration-200 shadow-md group"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>

                  {/* Direct Email */}
                  <a
                    href={`mailto:${emailAddress}`}
                    className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/40 text-brand-400 hover:text-brand-300 flex items-center justify-center transition-all duration-200 shadow-md group"
                    title="Send an Email"
                  >
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>

                  {/* Repository */}
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/40 text-purple-400 hover:text-purple-300 flex items-center justify-center transition-all duration-200 shadow-md group"
                    title="Plant-Disease-Detection Repository"
                  >
                    <Code2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Specs / SLA Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-brand-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Response Time</span>
                </div>
                <p className="text-sm font-semibold text-white">&lt; 24 Hours</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Quick turnaround on inquiries</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Model Status</span>
                </div>
                <p className="text-sm font-semibold text-white">99.89% Validated</p>
                <p className="text-[11px] text-slate-500 mt-0.5">38 Crop Disease Classes</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Message & Collaboration Form (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-2xl font-bold text-white">Send a Message</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Have a question, feedback, or collaborative research idea? Send a direct note.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>

              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Message Prepared!</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-white">{formData.name || 'there'}</span>! You can also launch your local mail client with this drafted inquiry directly to Suvadip.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleSendDirectEmail}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/25 hover:from-brand-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Mail Client</span>
                    </button>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: '', email: '', subject: 'AI Model & Research Inquiry', message: '' });
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Alex Rivera"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex.rivera@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject Category */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Topic / Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all cursor-pointer"
                    >
                      <option value="AI Model & Research Inquiry">AI Model & Research Inquiry</option>
                      <option value="Agricultural Deployment Collaboration">Agricultural Deployment Collaboration</option>
                      <option value="Dataset & Pathology Queries">Dataset & Pathology Queries</option>
                      <option value="Feature Suggestion or Bug Report">Feature Suggestion or Bug Report</option>
                      <option value="General Conversation">General Conversation</option>
                    </select>
                  </div>

                  {/* Message Body */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share details about your question, project, or collaboration proposal..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all resize-y"
                    />
                  </div>

                  {/* Submit Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      Replies sent directly to your email inbox.
                    </p>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleSendDirectEmail}
                        className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition-colors flex items-center gap-2"
                        title="Draft in your email client"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">Direct Mail</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-initial px-7 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/25 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Supplementary Info Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI Research Questions</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Interested in the PyTorch ResNet-34 training pipeline, EXIF data correction, or 39-class distribution? Feel free to ask technical questions!
                  </p>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Open Source & Star</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Give the project a star on GitHub, submit issues, or create pull requests to expand the disease database and remedy library.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
