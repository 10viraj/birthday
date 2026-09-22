import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar } from 'lucide-react';

export default function MemoryTimeline({ memories = [] }) {
  if (!memories || memories.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3 border border-pink-500/40">
          <Compass size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-white">
          Our Journey Together 💫
        </h2>
        <p className="text-purple-200/80 text-sm md:text-base mt-2">
          Milestones, shared adventures, and unforgettable chapters.
        </p>
      </div>

      <div className="relative border-l-2 border-pink-500/30 ml-4 md:ml-32 space-y-12 pl-6 md:pl-10">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id || index}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Timeline Circle Bullet */}
            <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 border-4 border-[#160B28] shadow-lg group-hover:scale-125 transition-transform" />

            {/* Date Tag on Desktop Left */}
            <div className="hidden md:block absolute -left-36 top-1 text-right w-24">
              <span className="text-xs font-semibold text-pink-300 tracking-wider uppercase block">
                {memory.memory_date}
              </span>
            </div>

            {/* Memory Card */}
            <div className="glass-card p-6 rounded-2xl border border-pink-500/20 shadow-xl transition-all duration-300 group-hover:border-pink-500/40">
              <span className="md:hidden text-xs text-pink-300 font-semibold tracking-wider uppercase flex items-center gap-1 mb-2">
                <Calendar size={12} />
                <span>{memory.memory_date}</span>
              </span>

              <h3 className="text-xl font-bold font-serif-display text-white mb-2 flex items-center gap-2">
                <span>{memory.title}</span>
              </h3>

              <p className="text-purple-200/90 text-sm leading-relaxed mb-4">
                {memory.description}
              </p>

              {memory.image_path && (
                <div className="rounded-xl overflow-hidden max-h-56 bg-purple-950 border border-white/10">
                  <img 
                    src={memory.image_path} 
                    alt={memory.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
