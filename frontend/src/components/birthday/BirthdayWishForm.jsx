import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, User, Heart } from 'lucide-react';
import { wishService } from '../../services/wishService';

export default function BirthdayWishForm({ slug, wishes = [], onWishAdded, birthdayName }) {
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !message.trim()) {
      setErrorMsg('Please enter your name and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await wishService.submitWish(slug, {
        visitor_name: visitorName,
        message: message,
      });

      setSuccessMsg('Your birthday wish has been sent with love! ❤️');
      setVisitorName('');
      setMessage('');
      if (onWishAdded && res.data) {
        onWishAdded(res.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit wish. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3 border border-pink-500/40">
          <MessageSquare size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-white">
          Guestbook & Birthday Wishes 💌
        </h2>
        <p className="text-purple-200/80 text-sm md:text-base mt-2">
          Leave a sweet message for {birthdayName} to brighten their day!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Wish Form */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 rounded-3xl border border-pink-500/30 shadow-xl"
          >
            <h3 className="text-xl font-bold font-serif-display text-white mb-4">
              Send a Birthday Wish
            </h3>

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Sarah M."
                  required
                  className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                  Birthday Wish / Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Write your warmest birthday wish for ${birthdayName}...`}
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Sending...' : 'Post Wish'}</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Wishes List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xl font-bold font-serif-display text-white mb-4 text-left">
            Messages from Loved Ones ({wishes.length})
          </h3>

          {wishes.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center text-purple-200/60 text-sm">
              No wishes posted yet. Be the first to leave a message! 🎉
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {wishes.map((wish, idx) => (
                <motion.div
                  key={wish.id || idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-5 rounded-2xl border border-pink-500/20 shadow-md text-left relative"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {(wish.visitor_name || wish.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{wish.visitor_name || wish.name || 'Anonymous'}</h4>
                      <span className="text-[10px] text-purple-300/60">{wish.created_at ? new Date(wish.created_at).toLocaleDateString() : 'Just now'}</span>
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm leading-relaxed font-light pl-11">
                    "{wish.message || wish.wish}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
