import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, PartyPopper, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Countdown({ birthDate, birthdayName }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (!birthDate) return;

      const now = new Date();
      const target = new Date(birthDate);

      // Set target time to start of the birth date
      const currentYear = now.getFullYear();
      let birthdayThisYear = new Date(currentYear, target.getMonth(), target.getDate());

      // Check if birthday already passed this year, set target to next year unless it's today
      const isSameDay = now.getDate() === target.getDate() && now.getMonth() === target.getMonth();
      
      if (isSameDay) {
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

  const triggerCelebrationConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 border border-pink-500/20 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 text-pink-400 font-semibold tracking-wider text-xs uppercase mb-4">
          <Clock size={16} />
          <span>{isToday ? "Special Occasion" : "Countdown To The Big Day"}</span>
        </div>

        {isToday ? (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            className="py-6"
          >
            <div className="inline-flex p-4 rounded-full bg-amber-400/20 text-amber-300 mb-4 border border-amber-400/40">
              <PartyPopper size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif-display font-bold text-gradient-gold mb-2">
              🎉 Today is {birthdayName}'s Birthday! 🎉
            </h2>
            <p className="text-purple-200 text-sm max-w-md mx-auto mb-4">
              The waiting is over! Celebrate this wonderful day filled with happiness and joy.
            </p>
            <button
              onClick={triggerCelebrationConfetti}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-white font-medium text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              Pop Confetti Burst! 🎊
            </button>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-white mb-6">
              Time Until <span className="text-pink-400">{birthdayName}'s</span> Birthday
            </h2>

            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} className="glass-pill p-3 md:p-5 rounded-2xl flex flex-col items-center border border-pink-500/20">
                  <span className="text-2xl md:text-4xl font-bold font-serif-display text-gradient-pink">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs text-purple-300/70 uppercase tracking-widest mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
