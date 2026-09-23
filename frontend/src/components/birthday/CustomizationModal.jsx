import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, Heart, Sparkles, User, Calendar, MessageSquare, Feather, Users } from 'lucide-react';

export default function CustomizationModal({ isOpen, onClose, birthdayData, onSave }) {
  const [name, setName] = useState(birthdayData?.name || 'Bestie');
  const [password, setPassword] = useState(birthdayData?.password || '2509');
  const [birthDate, setBirthDate] = useState(birthdayData?.birth_date || '');
  const [letterTitle, setLetterTitle] = useState(birthdayData?.letter_title || '');
  const [letterContent, setLetterContent] = useState(birthdayData?.letter_content || '');
  const [signature, setSignature] = useState(birthdayData?.signature || 'Your Best Friend Forever 🤝💛');

  const applyFriendshipPreset = () => {
    setName(name || 'Bestie');
    setLetterTitle('Happy Birthday to My Best Friend! 🎂💛');
    setLetterContent(`Happy Birthday to My Best Friend! 🎂💛

Today is all about celebrating YOU — the person who brings so much laughter, chaos, joy, and sunshine into my life.

Thank you for always being there through every thick and thin, every secret joke, and every crazy adventure.

May your year ahead be filled with endless smiles, successful dreams, fun trips, and unforgettable memories.

Keep smiling.
Keep shining.
Keep being your awesome self. ✨

Happy Birthday Bestie! 🎉💛`);
    setSignature('Your Best Friend Forever 🤝💛');
  };

  const applyRomanticPreset = () => {
    setLetterTitle(`Happy Birthday, ${name || 'My Love'} ❤️`);
    setLetterContent(`Happy Birthday, ${name || 'My Love'} ❤️

Today is not just another day.
It's a reminder of how special you are
and how much happiness you bring into
the lives of everyone around you.

May your life always be filled with
smiles, love, success and beautiful memories.

Keep smiling.
Keep shining.
Keep being YOU. ✨

Happy Birthday Once Again! 🎂❤️`);
    setSignature('With infinite endless friendship❤️');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      password,
      birth_date: birthDate,
      letter_title: letterTitle,
      letter_content: letterContent,
      signature,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card max-w-lg w-full p-8 rounded-3xl border border-pink-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Settings size={16} />
            <span>Customize Surprise</span>
          </div>

          <h3 className="text-2xl font-serif-display font-bold text-white mb-4">
            Customize Birthday Surprise ✨
          </h3>

          {/* Preset Buttons */}
          <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-1">
              Quick Theme Presets:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyFriendshipPreset}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Users size={14} />
                <span>Friendship / Bestie Theme 🤝</span>
              </button>

              <button
                type="button"
                onClick={applyRomanticPreset}
                className="flex-1 py-2 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Heart size={14} />
                <span>Romantic Theme ❤️</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1 flex items-center gap-1.5">
                <User size={13} /> Birthday Recipient Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kavita / Bestie"
                className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
                <span>🔑 Secret Lock Passcode</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. 2509"
                className="w-full p-3 rounded-xl bg-purple-950/70 border border-amber-400/40 text-amber-200 text-sm font-mono font-bold tracking-widest focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1 flex items-center gap-1.5">
                <Calendar size={13} /> Birthday Date (Optional)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1 flex items-center gap-1.5">
                <Feather size={13} /> Letter Heading
              </label>
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                placeholder="e.g. Happy Birthday to My Best Friend! 🎂💛"
                className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1 flex items-center gap-1.5">
                <MessageSquare size={13} /> Personal Birthday Message
              </label>
              <textarea
                rows={6}
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1 flex items-center gap-1.5">
                <Heart size={13} /> Signature
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="e.g. Your Best Friend Forever 🤝💛"
                className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Save size={16} />
              <span>Save & Update Surprise Page</span>
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
