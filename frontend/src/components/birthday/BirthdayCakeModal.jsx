import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdayCakeModal({ isOpen, onClose, birthdayName = "My Love" }) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
    setTimeout(() => {
      setWishMade(true);
    }, 1200);
  };

  const handleReset = () => {
    setCandlesBlown(false);
    setWishMade(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="glass-card max-w-xl w-full p-8 md:p-12 rounded-3xl border border-pink-500/40 text-center relative shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold tracking-wider text-xs uppercase mb-4 border border-pink-400/30">
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>Birthday Cake & Wish</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-serif-display font-extrabold text-white mb-2">
            Make A Birthday Wish 🎂
          </h3>
          <p className="text-purple-200/80 text-sm mb-6 font-light">
            Close your eyes, make a secret wish in your heart, and click to blow out the candles!
          </p>

          {/* Interactive 3D Cake SVG with Candles */}
          <div className="relative w-48 h-48 mx-auto my-6 flex flex-col items-center justify-end">
            {/* Candle Flames */}
            <div className="flex justify-center gap-6 mb-2">
              {[1, 2, 3].map((c) => (
                <div key={c} className="flex flex-col items-center">
                  {!candlesBlown ? (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], y: [0, -2, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: c * 0.2 }}
                      className="w-4 h-6 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_#FFD166]"
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -20 }}
                      className="w-2 h-4 rounded-full bg-gray-400/50 blur-xs"
                    />
                  )}
                  {/* Candle Stick */}
                  <div className="w-2.5 h-10 bg-gradient-to-b from-pink-300 to-purple-400 rounded-sm shadow-sm" />
                </div>
              ))}
            </div>

            {/* Cake Layers */}
            <div className="w-40 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-t-3xl shadow-xl border-t-4 border-amber-300 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-x-0 top-0 h-4 bg-white/40 rounded-b-xl" />
              <span className="text-xs font-bold text-white tracking-widest uppercase z-10 drop-shadow">
                HAPPY BIRTHDAY
              </span>
            </div>
            <div className="w-48 h-12 bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 rounded-b-2xl shadow-2xl border-t-2 border-pink-400/40" />
          </div>

          {!wishMade ? (
            <button
              onClick={handleBlowCandles}
              disabled={candlesBlown}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white font-bold text-base shadow-xl hover:scale-105 transition-all cursor-pointer border border-white/20"
            >
              {candlesBlown ? "Blowing Out Candles... ✨" : "Blow Out Candles 💨"}
            </button>
          ) : (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-pink-500/20 border border-pink-400/40 text-pink-200 text-sm md:text-base font-serif-display italic">
                "May your wish fly high to the stars and come true today and always! ✨❤️"
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-purple-200 cursor-pointer"
              >
                Relight Candles 🕯️
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
