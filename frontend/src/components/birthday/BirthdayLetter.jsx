import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Heart, RotateCcw, Feather } from 'lucide-react';

export default function BirthdayLetter({ title, content, signature, birthdayName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fullText = content || `On your special day, I wanted to create something truly magical to celebrate you.\n\nFrom our late-night conversations to all the unforgettable memories we've built, every single moment with you is a treasure.\n\nMay this new chapter bring you endless joy, peace, and dreams fulfilled. Keep shining bright like you always do!`;

  useEffect(() => {
    if (isOpen) {
      setDisplayedContent('');
      setIsTyping(true);
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedContent(prev => prev + fullText.charAt(index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isOpen, fullText]);

  const replayTyping = () => {
    setDisplayedContent('');
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedContent(prev => prev + fullText.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);
  };

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3 border border-pink-500/40">
          <Feather size={28} />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif-display font-bold text-white">
          A Personal Birthday Letter 💌
        </h2>
        <p className="text-purple-200/80 text-sm mt-1">
          A heartfelt message written especially for {birthdayName}
        </p>
      </div>

      {!isOpen ? (
        /* Sealed Envelope View */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card max-w-md mx-auto p-10 rounded-3xl border border-pink-500/30 flex flex-col items-center shadow-2xl relative group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {/* Envelope SVG Graphic */}
          <div className="relative w-48 h-36 bg-gradient-to-tr from-purple-900 to-pink-900 rounded-2xl border-2 border-pink-400/40 flex items-center justify-center shadow-xl mb-6 transform group-hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/20 to-transparent rounded-2xl" />
            
            {/* Wax Seal */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center shadow-lg border-2 border-amber-300 z-10">
              <Heart className="fill-white text-pink-600" size={24} />
            </div>
          </div>

          <h3 className="text-xl font-serif-display font-bold text-white mb-2">
            For {birthdayName}
          </h3>
          <p className="text-xs text-purple-200/70 mb-6">
            Sealed with love & warm wishes
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium text-sm shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <MailOpen size={18} />
            <span>Open Your Letter</span>
          </motion.button>
        </motion.div>
      ) : (
        /* Open Letter Paper View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-xl mx-auto p-8 md:p-12 rounded-2xl bg-[#FFFDF7] text-gray-800 shadow-2xl border-8 border-pink-200/50 text-left font-serif-display leading-relaxed"
        >
          {/* Vintage Stamp Top Right */}
          <div className="absolute top-6 right-6 w-14 h-16 border-2 border-dashed border-pink-400/60 p-1 flex flex-col items-center justify-center bg-pink-50/50">
            <Heart size={16} className="text-pink-500 fill-pink-500" />
            <span className="text-[8px] font-bold tracking-widest uppercase text-pink-700 mt-1">Bliss</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-purple-950 mb-6 italic border-b border-pink-200 pb-3">
            {title || `Dearest ${birthdayName},`}
          </h3>

          <div className="text-base md:text-lg text-gray-700 font-normal whitespace-pre-line min-h-[160px] font-sans">
            {displayedContent}
            {isTyping && <span className="inline-block w-2 h-5 bg-pink-500 ml-1 animate-pulse" />}
          </div>

          {signature && (
            <div className="mt-8 pt-4 border-t border-pink-200 text-right">
              <p className="font-script text-2xl md:text-3xl text-pink-700 font-bold">
                {signature}
              </p>
            </div>
          )}

          <div className="mt-8 pt-4 flex justify-between items-center text-xs text-gray-400 font-sans">
            <button
              onClick={replayTyping}
              className="flex items-center gap-1.5 text-pink-600 hover:text-pink-800 font-medium cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Replay Typing</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Close Letter
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
