import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, PartyPopper, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Countdown({ birthDate, birthdayName = "My Special One" }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Default to birthday today or user's target birthDate
      const targetDate = birthDate ? new Date(birthDate) : new Date();

      const currentYear = now.getFullYear();
      let birthdayThisYear = new Date(currentYear, targetDate.getMonth(), targetDate.getDate());

      const isSameDay = now.getDate() === targetDate.getDate() && now.getMonth() === targetDate.getMonth();

      if (isSameDay || !birthDate) {
        setIsToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      if (birthdayThisYear < now && !isSameDay) {
        birthdayThisYear.setFullYear(currentYear + 1);
      }

      const diff = birthdayThisYear - now;

      if (diff <= 0) {
        setIsToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsToday(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  useEffect(() => {
    // Trigger celebration confetti when loaded or when isToday is true
    if (isToday) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 }
      });
    }
  }, [isToday]);

  const popConfettiBurst = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <section id="countdown-section" className="py-20 px-4 max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-card rounded-3xl p-8 md:p-14 border border-pink-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        {/* Glow ambient background circles */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold tracking-wider text-xs uppercase mb-6 border border-pink-400/30">
          <Clock size={16} className="text-pink-400" />
          <span>{isToday ? "The Magical Moment Is Here" : "Counting Down The Seconds"}</span>
          <Sparkles size={14} className="text-amber-300" />
        </div>

        {/* Page 2 Heading: "Your Special Day Is Almost Here 🎂" or "IT'S YOUR BIRTHDAY! 🎉" */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif-display font-extrabold text-white mb-4"
        >
          {isToday ? (
            <span className="text-gradient-gold drop-shadow">IT'S YOUR BIRTHDAY! 🎉</span>
          ) : (
            <span>Your Special Day Is Almost Here 🎂</span>
          )}
        </motion.h2>

        <p className="text-purple-200/90 text-sm md:text-base max-w-xl mx-auto mb-10 font-light">
          {isToday
            ? `Happy Birthday ${birthdayName}! Today is all about celebrating you, your smile, and all the joy you bring into the world. ❤️`
            : `Every single second brings us closer to celebrating the wonderful, irreplaceable ${birthdayName}!`}
        </p>

        {isToday ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="py-4"
          >
            <div className="inline-flex p-5 rounded-full bg-gradient-to-tr from-amber-400/30 via-pink-500/30 to-purple-500/30 text-amber-300 mb-6 border-2 border-amber-300/40 shadow-xl animate-bounce">
              <PartyPopper size={48} />
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={popConfettiBurst}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-base shadow-xl hover:scale-105 transition-all cursor-pointer border border-white/20"
              >
                Pop Confetti Burst! 🎊
              </button>
            </div>
          </motion.div>
        ) : (
          /* Animated Countdown Boxes: Days | Hours | Minutes | Seconds */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-pill p-5 md:p-6 rounded-2xl flex flex-col items-center border border-pink-400/30 shadow-lg hover:border-pink-400/60 transition-all group"
              >
                <span className="text-3xl md:text-5xl font-extrabold font-serif-display text-gradient-pink group-hover:scale-110 transition-transform duration-300">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm text-purple-200/80 font-medium uppercase tracking-widest mt-2">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
