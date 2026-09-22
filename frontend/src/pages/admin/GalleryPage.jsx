import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit2, Upload, ArrowUp, ArrowDown, Images } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import { photoService } from '../../services/photoService';

export default function GalleryPage() {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedBirthdayId, setSelectedBirthdayId] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [takenAt, setTakenAt] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      const res = await birthdayService.getAll();
      const list = res.data || [];
      setBirthdays(list);
      if (list.length > 0) {
        setSelectedBirthdayId(list[0].id);
        loadPhotos(list[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadPhotos = async (birthdayId) => {
    setLoading(true);
    try {
      const res = await photoService.getPhotos(birthdayId);
      setPhotos(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdayChange = (e) => {
    const id = e.target.value;
    setSelectedBirthdayId(id);
    loadPhotos(id);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleAddPhotos = async (e) => {
    e.preventDefault();
    if (!selectedBirthdayId) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      
      // Append multiple files
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formData.append('photos[]', file);
        });
      }

      // Append multiple URLs
      if (imageUrls.trim()) {
        formData.append('image_urls', imageUrls);
      }

      if (caption) formData.append('caption', caption);
      if (description) formData.append('description', description);
      if (takenAt) formData.append('taken_at', takenAt);

      const res = await photoService.addPhotosBatch(selectedBirthdayId, formData);
      setMessage(res.message || 'Photos added to gallery! ✨');
      setCaption('');
      setDescription('');
      setTakenAt('');
      setImageUrls('');
      setImageFiles([]);
      loadPhotos(selectedBirthdayId);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to upload photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Delete this photo from the gallery?')) {
      try {
        await photoService.deletePhoto(selectedBirthdayId, photoId);
        setMessage('Photo removed.');
        loadPhotos(selectedBirthdayId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReorder = async (photoId, direction) => {
    const idx = photos.findIndex(p => p.id === photoId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;

    const newPhotos = [...photos];
    const temp = newPhotos[idx];
    newPhotos[idx] = newPhotos[targetIdx];
    newPhotos[targetIdx] = temp;

    const orderPayload = newPhotos.map((p, i) => ({ id: p.id, sort_order: i + 1 }));
    setPhotos(newPhotos);

    try {
      await photoService.reorderPhotos(selectedBirthdayId, orderPayload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-white">Photo Gallery Manager</h2>
          <p className="text-xs text-purple-200/70">Upload multiple photos, reorder, and manage gallery items</p>
        </div>

        {birthdays.length > 0 && (
          <select
            value={selectedBirthdayId}
            onChange={handleBirthdayChange}
            className="p-3 rounded-xl bg-purple-950/80 border border-pink-500/30 text-white text-xs"
          >
            {birthdays.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} (/birthday/{b.slug})
              </option>
            ))}
          </select>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-200 text-xs">
          {message}
        </div>
      )}

      {/* Add Multiple Photos Form */}
      <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
        <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <Images size={20} className="text-pink-400" />
          <span>Batch Photo Upload (Multiple Photos)</span>
        </h3>

        <form onSubmit={handleAddPhotos} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Upload Multiple Photo Files
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-xs text-purple-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30 cursor-pointer"
              />
              {imageFiles.length > 0 && (
                <span className="text-[11px] text-emerald-300 font-semibold mt-1 inline-block">
                  ✓ {imageFiles.length} file(s) selected for upload
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Or Paste Image URLs (Separated by newlines or commas)
              </label>
              <textarea
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1... &#10;https://images.unsplash.com/photo-2..."
                rows={2}
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-xs placeholder-purple-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Batch Caption / Title Tag (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Summer Memories ☀️"
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm placeholder-purple-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Date Taken (Optional)
              </label>
              <input
                type="date"
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Description / Memory Story (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description applied to this batch..."
              rows={2}
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm placeholder-purple-300/40"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || (imageFiles.length === 0 && !imageUrls.trim())}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload size={16} />
            <span>
              {uploading 
                ? 'Uploading Multiple Photos...' 
                : `Upload ${imageFiles.length > 1 ? imageFiles.length + ' Photos' : 'Multiple Photos'}`
              }
            </span>
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
        <h3 className="text-lg font-bold font-serif-display text-white mb-2">
          Current Gallery Photos ({photos.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-purple-200">
            <Sparkles className="animate-spin text-pink-400 mr-2" size={20} />
            <span>Loading Gallery...</span>
          </div>
        ) : photos.length === 0 ? (
          <p className="text-purple-200/60 text-xs text-center py-6">
            No photos in this gallery yet. Select multiple photos above to upload!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div key={photo.id} className="glass-card rounded-2xl overflow-hidden border border-pink-500/20 p-3 flex flex-col justify-between">
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-purple-950 mb-3 border border-white/10 relative">
                    <img src={photo.image_path} alt={photo.caption} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{photo.caption || 'Untitled'}</h4>
                  {photo.taken_at && <span className="text-[10px] text-pink-300 block mt-0.5">{photo.taken_at}</span>}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(photo.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded bg-white/5 text-purple-200 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => handleReorder(photo.id, 'down')}
                      disabled={idx === photos.length - 1}
                      className="p-1 rounded bg-white/5 text-purple-200 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
