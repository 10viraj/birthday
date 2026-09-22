import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ChevronLeft, ChevronRight, X, Calendar, Heart } from 'lucide-react';

export default function MemoryGallery({ photos = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevPhoto = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  };

  const nextPhoto = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-10 border border-pink-500/20">
          <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-xl font-serif-display font-bold text-white mb-2">Memory Gallery</h3>
          <p className="text-purple-200/70 text-sm">No photos have been added to the gallery yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <div className="mb-10 flex flex-col items-center">
        <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3 border border-pink-500/40">
          <ImageIcon size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-white">
          Cherished Moments & Memories 📸
        </h2>
        <p className="text-purple-200/80 text-sm md:text-base mt-2 max-w-md">
          A snapshot collection of unforgettable times and happy smiles.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            onClick={() => openLightbox(index)}
            className="group relative rounded-2xl overflow-hidden glass-card border border-pink-500/20 shadow-xl cursor-pointer"
          >
            <div className="aspect-square overflow-hidden bg-purple-950">
              <img
                src={photo.image_path}
                alt={photo.caption || 'Memory Photo'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-left">
              <p className="text-white font-semibold text-sm line-clamp-1">{photo.caption}</p>
              {photo.taken_at && (
                <span className="text-[10px] text-pink-300 flex items-center gap-1 mt-0.5">
                  <Calendar size={10} />
                  <span>{photo.taken_at}</span>
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
            >
              <X size={24} />
            </button>

            <button
              onClick={prevPhoto}
              className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
            >
              <ChevronRight size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full flex flex-col items-center max-h-[90vh]"
            >
              <div className="relative max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src={photos[selectedIndex].image_path}
                  alt={photos[selectedIndex].caption || 'Photo'}
                  className="max-h-[70vh] w-auto object-contain rounded-2xl"
                />
              </div>

              <div className="mt-4 text-center max-w-xl px-4">
                <h4 className="text-xl font-bold font-serif-display text-white">
                  {photos[selectedIndex].caption}
                </h4>
                {photos[selectedIndex].description && (
                  <p className="text-purple-200/80 text-sm mt-1">
                    {photos[selectedIndex].description}
                  </p>
                )}
                {photos[selectedIndex].taken_at && (
                  <span className="text-xs text-pink-400 mt-2 inline-block">
                    Taken on {photos[selectedIndex].taken_at}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
