import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, Star, Trophy, Cake } from 'lucide-react';
import confetti from 'canvas-confetti';
import BirthdayCakeModal from './BirthdayCakeModal';

export default function SurpriseReveal({ birthdayName = "My Love" }) {
  const [isOpened, setIsOpened] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);

  const openGiftBox = () => {
    setIsOpened(true);
    // Multi-stage celebratory confetti explosion
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 400);
  };

  return (
    <section id="final-surprise" className="py-24 px-4 max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card rounded-3xl p-8 md:p-16 border border-pink-500/40 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-gradient-to-b from-[#1c0d36]/90 via-[#281347]/90 to-[#160B28]/95"
      >
        {/* Ambient Dark Romantic Glowing Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold tracking-wider text-xs uppercase mb-6 border border-amber-400/30">
          <Gift size={16} className="text-amber-300" />
          <span>PAGE 6 — Final Surprise</span>
          <Sparkles size={14} className="text-pink-300" />
        </div>

        {!isOpened ? (
          /* PAGE 6 Initial View */
          <div className="py-6">
            {/* Heading: "Wait... There's One More Surprise 👀" */}
            <motion.h2
              initial={{ scale: 0.95 }}
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif-display font-extrabold text-white mb-4 drop-shadow-lg"
            >
              Wait... There's One More Surprise 👀
            </motion.h2>

            <p className="text-purple-200/90 text-sm md:text-base max-w-md mx-auto mb-10 font-light">
              A special romantic gift wrapped With infinite endless friendshipjust for {birthdayName}!
            </p>

            {/* Sealed 3D Animated Gift Box */}
            <motion.div
              className="flex flex-col items-center cursor-pointer group py-4"
              onClick={openGiftBox}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-56 h-56 mb-8">
                {/* Glowing Aura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

                {/* Gift Box Body */}
                <div className="relative w-full h-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl border-2 border-pink-300/40 flex items-center justify-center">
                  {/* Ribbon Lines */}
                  <div className="absolute inset-y-0 w-12 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 shadow-md" />
                  <div className="absolute inset-x-0 h-12 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 shadow-md" />

                  {/* Ribbon Bow */}
                  <div className="absolute -top-7 inset-x-0 flex justify-center z-10">
                    <div className="w-20 h-14 bg-amber-400 rounded-full border-2 border-amber-200 shadow-2xl flex items-center justify-center transform -rotate-12">
                      <Heart className="fill-pink-600 text-pink-600 animate-pulse" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button: "Open Your Gift 🎁" */}
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white font-bold text-lg md:text-xl shadow-2xl flex items-center gap-3 cursor-pointer border border-white/20 hover:scale-105 transition-all">
                <Sparkles className="animate-spin text-amber-200" size={22} />
                <span>Open Your Gift 🎁</span>
              </button>
            </motion.div>
          </div>
        ) : (
          /* Revealed Gift State */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="py-6 max-w-2xl mx-auto text-center"
          >
            {/* Animated Balloons & Heart particles overlay */}
            <div className="relative p-8 md:p-12 rounded-3xl border-2 border-amber-300/50 bg-gradient-to-b from-purple-950/90 to-pink-950/90 shadow-2xl">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-purple-950 shadow-xl font-bold">
                <Trophy size={32} />
              </div>

              {/* Reveal Title: "🎉 HAPPY BIRTHDAY [NAME] 🎉" */}
              <h3 className="text-3xl md:text-5xl font-serif-display font-extrabold text-gradient-gold mt-6 mb-4 drop-shadow">
                🎉 HAPPY BIRTHDAY {birthdayName.toUpperCase()} 🎉
              </h3>

              {/* Large High-Quality Birthday Image */}
              <div className="rounded-2xl overflow-hidden border-2 border-pink-400/40 max-h-80 shadow-2xl mb-8 relative">
                <img
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop"
                  alt="Birthday Celebration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Reveal Subtext: "May all your dreams come true. You deserve all the happiness in the world. ❤️" */}
              <p className="text-xl md:text-2xl text-purple-100 font-light leading-relaxed mb-8 drop-shadow font-serif-display">
                May all your dreams come true. You deserve all the happiness in the world. ❤️
              </p>

              {/* Button: Large "Make a Wish 🎂" */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowWishModal(true)}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-lg md:text-xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-all cursor-pointer border border-white/20"
                >
                  <Cake size={24} className="text-amber-200" />
                  <span>Make a Wish 🎂</span>
                </button>

                <button
                  onClick={() => setIsOpened(false)}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-xs text-purple-200 cursor-pointer transition-all"
                >
                  Rewrap Gift Box 🎁
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Birthday Cake Wish Modal */}
      <BirthdayCakeModal
        isOpen={showWishModal}
        onClose={() => setShowWishModal(false)}
        birthdayName={birthdayName}
      />
    </section>
  );
}
