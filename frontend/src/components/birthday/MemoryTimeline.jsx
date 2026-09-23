import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, Heart, Sparkles, Star } from 'lucide-react';

const DEFAULT_TIMELINE_STORY = [
  {
    id: 1,
    title: "Where It All Started",
    date: "The Magical Beginning",
    description: "The very first day our paths crossed. A moment that quietly changed everything and brought so much light and laughter into life.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Beautiful Moments",
    date: "Endless Smiles & Journeys",
    description: "Countless late-night chats, shared coffee cups, secret jokes, and adventures that made every single day sweeter and brighter.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    icon: Heart,
  },
  {
    id: 3,
    title: "Unforgettable Memories",
    date: "Treasured Forever",
    description: "Every silly face, every warm embrace, and every sunset watched together. Memories that remain locked in the heart forever.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    icon: Star,
  },
  {
    id: 4,
    title: "Today — Your Special Day 🎂",
    date: "Happy Birthday!",
    description: "Today we celebrate YOU! Your warmth, your kind soul, and the priceless joy you bring to everyone lucky enough to know you.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    icon: Calendar,
  },
];

export default function MemoryTimeline({ memories = [], birthdayName = "My Girl" }) {
  const storyList = (memories && memories.length > 0)
    ? memories.map((m, idx) => ({
        id: m.id || idx,
        title: m.title || DEFAULT_TIMELINE_STORY[idx % DEFAULT_TIMELINE_STORY.length].title,
        date: m.memory_date || DEFAULT_TIMELINE_STORY[idx % DEFAULT_TIMELINE_STORY.length].date,
        description: m.description || DEFAULT_TIMELINE_STORY[idx % DEFAULT_TIMELINE_STORY.length].description,
        image: m.image_path || DEFAULT_TIMELINE_STORY[idx % DEFAULT_TIMELINE_STORY.length].image,
        icon: DEFAULT_TIMELINE_STORY[idx % DEFAULT_TIMELINE_STORY.length].icon,
      }))
    : DEFAULT_TIMELINE_STORY;

  return (
    <section id="birthday-story" className="py-20 px-4 max-w-5xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold tracking-wider text-xs uppercase mb-3 border border-pink-400/30">
          <Compass size={14} className="text-pink-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>PAGE 4 — Birthday Story</span>
          <Sparkles size={14} className="text-amber-300" />
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif-display font-extrabold text-white mb-3">
          Our Special Birthday Story 📖
        </h2>
        <p className="text-purple-200/90 text-sm md:text-base max-w-lg mx-auto font-light">
          An animated timeline walking through the milestones and unforgettable chapters of our journey together.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-pink-500/40 ml-4 md:ml-36 space-y-12 pl-6 md:pl-12">
        {storyList.map((item, index) => {
          const IconComponent = item.icon || Heart;
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Glowing Bullet Icon */}
              <div className="absolute -left-[37px] md:-left-[61px] top-3 w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 border-2 border-[#160B28] shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <IconComponent size={14} className="text-white" />
              </div>

              {/* Date Tag on Desktop Left */}
              <div className="hidden md:block absolute -left-44 top-4 text-right w-32">
                <span className="text-xs font-bold text-pink-300 tracking-wider uppercase block">
                  {item.date}
                </span>
              </div>

              {/* Memory Card with side photo */}
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-pink-500/30 shadow-2xl transition-all duration-300 group-hover:border-pink-400/60 backdrop-blur-xl">
                <span className="md:hidden text-xs text-pink-300 font-bold tracking-wider uppercase flex items-center gap-1.5 mb-3">
                  <Calendar size={13} />
                  <span>{item.date}</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Text Content */}
                  <div className="md:col-span-7">
                    <h3 className="text-2xl md:text-3xl font-bold font-serif-display text-white mb-3 flex items-center gap-2">
                      <span>{item.title}</span>
                    </h3>

                    <p className="text-purple-200/90 text-sm md:text-base leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  {/* Photo Beside Timeline Item */}
                  <div className="md:col-span-5">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-purple-950/50 border border-white/15 shadow-lg group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={item.image ? (item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/${item.image}`) : DEFAULT_TIMELINE_STORY[index % DEFAULT_TIMELINE_STORY.length].image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_TIMELINE_STORY[index % DEFAULT_TIMELINE_STORY.length].image;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
