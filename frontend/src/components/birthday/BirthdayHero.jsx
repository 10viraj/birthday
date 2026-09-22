import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Crown } from 'lucide-react';

export default function BirthdayHero({ birthdayName, profileImage, headline, message }) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Glowing Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Profile Image with Glowing Halo Ring */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 via-amber-400 to-purple-500 blur-md opacity-75 animate-pulse" />
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            <img 
              src={profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"} 
              alt={birthdayName}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <motion.div 
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 right-2 bg-gradient-to-tr from-amber-400 to-amber-200 text-purple-950 p-2.5 rounded-full shadow-lg border border-amber-300"
          >
            <Crown size={22} />
          </motion.div>
        </motion.div>

        {/* Floating Typography */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-2 text-pink-300 text-sm md:text-base font-semibold uppercase tracking-[0.25em] mb-3"
        >
          <Sparkles size={18} className="text-amber-300" />
          <span>Celebrating The Wonderful</span>
          <Sparkles size={18} className="text-amber-300" />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-serif-display font-extrabold text-white tracking-wide mb-4 leading-tight"
        >
          Happy Birthday, <br className="hidden md:inline" />
          <span className="text-gradient-pink font-script text-6xl md:text-8xl block mt-2">{birthdayName}!</span>
        </motion.h1>

        {headline && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-amber-200 font-serif-display italic mb-6 max-w-2xl"
          >
            "{headline}"
          </motion.p>
        )}

        {message && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="glass-card max-w-2xl p-6 md:p-8 rounded-2xl border border-pink-500/20 text-purple-100 text-base md:text-lg leading-relaxed shadow-xl"
          >
            <p className="font-light">{message}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
