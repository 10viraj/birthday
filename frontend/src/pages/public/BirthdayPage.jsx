import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, AlertCircle, Palette } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import WelcomeScreen from '../../components/birthday/WelcomeScreen';
import BirthdayHero from '../../components/birthday/BirthdayHero';
import BirthdayLetter from '../../components/birthday/BirthdayLetter';
import MemoryGallery from '../../components/birthday/MemoryGallery';
import Countdown from '../../components/birthday/Countdown';
import BirthdayCake from '../../components/birthday/BirthdayCake';
import MemoryTimeline from '../../components/birthday/MemoryTimeline';
import MusicPlayer from '../../components/birthday/MusicPlayer';
import SurpriseReveal from '../../components/birthday/SurpriseReveal';
import BirthdayWishForm from '../../components/birthday/BirthdayWishForm';
import CelebrationFooter from '../../components/birthday/CelebrationFooter';

export default function BirthdayPage() {
  const { slug } = useParams();
  const [birthday, setBirthday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('pink-purple');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const DEFAULT_BIRTHDAY_DATA = {
    name: "My Girl",
    age: 24,
    headline: "My girl was born 24 years ago today! ✨ Yes, it's YOU! A little surprise awaits... ✨",
    birthday_message: "Wishing the most wonderful person in the world the happiest 24th birthday! May your day be filled with endless smiles, sweet moments, and all the love you bring to everyone around you. 💗",
    letter_title: "A Special Letter For You 💌",
    letter_content: "Twenty-four years ago today, the universe received the sweetest gift. Every single day with you is a blessing, every smile from you brightens up my whole world. Thank you for being your amazing, beautiful, kind, and precious self. Here's to making infinite beautiful memories together today and always! Thank you for being in my life.",
    signature: "With all my love ❤️",
    theme: "pink-purple",
    photos: [
      { url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800", caption: "Sweet Birthday Magic ✨" },
      { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800", caption: "Celebration Smiles 🎉" },
      { url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800", caption: "Birthday Cake Bliss 🎂" }
    ],
    wishes: [
      { name: "Your #1 Fan", wish: "Happy 24th Birthday! May all your secret wishes come true today! 💖", created_at: new Date().toISOString() },
      { name: "Bestie", wish: "To the sweetest girl ever — keep shining bright! ✨", created_at: new Date().toISOString() }
    ],
    settings: {
      gallery_enabled: true,
      cake_animation_enabled: true,
      countdown_enabled: true,
      surprise_enabled: true,
      wishes_enabled: true,
      music_enabled: true
    }
  };

  useEffect(() => {
    fetchBirthdayData();
  }, [slug]);

  const fetchBirthdayData = async (password = null) => {
    setLoading(true);
    setError('');
    setPasswordError('');
    try {
      const res = await birthdayService.getPublicBySlug(slug, password);
      if (res.locked) {
        setLocked(true);
        setLoading(false);
        return;
      }

      setBirthday(res.data);
      if (res.data.theme) {
        setCurrentTheme(res.data.theme);
      }
      setLocked(false);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.locked) {
        setLocked(true);
      } else {
        // Fallback to default birthday data for standalone seamless experience
        setBirthday(DEFAULT_BIRTHDAY_DATA);
        setLocked(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    try {
      const res = await birthdayService.unlockPublicPage(slug, passwordInput);
      if (res.unlocked && res.data) {
        setBirthday(res.data);
        if (res.data.theme) setCurrentTheme(res.data.theme);
        setLocked(false);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Incorrect password. Try again.');
    }
  };

  const handleOpenSurprise = () => {
    setShowWelcome(false);
    setAutoPlayTriggered(true);
  };

  const handleWishAdded = (newWish) => {
    setBirthday(prev => ({
      ...prev,
      wishes: [newWish, ...(prev?.wishes || [])]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#160B28] text-white">
        <Sparkles className="animate-spin text-pink-400 mb-4" size={40} />
        <p className="text-purple-200 text-sm tracking-widest font-semibold uppercase animate-pulse">
          Loading Birthday Bliss...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#160B28] text-white">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center border border-pink-500/30">
          <AlertCircle className="text-pink-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-serif-display font-bold mb-2">Page Not Found</h2>
          <p className="text-purple-200/80 text-sm mb-6">{error}</p>
          <a href="/admin/login" className="px-6 py-2.5 rounded-full bg-pink-500 text-white font-semibold text-xs inline-block">
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#160B28] text-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-md w-full p-8 rounded-3xl text-center border border-pink-500/30 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4 border border-pink-500/40">
            <Lock size={32} />
          </div>

          <h2 className="text-2xl font-serif-display font-bold mb-2">Password Protected</h2>
          <p className="text-purple-200/80 text-xs mb-6">
            This birthday celebration page is private. Please enter the password to view the surprise.
          </p>

          {passwordError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              className="w-full p-3.5 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-center focus:outline-none focus:border-pink-400 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              Unlock Surprise ✨
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const settings = birthday?.settings || {};

  return (
    <div className={`min-h-screen relative theme-${currentTheme}`}>
      {/* 1. SEAL.EXE Retro Entrance Screen */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            birthdayName={birthday?.name}
            headline={birthday?.headline}
            onOpenSurprise={handleOpenSurprise}
          />
        )}
      </AnimatePresence>

      {/* Floating Theme Selector Button */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={() => setShowThemePicker(!showThemePicker)}
          className="p-3 rounded-full glass-card border border-pink-500/30 text-white hover:bg-white/10 shadow-lg cursor-pointer"
          title="Change Theme"
        >
          <Palette size={20} className="text-amber-300" />
        </button>

        {showThemePicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 glass-card p-3 rounded-2xl border border-pink-500/30 shadow-2xl space-y-1 text-left"
          >
            <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold px-2 block mb-1">
              Select Theme
            </span>
            {[
              { id: 'pink-purple', label: 'Pink & Purple' },
              { id: 'black-gold', label: 'Black & Gold' },
              { id: 'blue-silver', label: 'Blue & Silver' },
              { id: 'pastel-floral', label: 'Pastel Floral' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentTheme(t.id);
                  setShowThemePicker(false);
                }}
                className={`w-full text-xs text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${currentTheme === t.id ? 'bg-pink-500/30 text-white font-bold' : 'text-purple-200 hover:bg-white/5'}`}
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Main Birthday Content Sequence */}
      <main className="relative z-10 pb-12">
        {/* Screen 5: Thank You Page Execution Banner */}
        <section className="pt-16 pb-4 px-4 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border-2 border-pink-400/40 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="inline-flex px-4 py-1.5 rounded-full bg-pink-500/30 text-pink-200 text-xs font-mono font-bold tracking-widest uppercase mb-3 border border-pink-400/40">
              ✨ SCREEN 5: THANK YOU PAGE
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-display font-extrabold text-white mb-2">
              Thank You For Being In My Life! 💗
            </h2>
            <p className="text-purple-200/90 text-sm md:text-base max-w-xl mx-auto font-light">
              Your special birthday space is fully unlocked! Explore your heartfelt letter, photo memory gallery, cake blowing, and guestbook wishes below.
            </p>
          </motion.div>
        </section>

        {/* Step 1: Birthday Hero Welcome */}
        <BirthdayHero
          birthdayName={birthday?.name}
          profileImage={birthday?.profile_image}
          headline={birthday?.headline}
          message={birthday?.birthday_message}
        />

        {/* Step 2: Birthday Letter */}
        {birthday?.letter_content && (
          <BirthdayLetter
            title={birthday?.letter_title}
            content={birthday?.letter_content}
            signature={birthday?.signature}
            birthdayName={birthday?.name}
          />
        )}

        {/* Step 3: Photo Memory Gallery */}
        {(settings.gallery_enabled ?? true) && (
          <MemoryGallery photos={birthday?.photos || []} />
        )}

        {/* Step 4: Interactive Birthday Cake */}
        {(settings.cake_animation_enabled ?? true) && (
          <BirthdayCake birthdayName={birthday?.name} />
        )}

        {/* Step 5: Countdown Timer */}
        {(settings.countdown_enabled ?? true) && (
          <Countdown
            birthDate={birthday?.birth_date}
            birthdayName={birthday?.name}
          />
        )}

        {/* Step 6: Surprise Gift Reveal */}
        {(settings.surprise_enabled ?? true) && (
          <SurpriseReveal birthdayName={birthday?.name} />
        )}

        {/* Step 7: Visitor Wishes Guestbook */}
        {(settings.wishes_enabled ?? true) && (
          <BirthdayWishForm
            slug={birthday?.slug}
            wishes={birthday?.wishes || []}
            onWishAdded={handleWishAdded}
            birthdayName={birthday?.name}
          />
        )}

        {/* Step 8: Celebration Footer */}
        <CelebrationFooter
          birthdayName={birthday?.name}
          onReplay={() => {
            setShowWelcome(true);
            window.scrollTo({ top: 0 });
          }}
        />

        {/* Floating Background Music Player */}
        {(settings.music_enabled ?? true) && (
          <MusicPlayer
            musicPath={birthday?.music_path}
            isAutoPlayTriggered={autoPlayTriggered}
          />
        )}
      </main>
    </div>
  );
}
