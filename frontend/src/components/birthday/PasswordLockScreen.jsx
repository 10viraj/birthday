import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, KeyRound, Sparkles, Heart, AlertCircle, Delete, Check, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PasswordLockScreen({ birthdayName = "My Love", requiredPassword = "2509", onUnlock }) {
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlockSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputPassword.trim()) return;

    if (inputPassword.trim() === requiredPassword.trim()) {
      setError('');
      setIsUnlocking(true);

      // Trigger celebratory confetti burst on unlock
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });

      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setError('Incorrect secret passcode 🗝️ Please try again!');
      setInputPassword('');
    }
  };

  const handleDigitClick = (digit) => {
    if (inputPassword.length < 10) {
      setInputPassword((prev) => prev + digit);
      if (error) setError('');
    }
  };

  const handleDelete = () => {
    setInputPassword((prev) => prev.slice(0, -1));
    if (error) setError('');
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#160B28] text-white p-4 overflow-y-auto">
      {/* Ambient Radial Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FF3FA4]/20 via-[#A83CFF]/25 to-[#FFD166]/20 blur-3xl" />
        
        {/* Floating Decorative Flowers & Hearts */}
        <div className="absolute top-12 left-12 text-pink-400/30 animate-float">
          <Heart size={36} fill="currentColor" />
        </div>
        <div className="absolute bottom-16 right-16 text-purple-400/30 animate-sway">
          <Flower2 size={44} />
        </div>
        <div className="absolute top-1/4 right-20 text-amber-300/30 animate-pulse">
          <Sparkles size={32} />
        </div>
        <div className="absolute bottom-1/4 left-16 text-pink-300/30 animate-float">
          <Flower2 size={38} />
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 glass-card max-w-sm sm:max-w-md w-full p-6 sm:p-8 rounded-3xl border border-pink-500/30 text-center shadow-2xl backdrop-blur-xl my-auto"
      >
        {/* Animated Lock Icon with Glowing Ring */}
        <motion.div
          animate={isUnlocking ? { scale: [1, 1.3, 0.9], rotate: [0, -15, 15, 0] } : { y: [-4, 4, -4] }}
          transition={{ duration: isUnlocking ? 0.6 : 3, repeat: isUnlocking ? 0 : Infinity }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FF3FA4] via-[#A83CFF] to-[#FFD166] p-0.5 mx-auto mb-4 sm:mb-5 shadow-xl flex items-center justify-center glow-pink"
        >
          <div className="w-full h-full rounded-full bg-[#160B28] flex items-center justify-center text-pink-400">
            {isUnlocking ? <Unlock size={32} className="text-amber-300 animate-bounce" /> : <Lock size={30} className="text-pink-400" />}
          </div>
        </motion.div>

        {/* Top Passcode Protected Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-semibold text-xs tracking-wider uppercase mb-3 border border-pink-400/30">
          <KeyRound size={13} className="text-amber-300" />
          <span>Passcode Protected</span>
          <Sparkles size={12} className="text-pink-300" />
        </div>

        <h2 className="text-xl sm:text-2xl font-serif-display font-extrabold text-white mb-1.5 leading-snug">
          A Special Surprise Is Waiting For You ❤️
        </h2>

        <p className="text-purple-200/90 text-xs sm:text-sm mb-4 font-light">
          Please enter your secret passcode key to unlock your birthday surprise for {birthdayName}.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-2.5 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center justify-center gap-2"
          >
            <AlertCircle size={15} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleUnlockSubmit} className="space-y-4">
          {/* Passcode Display Input Box */}
          <div className="relative max-w-[280px] sm:max-w-[300px] mx-auto">
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter passcode..."
              maxLength={10}
              className="w-full py-3 px-4 rounded-2xl bg-[#24113F]/90 border-2 border-[#FF3FA4]/40 text-white text-center text-xl font-mono font-bold tracking-[0.3em] focus:outline-none focus:border-[#FF3FA4] transition-all placeholder:text-purple-300/40 placeholder:font-sans placeholder:text-xs placeholder:tracking-normal"
              autoFocus
            />
          </div>

          {/* Keypad Grid (1 2 3 / 4 5 6 / 7 8 9 / Backspace 0 Submit) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[260px] sm:max-w-[280px] mx-auto pt-1">
            {digits.map((digit) => (
              <motion.button
                key={digit}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleDigitClick(digit)}
                className="h-12 sm:h-14 rounded-2xl bg-white/10 hover:bg-[#FF3FA4]/25 border border-white/15 hover:border-[#FF3FA4]/60 text-white text-xl font-bold font-mono shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm active:bg-[#FF3FA4]/40"
              >
                {digit}
              </motion.button>
            ))}

            {/* Row 4: Backspace, 0, Submit */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleDelete}
              title="Delete digit"
              className="h-12 sm:h-14 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/20 hover:border-rose-400/50 text-rose-300 shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            >
              <Delete size={20} />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDigitClick('0')}
              className="h-12 sm:h-14 rounded-2xl bg-white/10 hover:bg-[#FF3FA4]/25 border border-white/15 hover:border-[#FF3FA4]/60 text-white text-xl font-bold font-mono shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm active:bg-[#FF3FA4]/40"
            >
              0
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleUnlockSubmit}
              title="Unlock"
              className="h-12 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#FF3FA4] via-[#A83CFF] to-[#FFD166] hover:brightness-110 border border-white/30 text-white font-bold shadow-lg flex items-center justify-center transition-all cursor-pointer"
            >
              <Check size={24} strokeWidth={3} />
            </motion.button>
          </div>

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF3FA4] via-[#A83CFF] to-[#FFD166] text-white font-bold text-sm sm:text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/20 flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles size={18} className="text-amber-200" />
            <span>{isUnlocking ? "Unlocking Magic..." : "Unlock Birthday Surprise 🔑"}</span>
          </button>
        </form>

        <p className="mt-4 text-[11px] text-purple-300/60 flex items-center justify-center gap-1">
          <Heart size={12} className="text-pink-400 fill-pink-400" />
          <span>Created with love for your special day</span>
        </p>
      </motion.div>
    </div>
  );
}
