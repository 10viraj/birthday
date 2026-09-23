import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Heart, RotateCcw, Feather, Sparkles, ArrowRight, FastForward, Maximize2, Minimize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdayLetter({ title, content, signature, birthdayName = "My Love", onContinueToMemories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Default heartfelt letter body
  const defaultLetterBody = `Happy Birthday, ${birthdayName}! ❤️🎂

Today is all about celebrating you — my best friend, my favorite person, and someone who makes life a little brighter just by being in it. ✨

I’m genuinely lucky to have a friend like you. Thank you for all the crazy conversations, endless laughs, unforgettable memories, random moments, and for always being there. Some of my favorite memories are the ones I’ve shared with you. 🥹❤️

No matter how much time passes or how life changes, I hope our friendship always stays the same — full of laughter, stupid jokes, honest conversations, and countless memories waiting to be made. 🫶

I hope this new year of your life brings you everything you deserve — happiness that never fades, success that makes you proud, people who truly value you, and countless reasons to smile. 🌸✨

Never stop being the amazing person you are. Keep smiling, keep shining, and keep being YOU. 💖

And remember… you’re not just my friend, you’re a part of some of the best chapters of my life. ❤️

Happy Birthday once again, Kaviiiii! 🎂🥳
Here’s to more adventures, more laughter, more secrets, and a lifetime of beautiful memories together.`;

  const letterText = content || defaultLetterBody;

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpening(true);

    // Confetti burst on envelope open
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsOpen(true);
      setIsEnvelopeOpening(false);
    }, 600);
  };

  useEffect(() => {
    if (!isOpen) return;

    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;

    const timer = setInterval(() => {
      charIndex++;
      setDisplayedText(letterText.slice(0, charIndex));
      if (charIndex >= letterText.length) {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [isOpen, letterText]);

  const showFullImmediately = () => {
    setDisplayedText(letterText);
    setIsTyping(false);
  };

  const replayTyping = () => {
    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;
    const timer = setInterval(() => {
      charIndex++;
      setDisplayedText(letterText.slice(0, charIndex));
      if (charIndex >= letterText.length) {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 18);
  };

  return (
    <section id="birthday-letter" className="py-4 md:py-8 px-2 sm:px-4 max-w-5xl mx-auto text-center relative z-10 min-h-[calc(100vh-90px)] flex flex-col justify-center items-center">
      {/* Section Header */}
      <div className="mb-6 md:mb-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF3FA4]/20 text-pink-300 font-semibold tracking-wider text-xs uppercase mb-2 border border-pink-400/30 glow-pink">
          <Feather size={13} className="text-pink-400" />
          <span>PAGE 2 — Heartfelt Birthday Letter 💌</span>
          <Sparkles size={13} className="text-amber-300" />
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-display font-extrabold text-white mb-1.5 leading-tight drop-shadow-md">
          {title || "Something Special Is Waiting For You… 💌"}
        </h2>
        <p className="text-purple-200/90 text-xs sm:text-sm font-light max-w-md">
          A personal surprise written with infinite friendship & warmth for {birthdayName}.
        </p>
      </div>

      {!isOpen ? (
        /* Sealed Vintage Envelope Container */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card max-w-md sm:max-w-lg w-full mx-auto p-5 sm:p-8 md:p-10 rounded-3xl border border-pink-500/30 flex flex-col items-center shadow-2xl relative backdrop-blur-xl group overflow-hidden"
        >
          {/* Glowing Background Radial */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-[#FF3FA4]/30 via-[#A83CFF]/30 to-[#FFD166]/20 blur-3xl pointer-events-none" />

          {/* Interactive Envelope Graphic */}
          <motion.div
            animate={isEnvelopeOpening ? { scale: 1.08, rotate: [0, -3, 3, 0] } : { y: [-3, 3, -3] }}
            transition={{ duration: isEnvelopeOpening ? 0.6 : 4, repeat: isEnvelopeOpening ? 0 : Infinity }}
            onClick={handleOpenEnvelope}
            className="relative w-56 h-36 sm:w-64 sm:h-40 bg-gradient-to-tr from-[#24113F] via-[#351A5B] to-[#FF3FA4]/30 rounded-3xl border-2 border-pink-400/60 flex items-center justify-center shadow-2xl mb-5 cursor-pointer group-hover:border-pink-300 transition-all duration-300"
          >
            {/* Inner Gold Border Accent */}
            <div className="absolute inset-2 border border-amber-300/30 rounded-2xl pointer-events-none" />

            {/* Envelope Triangular Top Flap Graphic */}
            <motion.div
              animate={isEnvelopeOpening ? { rotateX: 180, opacity: 0.5 } : { rotateX: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-purple-900/60 via-pink-600/20 to-transparent rounded-t-3xl border-b border-pink-400/30 shadow-md origin-top"
            />

            {/* Glowing Wax Seal Button */}
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#FF3FA4] via-rose-500 to-[#FFD166] flex items-center justify-center shadow-2xl border-2 border-amber-200 z-10 glow-pink cursor-pointer"
            >
              <Heart className="fill-white text-white drop-shadow-md" size={26} />
            </motion.div>

            {/* Floating Hearts from Envelope */}
            <div className="absolute -top-3 right-5 text-pink-400 animate-float"><Heart size={16} fill="currentColor" /></div>
            <div className="absolute bottom-3 left-5 text-amber-300 animate-pulse"><Sparkles size={14} /></div>
          </motion.div>

          <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white mb-1">
            For {birthdayName} ❤️
          </h3>
          <p className="text-xs text-purple-200/80 mb-5 font-light">
            Sealed with love & warm wishes. Tap the envelope to unseal!
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenEnvelope}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#FF3FA4] via-[#A83CFF] to-[#FFD166] text-white font-bold text-sm sm:text-base shadow-xl flex items-center gap-2 cursor-pointer border border-white/20 glow-pink"
          >
            <MailOpen size={18} />
            <span>Open Your Letter 💌</span>
          </motion.button>
        </motion.div>
      ) : (
        /* Opened Vintage Stationery Letter Paper View */
        <AnimatePresence>
          <div className={isFullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto" : "w-full"}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full mx-auto text-left overflow-hidden bg-[#FAF6EE] text-gray-900 shadow-2xl border-4 border-amber-300/80 ${
                isFullscreen
                  ? 'max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-12 md:p-16 my-auto'
                  : 'max-w-5xl rounded-3xl p-6 sm:p-10 md:p-14'
              }`}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(220, 190, 140, 0.08) 1px, transparent 1px)`,
                backgroundSize: '100% 2.4rem'
              }}
            >
              {/* Gold Decorative Corner Borders */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/80 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/80 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/80 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/80 rounded-br-lg pointer-events-none" />

              {/* Inner Ornamental Frame */}
              <div className="absolute inset-4 border border-amber-400/30 rounded-2xl pointer-events-none" />

              {/* Ultra-subtle Heart Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-pink-900">
                <Heart size={380} fill="currentColor" />
              </div>

              {/* Top Stationery Header Bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-300/40 relative z-10 gap-2 flex-wrap">
                {/* Left Ribbon Badge & Full Screen Toggle */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/90 text-pink-800 font-bold text-xs uppercase tracking-wider border border-pink-300/60 shadow-sm">
                    <Sparkles size={13} className="text-amber-600" />
                    <span>Personal Letter 💌</span>
                  </div>

                  {/* Full Screen Toggle Button */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="flex items-center gap-1.5 text-xs font-bold text-pink-800 hover:text-pink-950 bg-pink-100/90 hover:bg-pink-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer border border-pink-300/70 shadow-sm"
                    title="Toggle Fullscreen View"
                  >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen ⛶'}</span>
                  </button>
                </div>

                {/* Right Postage Stamp Graphic */}
                <div className="w-16 h-20 border-2 border-dashed border-pink-400/80 p-1.5 flex flex-col items-center justify-center bg-pink-50/90 rounded-lg shadow-sm">
                  <Heart size={20} className="text-pink-600 fill-pink-500" />
                  <span className="text-[9px] font-bold tracking-widest uppercase text-pink-800 mt-1">BESTIE</span>
                </div>
              </div>

              {/* Handwritten Letter Body */}
              <div className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-relaxed font-semibold whitespace-pre-line min-h-[300px] relative z-10 tracking-wide px-2 sm:px-4 py-1">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-2.5 h-7 bg-pink-600 ml-1.5 align-middle animate-pulse rounded-full" />
                )}
              </div>

              {/* Signature Section */}
              {signature && (
                <div className="mt-8 pt-4 border-t border-amber-300/60 text-right relative z-10">
                  <p className="font-script text-3xl sm:text-4xl text-pink-700 font-bold">
                    {signature}
                  </p>
                </div>
              )}

              {/* Footer Controls */}
              <div className="mt-10 pt-6 border-t border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  {isTyping ? (
                    <button
                      onClick={showFullImmediately}
                      className="flex items-center gap-1.5 text-xs font-bold text-pink-700 hover:text-pink-900 bg-pink-100 hover:bg-pink-200 px-3.5 py-2 rounded-full transition-all cursor-pointer border border-pink-300 shadow-sm"
                    >
                      <FastForward size={14} />
                      <span>Read Full Immediately</span>
                    </button>
                  ) : (
                    <button
                      onClick={replayTyping}
                      className="flex items-center gap-1.5 text-xs font-semibold text-pink-700 hover:text-pink-900 bg-pink-100/60 hover:bg-pink-100 px-3.5 py-2 rounded-full transition-all cursor-pointer border border-pink-300/50"
                    >
                      <RotateCcw size={14} />
                      <span>Replay Typing Effect</span>
                    </button>
                  )}
                </div>

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isFullscreen) setIsFullscreen(false);
                    if (onContinueToMemories) onContinueToMemories();
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF3FA4] via-[#A83CFF] to-[#FFD166] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-white/30 glow-pink"
                >
                  <span>Continue to Memories</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
