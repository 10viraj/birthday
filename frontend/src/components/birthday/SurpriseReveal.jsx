import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SurpriseReveal({ birthdayName }) {
  const [isOpened, setIsOpened] = useState(false);

  const openGiftBox = () => {
    setIsOpened(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 md:p-12 border border-pink-500/30 shadow-2xl relative overflow-hidden"
      >
        <div className="inline-flex p-3 rounded-full bg-amber-400/20 text-amber-300 mb-3 border border-amber-400/40">
          <Gift size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-white mb-2">
          The Grand Surprise Reveal 🎁
        </h2>
        <p className="text-purple-200/80 text-sm md:text-base max-w-md mx-auto mb-8">
          A special mystery gift box wrapped with love for {birthdayName}!
        </p>

        {!isOpened ? (
          /* Sealed Gift Box */
          <motion.div 
            className="flex flex-col items-center cursor-pointer group py-6"
            onClick={openGiftBox}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated 3D Gift Box SVG */}
            <motion.div 
              animate={{ y: [-6, 6, -6], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-48 h-48 mb-6"
            >
              {/* Glowing aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Gift Box Base */}
              <div className="relative w-full h-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl border-2 border-pink-300/40 flex items-center justify-center">
                {/* Vertical Ribbon */}
                <div className="absolute inset-y-0 w-10 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 shadow-md" />
                {/* Horizontal Ribbon */}
                <div className="absolute inset-x-0 h-10 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 shadow-md" />

                {/* Bow on Top */}
                <div className="absolute -top-6 inset-x-0 flex justify-center z-10">
                  <div className="w-16 h-12 bg-amber-400 rounded-full border-2 border-amber-200 shadow-xl flex items-center justify-center transform -rotate-12">
                    <Heart className="fill-pink-600 text-pink-600" size={20} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white font-bold text-base shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="animate-spin text-amber-200" size={20} />
              <span>Click to Unwrap Gift Box!</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Opened Reveal Content */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="py-6 max-w-xl mx-auto"
          >
            <div className="glass-pill p-8 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-b from-purple-950/80 to-pink-950/80 shadow-2xl relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 p-3 rounded-full bg-amber-400 text-purple-950 shadow-lg font-bold">
                <Trophy size={28} />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif-display font-bold text-gradient-gold mt-4 mb-3">
                Your Secret Birthday Surprise! 🌟
              </h3>

              <p className="text-purple-100 text-base md:text-lg leading-relaxed mb-6 font-light">
                "You are cordially invited to a special birthday weekend trip filled with your favorite food, stargazing, and endless celebrations!"
              </p>

              <div className="rounded-2xl overflow-hidden border border-pink-400/30 max-h-64 shadow-xl mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80" 
                  alt="Surprise"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={() => setIsOpened(false)}
                className="px-5 py-2 rounded-full bg-white/10 text-xs text-purple-200 hover:bg-white/20 transition-all cursor-pointer"
              >
                Rewrap Gift Box 🎁
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
