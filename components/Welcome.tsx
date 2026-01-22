import React from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, XCircle, ChevronRight, Gift, ShieldCheck, Sparkles } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-24 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-flash-yellow/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card mb-6 neon-glow"
        >
          <Zap className="w-10 h-10 text-flash-yellow" fill="currentColor" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          FLASH<span className="text-flash-yellow">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
          The elite protocol for spending <span className="text-white font-bold underline decoration-flash-yellow underline-offset-4">Crypto in Naira</span>. 
          Help us build the endgame.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-8 border-red-500/10 hover:border-red-500/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-red-400 font-bold text-sm tracking-widest uppercase">The Problem</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Risky P2P bank account freezes",
              "Exploitative exchange fees (3-5%+)",
              "Slow confirmation times (30-60 mins)",
              "Complexity: 3+ apps just to pay for lunch"
            ].map((item, i) => (
              <li key={i} className="flex items-center text-gray-400 group">
                <span className="mr-3 text-red-500/50 group-hover:text-red-500 transition-colors">✕</span> {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-8 border-flash-yellow/10 hover:border-flash-yellow/30 transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <ShieldCheck className="w-32 h-32 text-flash-yellow" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-flash-yellow/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-flash-yellow" />
            </div>
            <h3 className="text-flash-yellow font-bold text-sm tracking-widest uppercase">The Flash Protocol</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Instant Swap: 1-1.5% fixed fee",
              "Unified Wallet: Crypto & NGN",
              "Global Virtual Card: Spend anywhere",
              "Hyper-safe P2P: No scam risk"
            ].map((item, i) => (
              <li key={i} className="flex items-center text-gray-200 group">
                <Sparkles className="w-4 h-4 mr-3 text-flash-yellow group-hover:scale-125 transition-transform" /> {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-3xl p-8 mb-12 text-center border-flash-yellow/20"
      >
        <h3 className="text-white font-bold text-lg mb-6 flex items-center justify-center gap-2">
          <Gift className="w-5 h-5 text-flash-yellow" /> Exclusive Founding Rewards
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "₦5,000", sub: "Launch Bonus" },
            { label: "VIP Fees", sub: "Lifetime access" },
            { label: "Beta Card", sub: "Priority shipping" },
            { label: "Support", sub: "24/7 Priority" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="block text-flash-yellow font-black text-xl">{item.label}</span>
              <span className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">{item.sub}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button 
        whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255, 215, 0, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="w-full bg-flash-yellow text-black font-black text-xl py-5 rounded-2xl shadow-2xl flex items-center justify-center group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center">
          Secure Early Access
          <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
      </motion.button>

      <p className="text-center mt-6 text-gray-600 text-sm font-medium">
        Current waitlist depth: <span className="text-flash-yellow">1,248</span>/5,000 slots filled.
      </p>
    </div>
  );
};

export default Welcome;