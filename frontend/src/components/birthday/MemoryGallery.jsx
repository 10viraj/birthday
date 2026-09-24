import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ChevronLeft, ChevronRight, X, Heart, Plus, Sparkles, Upload, Trash2, CheckCircle2, Loader2, Grid, ArrowLeft } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';

const DEFAULT_POLAROID_PHOTOS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    caption: "Our Beautiful Memories ❤️",
    rotation: -3,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop",
    caption: "That Smile 😊",
    rotation: 2,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
    caption: "One of My Favorite Moments",
    rotation: -2,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    caption: "Forever a Special Memory",
    rotation: 3,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    caption: "Sweeter Than Cake 🎂",
    rotation: -4,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    caption: "Pure Happiness 💖",
    rotation: 2,
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    caption: "Unforgettable Moments ✨",
    rotation: -1,
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    caption: "Endless Laughter 😄",
    rotation: 4,
  },
];

export const getFullImageUrl = (url, fallbackIdx = 0) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_POLAROID_PHOTOS[fallbackIdx % DEFAULT_POLAROID_PHOTOS.length].url;
  }
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) {
    return cleanUrl;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  if (cleanUrl.startsWith('/')) {
    return apiBase ? `${apiBase}${cleanUrl}` : cleanUrl;
  }
  return apiBase ? `${apiBase}/${cleanUrl}` : `/${cleanUrl}`;
};

export default function MemoryGallery({ photos = [], slug = 'kavita' }) {
  const [activePhotos, setActivePhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16);

  // Multi-upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [newPhotoUrlsText, setNewPhotoUrlsText] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percentage: 0 });

  const storageKey = `birthday_custom_photos_${slug || 'default'}`;

  const handleResetGallery = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Could not clear local storage", e);
    }
    setActivePhotos(DEFAULT_POLAROID_PHOTOS);
  };

  // Sync photos from database props + localStorage
  useEffect(() => {
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {
      console.warn("Could not read local storage photos", e);
    }

    const dbList = (photos && photos.length > 0)
      ? photos.map((p, idx) => ({
        id: p.id || `db-${idx}`,
        url: p.image_path || p.url || DEFAULT_POLAROID_PHOTOS[idx % DEFAULT_POLAROID_PHOTOS.length].url,
        caption: p.caption || DEFAULT_POLAROID_PHOTOS[idx % DEFAULT_POLAROID_PHOTOS.length].caption,
        rotation: (idx % 2 === 0 ? 1 : -1) * ((idx * 2) % 5 + 1),
      }))
      : [];

    const mergedMap = new Map();

    // 1. Add locally saved custom photos
    savedLocal.forEach((item) => {
      if (item && item.url) mergedMap.set(item.url, item);
    });

    // 2. Add database photos
    dbList.forEach((item) => {
      if (item && item.url) mergedMap.set(item.url, item);
    });

    let combined = Array.from(mergedMap.values());

    // 3. Fallback to default photos if empty or fewer than 4
    if (combined.length === 0) {
      combined = DEFAULT_POLAROID_PHOTOS;
    } else if (combined.length < 4) {
      const needed = DEFAULT_POLAROID_PHOTOS.filter(d => !mergedMap.has(d.url));
      combined = [...combined, ...needed.slice(0, 4 - combined.length)];
    }

    setActivePhotos(combined);
  }, [photos, slug]);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevPhoto = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + activePhotos.length) % activePhotos.length);
    }
  };

  const nextPhoto = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % activePhotos.length);
    }
  };

  const handleDeletePhoto = async (photoToDelete, e) => {
    if (e) e.stopPropagation();
    if (!photoToDelete) return;

    const targetUrl = photoToDelete.url;
    const targetId = photoToDelete.id;

    // 1. Update UI activePhotos state immediately
    const updated = activePhotos.filter((p) => p.url !== targetUrl && p.id !== targetId);
    setActivePhotos(updated);

    if (selectedIndex !== null) {
      if (updated.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex((prevIndex) => (prevIndex >= updated.length ? Math.max(0, updated.length - 1) : prevIndex));
      }
    }

    // 2. Remove from localStorage
    try {
      const savedLocal = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filteredLocal = savedLocal.filter((p) => p.url !== targetUrl && p.id !== targetId);
      localStorage.setItem(storageKey, JSON.stringify(filteredLocal));
    } catch (err) {
      console.warn("LocalStorage delete note:", err);
    }

    // 3. Delete from backend database if photo ID exists
    if (targetId && !String(targetId).startsWith('db-') && !isNaN(targetId)) {
      try {
        await birthdayService.deletePublicPhoto(slug || 'kavita', targetId);
      } catch (err) {
        console.warn("Backend photo delete notice:", err);
      }
    }
  };

  // Multiple File Selection Handler
  const handleMultipleFilesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      }));
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      const target = prev[index];
      if (target && target.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAllSelectedFiles = () => {
    filePreviews.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  // Fast client-side image compression to prevent server payload timeouts & UI freeze
  const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      if (!file || file.size < 300000) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ file, dataUrl: e.target.result });
        reader.onerror = () => resolve({ file, dataUrl: null });
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve({ file: compressedFile, dataUrl });
              } else {
                resolve({ file, dataUrl: e.target.result });
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve({ file, dataUrl: e.target.result });
        img.src = e.target.result;
      };
      reader.onerror = () => resolve({ file, dataUrl: null });
      reader.readAsDataURL(file);
    });
  };

  // Batch Submit Handler for Multiple Photos (Up to 200+)
  const handleBatchAddPhotos = async (e) => {
    e.preventDefault();

    // Collect URLs pasted in textarea if any
    const pastedUrls = newPhotoUrlsText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith('http') || u.startsWith('data:')));

    const totalToUpload = selectedFiles.length + pastedUrls.length;
    if (totalToUpload === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: totalToUpload, percentage: 0 });

    const newEntries = [];
    const captionToUse = newPhotoCaption.trim() || 'Memories ❤️';

    // 1. Process Pasted URLs immediately
    if (pastedUrls.length > 0) {
      pastedUrls.forEach((urlStr, idx) => {
        newEntries.push({
          id: Date.now() + idx,
          url: urlStr,
          caption: captionToUse,
          rotation: (Math.random() - 0.5) * 6,
        });
      });

      try {
        await birthdayService.addPublicPhotosBatch(slug || 'kavita', {
          image_paths: pastedUrls,
          caption: captionToUse,
        });
      } catch (err) {
        console.warn("Pasted URLs batch upload notice:", err);
      }
    }

    // 2. Process File Uploads in small batches of 2 photos per API call with compression
    const BATCH_SIZE = 2;
    let completedCount = pastedUrls.length;

    for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
      const chunkFiles = selectedFiles.slice(i, i + BATCH_SIZE);
      const formData = new FormData();
      const fallbackUrls = [];

      for (let j = 0; j < chunkFiles.length; j++) {
        const fileObj = chunkFiles[j];
        const { file: compressedFile, dataUrl } = await compressImageFile(fileObj);
        formData.append('photos[]', compressedFile || fileObj);
        if (dataUrl) fallbackUrls.push(dataUrl);
      }

      formData.append('caption', captionToUse);

      try {
        const response = await birthdayService.addPublicPhotosBatch(slug || 'kavita', formData);
        if (response?.data && Array.isArray(response.data)) {
          response.data.forEach((p, pIdx) => {
            newEntries.push({
              id: p.id || Date.now() + i + pIdx,
              url: p.image_path || p.url,
              caption: p.caption || captionToUse,
              rotation: (Math.random() - 0.5) * 6,
            });
          });
        } else {
          fallbackUrls.forEach((dUrl, dIdx) => {
            newEntries.push({
              id: Date.now() + i + dIdx,
              url: dUrl,
              caption: captionToUse,
              rotation: (Math.random() - 0.5) * 6,
            });
          });
        }
      } catch (err) {
        console.warn(`Batch upload error for index ${i}`, err);
        fallbackUrls.forEach((dUrl, dIdx) => {
          newEntries.push({
            id: Date.now() + i + dIdx,
            url: dUrl,
            caption: captionToUse,
            rotation: (Math.random() - 0.5) * 6,
          });
        });
      }

      completedCount += chunkFiles.length;
      setUploadProgress({
        current: completedCount,
        total: totalToUpload,
        percentage: Math.round((completedCount / totalToUpload) * 100),
      });
    }

    // 3. Update active UI state
    setActivePhotos((prev) => [...newEntries, ...prev]);

    // 4. Update localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...newEntries, ...existing]));
    } catch (err) {
      console.error("Local storage batch save error:", err);
    }

    // Reset Form State
    clearAllSelectedFiles();
    setNewPhotoUrlsText('');
    setNewPhotoCaption('');
    setIsUploading(false);
    setShowUploadModal(false);
  };

  return (
    <section id="photo-memories" className="py-20 px-4 max-w-7xl mx-auto text-center relative z-10">
      {/* Section Header */}
      <div className="mb-14 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold tracking-wider text-xs uppercase mb-3 border border-pink-400/30">
          <Heart size={14} className="fill-pink-400 text-pink-400" />
          <span>PAGE 3 — Photo Memories ({activePhotos.length} Photos)</span>
          <Sparkles size={14} className="text-amber-300" />
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif-display font-extrabold text-white mb-3">
          Our Beautiful Photo Memories 📸
        </h2>
        <p className="text-purple-200/90 text-sm md:text-base max-w-xl mx-auto font-light">
          A timeless collection of polaroid snapshots capturing our sweetest moments, smiles, and laughter.
        </p>

        {/* Action Buttons: Add Personal Photos & Reset */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-600/30 to-amber-500/30 hover:from-pink-500/50 hover:to-amber-500/50 text-pink-200 border border-pink-400/50 font-bold text-xs md:text-sm flex items-center gap-2.5 shadow-xl transition-all cursor-pointer glow-pink"
          >
            <Plus size={18} className="text-pink-400" />
            <span>Add Multiple Personal Photos (Up to 200 Pics) 📷</span>
          </button>

          <button
            onClick={handleResetGallery}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/40 font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            title="Reset gallery photos to default"
          >
            <Trash2 size={16} />
            <span>Reset Photo Gallery</span>
          </button>
        </div>
      </div>

      {/* Polaroid Grid Layout with Pagination / Visible Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 px-4">
        {activePhotos.slice(0, visibleCount).map((photo, index) => (
          <motion.div
            key={photo.id || index}
            initial={{ opacity: 0, y: 30, rotate: photo.rotation }}
            whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
            transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
            viewport={{ once: true }}
            onClick={() => openLightbox(index)}
            className="polaroid-card group cursor-pointer"
          >
            {/* Heart Badge Top Center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-pink-100 border border-pink-300 shadow flex items-center justify-center z-10 text-pink-500">
              <Heart size={14} className="fill-pink-500" />
            </div>

            {/* Photo Thumbnail */}
            <div className="w-full aspect-[4/5] rounded overflow-hidden bg-purple-950/20 mb-3 relative">
              <img
                src={getFullImageUrl(photo.url, index)}
                alt={photo.caption || "Memory"}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_POLAROID_PHOTOS[index % DEFAULT_POLAROID_PHOTOS.length].url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <ImageIcon size={14} /> View Full
                </span>
              </div>
            </div>

            {/* Handwritten Caption */}
            <h3 className="font-handwriting text-2xl md:text-3xl text-gray-800 font-bold leading-tight">
              {photo.caption}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Load More Button if more than visibleCount photos */}
      {activePhotos.length > visibleCount && (
        <div className="mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold text-sm flex items-center gap-2 mx-auto transition-all cursor-pointer shadow-lg"
          >
            <Grid size={16} />
            <span>Load More Photos ({activePhotos.length - visibleCount} Remaining) 📸</span>
          </button>
        </div>
      )}

      {/* Final Memory Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-16 max-w-2xl mx-auto p-8 md:p-12 rounded-3xl glass-card border border-[#FF3FA4]/40 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-[#FF3FA4]/20 via-[#A83CFF]/20 to-[#FFD166]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF3FA4] to-[#FFD166] mx-auto flex items-center justify-center shadow-xl glow-pink"
          >
            <Heart size={32} className="fill-white text-white" />
          </motion.div>

          <h3 className="text-2xl md:text-4xl font-serif-display font-extrabold text-white leading-tight">
            “Every memory with you is a moment worth keeping forever. ❤️”
          </h3>

          <p className="text-purple-200/90 text-sm font-light max-w-md mx-auto pt-2">
            Thank you for bringing endless warmth, joy, and light into every single day! ✨
          </p>

          <div className="pt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-500/20 text-pink-300 font-semibold text-xs border border-pink-400/40">
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>Happy Birthday Once Again! 🎂✨</span>
          </div>
        </div>
      </motion.div>

      {/* Multiple Photos Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-pink-500/40 shadow-2xl relative my-8 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => !isUploading && setShowUploadModal(false)}
                disabled={isUploading}
                className="absolute top-4 right-4 text-purple-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-serif-display font-bold text-white mb-1 flex items-center gap-2">
                <Upload size={22} className="text-pink-400" />
                <span>Add Multiple Photos (Up to 200)</span>
              </h3>
              <p className="text-xs text-purple-200/80 mb-5">
                Select multiple pictures from your device at once or paste multiple photo URLs.
              </p>

              <form onSubmit={handleBatchAddPhotos} className="space-y-4 text-left overflow-y-auto pr-1 flex-1">
                {/* Drag & Drop Multiple File Input */}
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1">
                    Select Photos from Device (Multiple Allowed)
                  </label>
                  <label className="border-2 border-dashed border-pink-400/40 hover:border-pink-400 rounded-2xl p-4 flex flex-col items-center justify-center bg-purple-950/40 cursor-pointer transition-all hover:bg-purple-900/30 group">
                    <Upload size={28} className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-purple-200">
                      Click to choose up to 200 photo files
                    </span>
                    <span className="text-[10px] text-purple-300/70 mt-1">
                      PNG, JPG, JPEG, WEBP files supported
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      onChange={handleMultipleFilesUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected Files Thumbnail Previews */}
                {filePreviews.length > 0 && (
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-green-400" />
                        {filePreviews.length} Photo{filePreviews.length > 1 ? 's' : ''} Selected
                      </span>
                      <button
                        type="button"
                        onClick={clearAllSelectedFiles}
                        disabled={isUploading}
                        className="text-[10px] font-bold text-pink-400 hover:text-pink-300 cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                      {filePreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-pink-400/30 group">
                          <img src={preview.url} alt="Thumbnail" className="w-full h-full object-cover" />
                          {!isUploading && (
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(idx)}
                              className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                            >
                              <Trash2 size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Or Paste Multiple Image URLs */}
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1">
                    Or Paste Multiple Image URLs (One URL per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                    value={newPhotoUrlsText}
                    disabled={isUploading}
                    onChange={(e) => setNewPhotoUrlsText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-xs focus:outline-none focus:border-pink-400 font-mono"
                  />
                </div>

                {/* Optional Memory Caption */}
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1">
                    Caption for these Photos (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unforgettable Birthday Moments ❤️"
                    value={newPhotoCaption}
                    disabled={isUploading}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-400/30 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-pink-300">
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={14} className="animate-spin text-pink-400" />
                        Uploading Photos ({uploadProgress.current} / {uploadProgress.total})
                      </span>
                      <span>{uploadProgress.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-purple-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading || (selectedFiles.length === 0 && !newPhotoUrlsText.trim())}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-sm shadow-xl hover:opacity-90 disabled:opacity-50 cursor-pointer mt-4 flex items-center justify-center gap-2 glow-pink"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Uploading Photos...</span>
                    </>
                  ) : (
                    <span>Upload All Photos to Memory Gallery ✨</span>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {selectedIndex !== null && activePhotos[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
          >
            {/* Top Lightbox Bar with Prominent Back Button */}
            <div className="w-full max-w-5xl flex items-center justify-between z-10 pt-2 pb-4">
              <button
                onClick={closeLightbox}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer border border-white/30 glow-pink"
              >
                <ArrowLeft size={18} />
                <span>← Back to Gallery</span>
              </button>

              <div className="text-purple-200 text-xs sm:text-sm font-semibold tracking-wider bg-white/10 px-4 py-1.5 rounded-full border border-white/20 hidden sm:block">
                Photo {selectedIndex + 1} of {activePhotos.length}
              </div>

              <button
                onClick={closeLightbox}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20"
                title="Close Lightbox View"
              >
                <X size={22} />
              </button>
            </div>

            {/* Previous Photo Arrow */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 backdrop-blur-md border border-white/20 shadow-xl"
              title="Previous Photo"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Photo Arrow */}
            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 backdrop-blur-md border border-white/20 shadow-xl"
              title="Next Photo"
            >
              <ChevronRight size={28} />
            </button>

            {/* Center Polaroid Photo Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full flex flex-col items-center my-auto py-2 z-10"
            >
              <div className="polaroid-card p-4 sm:p-6 md:p-7 rounded-2xl max-w-lg sm:max-w-xl w-full text-center shadow-2xl relative">
                <div className="w-full max-h-[65vh] rounded-xl overflow-hidden bg-gray-950/5 mb-4 shadow-inner flex items-center justify-center p-1">
                  <img
                    src={getFullImageUrl(activePhotos[selectedIndex].url, selectedIndex)}
                    alt={activePhotos[selectedIndex].caption}
                    className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_POLAROID_PHOTOS[selectedIndex % DEFAULT_POLAROID_PHOTOS.length].url;
                    }}
                  />
                </div>

                <h4 className="font-handwriting text-3xl md:text-4xl text-gray-900 font-bold leading-tight">
                  {activePhotos[selectedIndex].caption}
                </h4>

                <p className="text-xs text-gray-500 font-sans mt-1">
                  Photo {selectedIndex + 1} of {activePhotos.length}
                </p>

                {/* Footer Controls inside Polaroid */}
                <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                  <button
                    onClick={closeLightbox}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-all border border-gray-300 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={(e) => handleDeletePhoto(activePhotos[selectedIndex], e)}
                    className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-red-200 cursor-pointer shadow-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete Photo 🗑️</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
