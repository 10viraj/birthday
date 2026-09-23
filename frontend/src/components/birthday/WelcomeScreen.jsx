import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift, Music, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomeScreen({ birthdayName = "My Love", onStartSurprise }) {
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    // Generate floating balloons with random positions & colors
    const balloonColors = ['#FF6FAE', '#C7A7FF', '#FFD166', '#FF9EAA', '#F472B6', '#38BDF8'];
    const initialBalloons = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // percentage
      size: Math.random() * 20 + 35, // px width
      color: balloonColors[i % balloonColors.length],
      duration: Math.random() * 6 + 7, // seconds
      delay: Math.random() * 4,
    }));
    setBalloons(initialBalloons);
  }, []);

  const handleStartClick = () => {
    // Trigger celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onStartSurprise) {
      onStartSurprise();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#160B28] text-white">
      {/* Full-screen birthday background image with romantic gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1920&auto=format&fit=crop"
          alt="Birthday background"
          className="w-full h-full object-cover opacity-25 filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#160B28]/80 via-[#160B28]/90 to-[#160B28]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/15 via-purple-600/10 to-transparent" />
      </div>

      {/* Floating Animated Balloons */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: '115vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              x: [`${b.x}%`, `${b.x + (b.id % 2 === 0 ? 4 : -4)}%`, `${b.x}%`],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: 'easeInOut',
            }}
            style={{ left: `${b.x}%`, width: `${b.size}px` }}
            className="absolute flex flex-col items-center"
          >
            {/* Balloon Body */}
            <div
              className="w-full aspect-[4/5] rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-lg relative flex items-center justify-center"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 8px 25px ${b.color}66, inset -4px -4px 10px rgba(0,0,0,0.3), inset 6px 6px 12px rgba(255,255,255,0.4)`,
              }}
            >
              <Heart className="text-white/40 fill-white/20 w-1/2 h-1/2" />
            </div>
            {/* Balloon Knot & String */}
            <div className="w-1.5 h-2 rounded-sm" style={{ backgroundColor: b.color }} />
            <div className="w-[1px] h-12 bg-white/30" />
          </motion.div>
        ))}
      </div>

      {/* Floating Sparkles & Hearts */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
            }}
            style={{
              top: `${15 + (i * 10)}%`,
              left: `${10 + ((i * 12) % 80)}%`,
            }}
            className="absolute text-pink-400/80"
          >
            {i % 2 === 0 ? <Sparkles size={20 + (i * 2)} /> : <Heart size={18 + (i * 2)} className="fill-pink-400/40 text-pink-400" />}
          </motion.div>
        ))}
      </div>

      {/* Main Content Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center"
      >
        {/* Floating Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill border border-pink-400/30 text-pink-300 text-xs md:text-sm font-medium tracking-wider uppercase mb-8 shadow-lg backdrop-blur-md"
        >
          <Sparkles className="animate-spin text-amber-300" size={16} />
          <span>Made Especially For {birthdayName}</span>
          <Heart className="text-pink-400 fill-pink-400" size={14} />
        </motion.div>

        {/* PAGE 1 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif-display font-extrabold leading-tight text-white mb-6 drop-shadow-2xl"
        >
          Something Special Is Waiting For You...
        </motion.h1>

        {/* PAGE 1 Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-2xl text-purple-200/90 font-light max-w-xl mx-auto mb-10 leading-relaxed drop-shadow"
        >
          A little surprise made with lots of love ❤️
        </motion.p>

        {/* Animated "Start Surprise 🎁" Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="relative inline-block"
        >
          {/* Glowing pulse ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 blur-lg opacity-70 animate-pulse-glow" />

          <button
            onClick={handleStartClick}
            className="relative px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-amber-400 text-white font-bold text-lg md:text-xl shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <Gift className="animate-bounce text-amber-200" size={26} />
            <span>Start Surprise 🎁</span>
          </button>
        </motion.div>

        {/* Music Hint Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-xs text-purple-300/60 flex items-center justify-center gap-1.5"
        >
          <Volume2 size={14} className="text-pink-400" />
          <span>Turn on sound for the best romantic experience</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
