import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, XCircle, ChevronRight, Gift, ShieldCheck, Sparkles, User, Mail, Phone, Loader2, PartyPopper } from 'lucide-react';
import { saveWaitlistEntry } from '../utils/db';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [waitlistData, setWaitlistData] = useState({ name: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveWaitlistEntry(waitlistData);
      setIsJoined(true);
    } catch (error: any) {
      console.error("Waitlist Join Error:", error);
      const msg = error?.message || "Check your internet connection.";
      alert(`Flash System Error: ${msg}\n\nHint for Owner: Visit the Admin Dashboard and run the SQL Repair script to enable public signups.`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Instant swaps, zero P2P risk, and global spending.
        </p>
      </motion.div>

      {/* Waitlist Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[2rem] p-8 md:p-12 mb-16 border-flash-yellow/20 relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {!isJoined ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 text-center">Join the Waitlist</h2>
                <p className="text-gray-500 text-center mb-10 text-sm uppercase tracking-widest font-bold">Secure your ₦5,000 launch credit</p>
                
                <form onSubmit={handleWaitlistSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      required
                      type="text"
                      placeholder="Your Name"
                      value={waitlistData.name}
                      onChange={e => setWaitlistData({...waitlistData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-flash-yellow/50 focus:ring-1 focus:ring-flash-yellow/20 transition-all font-medium placeholder:text-gray-700"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      required
                      type="email"
                      placeholder="Email Address"
                      value={waitlistData.email}
                      onChange={e => setWaitlistData({...waitlistData, email: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-flash-yellow/50 focus:ring-1 focus:ring-flash-yellow/20 transition-all font-medium placeholder:text-gray-700"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      required
                      type="tel"
                      placeholder="WhatsApp No."
                      value={waitlistData.whatsapp}
                      onChange={e => setWaitlistData({...waitlistData, whatsapp: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-flash-yellow/50 focus:ring-1 focus:ring-flash-yellow/20 transition-all font-medium placeholder:text-gray-700"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="md:col-span-3 bg-flash-yellow text-black font-black text-lg py-5 rounded-2xl shadow-xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-3 mt-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Request Early Access
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-flash-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-flash-yellow/20">
                  <PartyPopper className="w-10 h-10 text-flash-yellow" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">You're on the list!</h2>
                <p className="text-gray-400 max-w-sm mx-auto mb-8">
                  We've secured your spot. You'll be among the first to spend crypto with FLASH.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-white/5 px-4 py-2 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest border border-white/5">
                    Position: <span className="text-flash-yellow">#1,249</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest border border-white/5">
                    Bonus: <span className="text-flash-yellow">₦5,000</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Value Proposition Grid */}
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
        className="text-center mb-12"
      >
        <p className="text-gray-500 text-sm mb-6">Want to provide more feedback for extra rewards?</p>
        <button 
          onClick={onStart}
          className="inline-flex items-center gap-2 text-flash-yellow font-bold border-b-2 border-flash-yellow/20 hover:border-flash-yellow pb-1 transition-all"
        >
          Take the deep-dive survey
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      <p className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        Waitlist capacity: <span className="text-flash-yellow">1,249</span> / 5,000 slots
      </p>
    </div>
  );
};

export default Welcome;