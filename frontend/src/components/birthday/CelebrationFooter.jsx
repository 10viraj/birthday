import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Copy, Check, RotateCcw, ArrowUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CelebrationFooter({ birthdayName, onReplay }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${birthdayName}! 🎉`,
          text: `Check out this special birthday celebration page for ${birthdayName}!`,
          url: url,
        });
        return;
      } catch (err) {
        // Fallback to copy if share canceled or unsupported
      }
    }

    // Copy fallback
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 }
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 px-4 max-w-4xl mx-auto text-center border-t border-pink-500/20 mt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 md:p-12 border border-pink-500/30 shadow-2xl relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-4 border border-pink-500/40"
        >
          <Sparkles size={32} />
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-serif-display font-extrabold text-white mb-3">
          Coming Soon... <span className="text-gradient-pink font-script">Until We Meet Again, {birthdayName}!</span> ✨
        </h2>

        <p className="text-purple-200/80 text-sm md:text-base max-w-md mx-auto mb-8 font-light">
          Counting down the days until we meet again and create even more beautiful memories together.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Replay The Surprise</span>
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-full bg-white/10 text-purple-100 font-medium text-sm border border-purple-400/30 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            <span>{copied ? 'Link Copied!' : 'Share Birthday Page'}</span>
          </button>

          <button
            onClick={triggerConfetti}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-bold text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            Confetti Blast 🎉
          </button>
        </div>

        <button
          onClick={scrollToTop}
          className="text-xs text-purple-300/70 hover:text-white flex items-center gap-1 mx-auto transition-colors cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp size={14} />
        </button>
      </motion.div>

      <div className="mt-8 text-xs text-purple-300/40">
        Created with ❤️ on <span className="text-pink-400 font-semibold">Viraj Somani</span>
      </div>
    </footer>
  );
}
