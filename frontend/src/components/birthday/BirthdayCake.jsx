import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Heart, Mic, Wind, Cake as CakeIcon, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdayCake({ birthdayName }) {
  const [candles, setCandles] = useState([true, true, true, true, true]); // 5 candles lit
  const [wishMade, setWishMade] = useState(false);
  const [wishText, setWishText] = useState('');
  const [isMicListening, setIsMicListening] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [allBlownOut, setAllBlownOut] = useState(false);

  const toggleCandle = (index) => {
    const updated = [...candles];
    updated[index] = !updated[index];
    setCandles(updated);
    checkAllBlownOut(updated);
  };

  const blowOutAllCandles = () => {
    const extinguished = [false, false, false, false, false];
    setCandles(extinguished);
    triggerCelebration();
  };

  const relightCandles = () => {
    setCandles([true, true, true, true, true]);
    setAllBlownOut(false);
  };

  const checkAllBlownOut = (currentCandles) => {
    if (currentCandles.every(c => c === false)) {
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    setAllBlownOut(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Microphone blow detection fallback
  const startMicListener = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone is not supported in this browser. Please use the 'Blow Out' button!");
      return;
    }

    setIsMicListening(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let blowCount = 0;
        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;

          if (average > 45) { // Sound threshold for blowing
            blowCount++;
            if (blowCount > 3) {
              blowOutAllCandles();
              stream.getTracks().forEach(track => track.stop());
              setIsMicListening(false);
              return;
            }
          }
          if (stream.active) {
            requestAnimationFrame(checkVolume);
          }
        };
        checkVolume();
      })
      .catch(err => {
        setIsMicListening(false);
        alert("Microphone permission denied or unavailable. Please use the button instead.");
      });
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 md:p-12 border border-pink-500/30 shadow-2xl relative overflow-hidden"
      >
        <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-4 border border-pink-500/40">
          <CakeIcon size={32} />
        </div>

        <h2 className="text-3xl md:text-4xl font-serif-display font-bold text-white mb-2">
          Make a Wish & Blow Out The Candles! 🎂
        </h2>
        <p className="text-purple-200/80 text-sm md:text-base max-w-md mx-auto mb-8">
          Tap individual candles to extinguish them, or blow into your mic to make {birthdayName}'s wish come true!
        </p>

        {/* Animated Layered Cake Graphic */}
        <div className="relative w-72 h-64 mx-auto flex flex-col items-center justify-end mb-8">
          {/* Candles */}
          <div className="flex justify-between w-48 mb-1 z-20">
            {candles.map((isLit, idx) => (
              <div key={idx} className="relative flex flex-col items-center cursor-pointer" onClick={() => toggleCandle(idx)}>
                {/* Flame */}
                <AnimatePresence>
                  {isLit && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 0.9, 1.1], opacity: 1 }}
                      exit={{ scale: 0, opacity: 0, y: -10 }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute -top-7 text-amber-400 drop-shadow-[0_0_10px_#f59e0b]"
                    >
                      <Flame size={20} className="fill-amber-400 text-amber-500 animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Candle Stick */}
                <div className={`w-3.5 h-12 rounded-t-sm shadow-md transition-colors ${idx % 2 === 0 ? 'bg-gradient-to-b from-pink-300 to-pink-500' : 'bg-gradient-to-b from-amber-200 to-amber-400'}`}>
                  <div className="w-full h-2 bg-white/30 rounded-t-sm" />
                </div>
              </div>
            ))}
          </div>

          {/* Top Layer */}
          <div className="w-52 h-14 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-t-2xl shadow-lg relative border-t-4 border-pink-200 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 to-transparent" />
            {/* Icing Drips */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-around text-pink-200">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-6 h-4 bg-pink-200 rounded-b-full shadow-sm" />
              ))}
            </div>
          </div>

          {/* Middle Layer */}
          <div className="w-64 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-t-lg shadow-xl relative border-t-4 border-pink-400 flex items-center justify-center">
            <span className="text-xs tracking-widest text-amber-200 font-serif-display uppercase font-bold">
              Happy Birthday
            </span>
          </div>

          {/* Bottom Stand */}
          <div className="w-72 h-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-full shadow-2xl border-t border-amber-100" />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setWishModalOpen(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={18} className="text-amber-300" />
            <span>Make a Wish</span>
          </button>

          {!allBlownOut ? (
            <>
              <button
                onClick={blowOutAllCandles}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-white font-medium text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wind size={18} />
                <span>Blow Out Candles</span>
              </button>

              <button
                onClick={startMicListener}
                className={`px-5 py-3 rounded-full border border-pink-400/40 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${isMicListening ? 'bg-pink-500 text-white animate-pulse' : 'bg-white/5 text-purple-200 hover:bg-white/10'}`}
              >
                <Mic size={18} />
                <span>{isMicListening ? 'Listening for blow...' : 'Use Microphone'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={relightCandles}
              className="px-6 py-3 rounded-full bg-white/10 text-purple-200 font-medium text-sm border border-purple-400/30 hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={18} />
              <span>Relight Candles</span>
            </button>
          )}
        </div>

        {/* Wish Confetti Banner */}
        {allBlownOut && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-400/20 to-pink-500/20 border border-amber-300/40 text-amber-200 text-sm max-w-md mx-auto"
          >
            🎉 All candles blown out! May all your secret wishes come true today! ✨
          </motion.div>
        )}
      </motion.div>

      {/* Make a Wish Modal */}
      <AnimatePresence>
        {wishModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6 rounded-3xl border border-pink-500/40 text-left shadow-2xl relative"
            >
              <h3 className="text-2xl font-serif-display font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="text-amber-300" size={24} />
                <span>Make a Birthday Wish</span>
              </h3>
              <p className="text-purple-200/80 text-xs mb-4">
                Close your eyes, think of your biggest dream for this year, and type it below.
              </p>

              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="I wish for..."
                rows={4}
                className="w-full p-4 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setWishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-purple-200 text-xs hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setWishMade(true);
                    setWishModalOpen(false);
                    blowOutAllCandles();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold shadow-lg hover:opacity-90 cursor-pointer"
                >
                  Seal My Wish ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
