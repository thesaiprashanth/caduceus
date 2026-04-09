import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, ArrowRight, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  handle: string;
  setHandle: (val: string) => void;
  isExtracting: boolean;
  handleExtract: (e: React.FormEvent) => void;
  hasData: boolean;
}

export default function LandingPage({ handle, setHandle, isExtracting, handleExtract, hasData }: LandingPageProps) {
  return (
    <>
      <section className="mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
        >
          The AI-First CRM for <br />
          <span className="gradient-text italic font-serif">Instagram Business</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50 text-lg max-w-2xl mx-auto mb-10"
        >
          Convert followers into customers. Caduceus uses Gemini AI to extract leads, analyze relationship quality, and automate your outreach strategy.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleExtract}
          className="max-w-xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-2">
            <div className="pl-4 text-white/40">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Enter Instagram handle (e.g. @nike)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-lg outline-none"
            />
            <button 
              disabled={isExtracting}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Extract"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>
      </section>

      <AnimatePresence mode="wait">
        {isExtracting && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-secondary rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Extracting Intelligence</h3>
              <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Scanning profile data...</p>
            </motion.div>
          </motion.div>
        )}

        {!hasData && !isExtracting && (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <BarChart3 className="w-10 h-10 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Data Extracted</h2>
            <p className="text-white/40 max-w-sm">Enter a business handle above to start analyzing performance and strategy.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
