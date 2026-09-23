import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Sparkles, Heart, Lock } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';

// Import Birthday Experience Components
import PasswordLockScreen from '../../components/birthday/PasswordLockScreen';
import WelcomeScreen from '../../components/birthday/WelcomeScreen';
import Countdown from '../../components/birthday/Countdown';
import MemoryGallery from '../../components/birthday/MemoryGallery';
import BirthdayLetter from '../../components/birthday/BirthdayLetter';
import MusicPlayer from '../../components/birthday/MusicPlayer';
import FloatingParticlesCanvas from '../../components/birthday/FloatingParticlesCanvas';
import CustomizationModal from '../../components/birthday/CustomizationModal';
import CelebrationFooter from '../../components/birthday/CelebrationFooter';

export default function BirthdayPage() {
  const { slug } = useParams();
  const [birthday, setBirthday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 1 = Password, 2 = Letter, 3 = Memories
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('pink-purple');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const DEFAULT_BIRTHDAY_DATA = {
    name: "Kavita",
    password: "2509", // Passcode requested by user
    birth_date: "",
    headline: "Something Special Is Waiting For You...",
    subheadline: "A little surprise made with lots of love ❤️",
    letter_title: "Something Special Is Waiting For You… 💌",
    letter_content: `Happy Birthday, Kaviraj! ❤️🎂

Today is all about celebrating you — my best friend, my favorite person, and someone who makes life a little brighter just by being in it. ✨

I’m genuinely lucky to have a friend like you. Thank you for all the crazy conversations, endless laughs, unforgettable memories, random moments, and for always being there. Some of my favorite memories are the ones I’ve shared with you. 🥹❤️

No matter how much time passes or how life changes, I hope our friendship always stays the same — full of laughter, stupid jokes, honest conversations, and countless memories waiting to be made. 🫶

I hope this new year of your life brings you everything you deserve — happiness that never fades, success that makes you proud, people who truly value you, and countless reasons to smile. 🌸✨

Never stop being the amazing person you are. Keep smiling, keep shining, and keep being YOU. 💖

And remember… you’re not just my friend, you’re a part of some of the best chapters of my life. ❤️

Happy Birthday once again, Kaviiiii! 🎂🥳
Here’s to more adventures, more laughter, more secrets, and a lifetime of beautiful memories together.`,
    signature: "With infinite endless friendship❤️",
    theme: "pink-purple",
  };

  useEffect(() => {
    fetchBirthdayData();
  }, [slug]);

  const fetchBirthdayData = async () => {
    setLoading(false);
    try {
      if (slug) {
        const res = await birthdayService.getPublicBySlug(slug);
        if (res?.data) {
          setBirthday(res.data);
          if (res.data.theme) setCurrentTheme(res.data.theme);
          return;
        }
      }
    } catch (err) {
      // Fallback seamlessly to default birthday data
    }
    setBirthday(DEFAULT_BIRTHDAY_DATA);
  };

  const handlePasswordUnlocked = () => {
    setCurrentPage(2);
    setAutoPlayTriggered(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToMemories = () => {
    setCurrentPage(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCustomization = (updatedData) => {
    setBirthday((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#160B28] text-white">
        <Sparkles className="animate-spin text-pink-400 mb-4" size={40} />
        <p className="text-purple-200 text-sm tracking-widest font-semibold uppercase animate-pulse">
          Preparing Birthday Surprise Magic...
        </p>
      </div>
    );
  }

  const birthdayName = birthday?.name || "My Love";
  const requiredPasscode = birthday?.password || "2509";

  return (
    <div className={`min-h-screen relative theme-${currentTheme} bg-[#160B28] text-white flex flex-col justify-between`}>
      {/* 🔒 PAGE 1 — Password / Surprise Unlock Screen */}
      <AnimatePresence mode="wait">
        {currentPage === 1 && (
          <PasswordLockScreen
            birthdayName={birthdayName}
            requiredPassword={requiredPasscode}
            onUnlock={handlePasswordUnlocked}
          />
        )}
      </AnimatePresence>

      {/* Romantic Background Floating Hearts & Stars Canvas */}
      <FloatingParticlesCanvas />

      {/* Top Navigation & Controls Header (When Unlocked) */}
      {currentPage > 1 && (
        <header className="sticky top-0 z-40 bg-[#160B28]/85 backdrop-blur-xl border-b border-pink-500/20 px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Brand Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-pink-300">
              <Sparkles size={15} className="text-amber-300" />
              <span>Birthday Surprise ✨</span>
            </div>

            {/* Centered 3-Step Flow Status Pill Bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-purple-950/60 border border-pink-500/30 backdrop-blur-md mx-auto sm:mx-0">
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${currentPage === 2
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white shadow-md'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>Page 2: Letter 💌</span>
              </button>

              <span className="text-purple-400/40 text-xs">→</span>

              <button
                onClick={() => setCurrentPage(3)}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${currentPage === 3
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white shadow-md'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>Page 3: Memories 📸</span>
              </button>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-full glass-card border border-pink-400/30 text-white hover:bg-white/10 shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Lock Page with Passcode"
              >
                <Lock size={14} className="text-amber-300" />
                <span className="hidden sm:inline">Lock 🔒</span>
              </button>

              <button
                onClick={() => setShowCustomizer(true)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-full glass-card border border-pink-400/30 text-white hover:bg-white/10 shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Edit Birthday Details"
              >
                <Settings size={14} className="text-pink-300" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Pages Flow Render */}
      {currentPage > 1 && (
        <main className="relative z-10 flex-grow pb-16 pt-4">
          <AnimatePresence mode="wait">
            {/* 💌 PAGE 2 — Open the Letter */}
            {currentPage === 2 && (
              <motion.div
                key="page-2-letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <BirthdayLetter
                  title={birthday?.letter_title}
                  content={birthday?.letter_content}
                  signature={birthday?.signature}
                  birthdayName={birthdayName}
                  onContinueToMemories={handleContinueToMemories}
                />
              </motion.div>
            )}

            {/* 📸 PAGE 3 — Memories & Final Message */}
            {currentPage === 3 && (
              <motion.div
                key="page-3-memories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <MemoryGallery photos={birthday?.photos || []} slug={slug || 'kavita'} />

                {/* Footer */}
                <CelebrationFooter
                  birthdayName={birthdayName}
                  onReplay={() => {
                    setCurrentPage(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Background Birthday Music Player */}
      {currentPage > 1 && (
        <MusicPlayer
          musicPath={birthday?.music_path}
          isAutoPlayTriggered={autoPlayTriggered}
        />
      )}

      {/* Live Customization Modal */}
      <CustomizationModal
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        birthdayData={birthday}
        onSave={handleSaveCustomization}
      />
    </div>
  );
}
